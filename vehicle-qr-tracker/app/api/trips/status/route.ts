import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const vehicleId = searchParams.get('vehicleId')

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehicle ID required" },
        { status: 400 }
      )
    }

    const trip = await prisma.trip.findFirst({
      where: {
        vehicleId,
        status: "IN_PROGRESS"
      }
    })

    return NextResponse.json({
      active: !!trip
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to check trip status" },
      { status: 500 }
    )

  }

}