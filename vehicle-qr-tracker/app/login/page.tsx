'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {

  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {

    setLoading(true)
    setError('')

    try {

      const res = await fetch('/api/auth/login', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          username,
          password
        })

      })

      const data = await res.json()

      if (!res.ok) {

        setError(data.error || "Login failed")
        setLoading(false)
        return

      }

      // redirect to dashboard
      router.push('/dashboard')

    }
    catch {

      setError("Network error")
      setLoading(false)

    }

  }

  return (

    <div style={{

      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#0B1F3A",
      color: "white"

    }}>

      <div style={{

        background: "#112B4A",
        padding: 40,
        borderRadius: 10,
        width: 350

      }}>

        <h1 style={{ marginBottom: 20 }}>
          Sherullah QR - Transport Portal
        </h1>

        <h2 style={{ marginBottom: 20 }}>
          Login
        </h2>


        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        />


        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#C9A227",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>


        {error && (

          <div style={{
            color: "red",
            marginTop: 10
          }}>
            {error}
          </div>

        )}

      </div>

    </div>

  )

}