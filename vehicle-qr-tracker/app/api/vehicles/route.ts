import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber: body.plateNumber,
        carModel: body.carModel,
        driverName: body.driverName,
      },
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Vehicle creation failed' },
      { status: 500 }
    )
  }
}