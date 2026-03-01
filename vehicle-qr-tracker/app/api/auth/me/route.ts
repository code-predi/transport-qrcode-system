import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {

  const cookieStore = await cookies()

  const userId = cookieStore.get('userId')?.value

  if (!userId) {
    return NextResponse.json(null)
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
    },
  })

  return NextResponse.json(user)

}