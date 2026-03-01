import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {

  try {

    const now = new Date()

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )

    const [
      activeTrips,
      tripsToday,
      totalVehicles,
      totalOperators,
      activeShift
    ] = await Promise.all([

      prisma.trip.count({
        where: { status: "IN_PROGRESS" }
      }),

      prisma.trip.count({
        where: {
          startTime: { gte: startOfDay }
        }
      }),

      prisma.vehicle.count(),

      prisma.user.count(),

      prisma.shift.findFirst({
        where: { active: true }
      })

    ])

    return NextResponse.json({

      activeTrips,
      tripsToday,
      totalVehicles,
      totalOperators,
      activeShift: activeShift?.name || "None",
      systemStatus: "Online"

    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    )

  }

}