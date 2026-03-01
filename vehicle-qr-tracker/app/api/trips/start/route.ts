import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateActiveShift } from '@/lib/shiftScheduler'

export async function POST(req: Request) {

  try {

    // =============================
    // AUTHENTICATION CHECK
    // =============================
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }


    // =============================
    // READ REQUEST BODY
    // =============================
    const body = await req.json()

    const { vehicleId, latitude, longitude } = body

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehicle ID required" },
        { status: 400 }
      )
    }


    // =============================
    // CHECK VEHICLE EXISTS
    // =============================
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      )
    }


    // =============================
    // VEHICLE ACTIVE LOCK
    // =============================
    if (!vehicle.active) {
      return NextResponse.json(
        { error: "Vehicle is INACTIVE and cannot start trips" },
        { status: 403 }
      )
    }


    // =============================
    // SHIFT LOCK (CRITICAL SAFETY)
    // =============================
    await updateActiveShift()
    const activeShift = await prisma.shift.findFirst({
      where: { active: true },
    })

    if (!activeShift) {
      return NextResponse.json(
        { error: "No active shift. Trip cannot be started." },
        { status: 403 }
      )
    }


    // =============================
    // PREVENT DUPLICATE ACTIVE TRIP
    // =============================
    const existingTrip = await prisma.trip.findFirst({
      where: {
        vehicleId,
        status: "IN_PROGRESS",
      },
    })

    if (existingTrip) {
      return NextResponse.json(
        { error: "Trip already active for this vehicle" },
        { status: 400 }
      )
    }


    // =============================
    // CREATE TRIP
    // =============================
    const trip = await prisma.trip.create({

      data: {

        vehicleId,

        operatorId: userId,

        shiftId: activeShift.id,

        startTime: new Date(),

        status: "IN_PROGRESS",

        startLocation:
          latitude && longitude
            ? `${latitude},${longitude}`
            : null,

      },

      include: {
        vehicle: true,
        shift: true,
      },

    })


    // =============================
    // SUCCESS RESPONSE
    // =============================
    return NextResponse.json({
      success: true,
      tripId: trip.id,
      vehicleId: trip.vehicleId,
      shift: activeShift.name,
      startTime: trip.startTime
    })


  } catch (error) {

    console.error("START TRIP ERROR:", error)

    return NextResponse.json(
      {
        error: "Failed to start trip",
      },
      { status: 500 }
    )

  }

}