import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {

  try {

    const trips = await prisma.trip.findMany({

      where: {
        status: "IN_PROGRESS"
      },

      include: {
        vehicle: true,
        operator: true,
        shift: true
      },

      orderBy: {
        startTime: 'desc'
      }

    })

    const result = trips.map(trip => ({

      tripId: trip.id,

      vehicleId: trip.vehicle.id,

      plateNumber: trip.vehicle.plateNumber,

      carModel: trip.vehicle.carModel,

      driverName: trip.vehicle.driverName,

      operator: trip.operator?.username || "Unknown",

      shift: trip.shift?.name || "No shift",

      startTime: trip.startTime,

      durationMinutes: Math.floor(
        (Date.now() - new Date(trip.startTime).getTime()) / 60000
      )

    }))

    return NextResponse.json(result)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to load active trips" },
      { status: 500 }
    )

  }

}