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
      activeShift,
      tripsPerShift,
      activeOperators
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
      }),

      prisma.trip.groupBy({
        by: ['shiftId'],
        _count: true,
        where: {
          startTime: { gte: startOfDay }
        }
      }),

      prisma.trip.findMany({
        where: { status: "IN_PROGRESS" },
        include: {
          operator: true
        }
      })

    ])


    const uniqueOperators =
      new Set(
        activeOperators.map(
          t => t.operator?.username
        )
      ).size


    return NextResponse.json({

      activeTrips,
      tripsToday,
      totalVehicles,
      totalOperators,
      activeShift: activeShift?.name || "None",
      uniqueOperators,
      tripsPerShiftCount: tripsPerShift.length,
      systemHealth: "Healthy"

    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to load live stats" },
      { status: 500 }
    )

  }

}