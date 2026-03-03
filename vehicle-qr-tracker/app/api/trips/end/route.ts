import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {

  try {

    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const { vehicleId, latitude, longitude } = body

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehicle ID required" },
        { status: 400 }
      )
    }

    // VERIFY VEHICLE EXISTS
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      )
    }

    // FIND ACTIVE TRIP
    const trip = await prisma.trip.findFirst({
      where: {
        vehicleId,
        status: "IN_PROGRESS",
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: "No active trip found" },
        { status: 400 }
      )
    }

    const endTime = new Date()

    const durationMinutes =
      Math.round(
        (endTime.getTime() - trip.startTime.getTime()) / 60000
      )

    const updatedTrip = await prisma.trip.update({
      where: { id: trip.id },
      data: {
        endTime,
        status: "COMPLETED",
        operatorId: userId,
        endLocation: latitude && longitude
          ? `${latitude},${longitude}`
          : null,
      },
    })

    return NextResponse.json({
      ...updatedTrip,
      durationMinutes,
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to end trip" },
      { status: 500 }
    )

  }

}