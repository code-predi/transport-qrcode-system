import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

  const body = await req.json()

  const trip = await prisma.trip.create({
    data: {
      vehicleId: body.vehicleId,
      startTime: new Date(),
      status: "IN_PROGRESS",
    },
  })

  return NextResponse.json(trip)

}