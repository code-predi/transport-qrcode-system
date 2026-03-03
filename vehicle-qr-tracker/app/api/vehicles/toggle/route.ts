import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

  try {

    const { vehicleId } = await req.json()

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle)
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      )

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        active: vehicle.active ? false : true
      }
    })

    return NextResponse.json({
      success: true,
      active: updated.active
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Toggle failed" },
      { status: 500 }
    )

  }

}