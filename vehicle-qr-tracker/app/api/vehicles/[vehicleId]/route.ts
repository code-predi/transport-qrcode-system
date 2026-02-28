import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  context: { params: Promise<{ vehicleId: string }> }
) {

  const { vehicleId } = await context.params

  if (!vehicleId) {
    return NextResponse.json(
      { error: "Missing vehicleId" },
      { status: 400 }
    )
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
  })

  if (!vehicle) {
    return NextResponse.json(
      { error: "Vehicle not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(vehicle)

}