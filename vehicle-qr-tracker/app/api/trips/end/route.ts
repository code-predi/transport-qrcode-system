import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

  const body = await req.json()

  const trip = await prisma.trip.findFirst({
    where: {
      vehicleId: body.vehicleId,
      status: "IN_PROGRESS",
    },
  })

  if (!trip) {
    return NextResponse.json({ error: "No active trip" })
  }

  const updatedTrip = await prisma.trip.update({
    where: { id: trip.id },
    data: {
      endTime: new Date(),
      status: "COMPLETED",
    },
  })

  return NextResponse.json(updatedTrip)

}