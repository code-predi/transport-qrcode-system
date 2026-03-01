import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {

  try {

    const vehicles = await prisma.vehicle.findMany({

      include: {
        trips: true
      },

      orderBy: {
        createdAt: 'desc'
      }

    })

    const result = vehicles.map(vehicle => ({

      id: vehicle.id,

      plateNumber: vehicle.plateNumber,

      carModel: vehicle.carModel,

      driverName: vehicle.driverName,

      active: vehicle.active,

      tripCount: vehicle.trips.length,

      createdAt: vehicle.createdAt

    }))

    return NextResponse.json(result)

  }
  catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to load vehicles" },
      { status: 500 }
    )

  }

}