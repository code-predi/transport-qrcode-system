'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import LogoutButton from '@/components/LogoutButton'

export default function HomePage() {

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadUser = async () => {

      try {

        const res = await fetch('/api/auth/me')

        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }

      } catch {}

      setLoading(false)

    }

    loadUser()

  }, [])

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>
  }

  if (!user) {

    return (
      <div style={{ padding: 40 }}>

        <h1>Transport QR Tracking System</h1>

        <Link href="/login">
          <button style={{ fontSize: 18 }}>
            Login
          </button>
        </Link>

      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>

      <h1>Transport QR Tracking System</h1>

      <p>Welcome, <strong>{user.username}</strong></p>

      <br />

      <Link href="/scan">
        <button style={{ fontSize: 18, marginRight: 10 }}>
          Scan Vehicle
        </button>
      </Link>

      {user.role === "ADMIN" && (
        <Link href="/register">
          <button style={{ fontSize: 18, marginRight: 10 }}>
            Register Vehicle
          </button>
        </Link>
      )}

      <LogoutButton />

    </div>
  )
}