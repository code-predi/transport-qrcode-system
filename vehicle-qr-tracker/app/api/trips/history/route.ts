import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const vehicleId = searchParams.get('vehicleId')
    const limitParam = searchParams.get('limit')

    const limit = limitParam ? parseInt(limitParam) : 100

    const trips = await prisma.trip.findMany({

      where: vehicleId
        ? { vehicleId }
        : undefined,

      include: {
        vehicle: true,
        operator: true,
        shift: true
      },

      orderBy: {
        startTime: 'desc'
      },

      take: limit

    })

    const result = trips.map(trip => {

      const durationMinutes = trip.endTime
        ? Math.floor(
            (new Date(trip.endTime).getTime() -
             new Date(trip.startTime).getTime()) / 60000
          )
        : null

      return {

        tripId: trip.id,

        vehicleId: trip.vehicle.id,

        plateNumber: trip.vehicle.plateNumber,

        carModel: trip.vehicle.carModel,

        driverName: trip.vehicle.driverName,

        operator: trip.operator?.username || "Unknown",

        shift: trip.shift?.name || "No shift",

        startTime: trip.startTime,

        endTime: trip.endTime,

        durationMinutes,

        status: trip.status

      }

    })

    return NextResponse.json(result)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to load trip history" },
      { status: 500 }
    )

  }

}