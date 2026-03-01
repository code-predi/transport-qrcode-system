import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username" },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    // Create session cookie
    const cookieStore = await cookies()

    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    })

    return NextResponse.json({
      success: true,
      username: user.username,
      role: user.role,
    })

  } catch (error) {

    console.error("Login error:", error)

    return NextResponse.json(
      { error: "Login failed. Database may be sleeping." },
      { status: 500 }
    )

  }

}