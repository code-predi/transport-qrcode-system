import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { updateActiveShift } from '@/lib/shiftScheduler'

export async function GET() {

  try {

    // =====================================
    // AUTO UPDATE SHIFT BASED ON TIME
    // =====================================
    await updateActiveShift()


    // =====================================
    // FETCH CURRENT ACTIVE SHIFT
    // =====================================
    const shift = await prisma.shift.findFirst({
      where: {
        active: true
      }
    })


    // =====================================
    // RETURN RESULT
    // =====================================
    return NextResponse.json(shift)


  } catch (error) {

    console.error("ACTIVE SHIFT ERROR:", error)

    return NextResponse.json(
      {
        error: "Failed to load active shift"
      },
      {
        status: 500
      }
    )

  }

}