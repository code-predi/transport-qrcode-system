import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { updateActiveShift } from '@/lib/shiftScheduler'

export async function GET() {

  try {

    // Ensure correct shift is active
    await updateActiveShift()

    const shifts = await prisma.shift.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(shifts)

  }
  catch (error) {

    console.error("SHIFTS LOAD ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load shifts" },
      { status: 500 }
    )

  }

}