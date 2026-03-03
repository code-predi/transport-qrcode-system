import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

  const { shiftId } = await req.json()

  const shift = await prisma.shift.findUnique({
    where: { id: shiftId }
  })

  if (!shift) {

    return NextResponse.json(
      { error: "Shift not found" },
      { status: 404 }
    )
  }

  const overrideUntil = new Date()

  overrideUntil.setHours(
    shift.endHour,
    shift.endMin,
    0,
    0
  )

  await prisma.shift.updateMany({
    data: {
      active: false,
      overrideActive: false
    }
  })

  await prisma.shift.update({
    where: { id: shiftId },
    data: {
      active: true,
      overrideActive: true,
      overrideUntil
    }
  })

  return NextResponse.json({
    success: true
  })
}