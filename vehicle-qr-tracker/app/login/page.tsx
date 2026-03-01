'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {

  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const login = async () => {

    setError('')
    setLoading(true)

    try {

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      router.push('/dashboard')

    }
    catch {

      setError('Connection failed')
      setLoading(false)

    }

  }



  return (

    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0B1F3A, #132F57)'
    }}>



      {/* LOGIN CARD */}

      <div style={{
        width: 400,
        padding: 40,
        borderRadius: 16,
        background: '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
      }}>



        {/* TITLE */}

        <div style={{
          textAlign: 'center',
          marginBottom: 30
        }}>

          <div style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#0B1F3A'
          }}>
            Sherullah QR
          </div>

          <div style={{
            fontSize: 18,
            color: '#C6A01B',
            fontWeight: 600,
            marginTop: 5
          }}>
            Transport Portal
          </div>

        </div>



        {/* USERNAME */}

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={inputStyle}
        />



        {/* PASSWORD */}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={inputStyle}
        />



        {/* ERROR */}

        {error && (

          <div style={{
            color: '#cc0000',
            marginBottom: 10,
            fontWeight: 600
          }}>
            {error}
          </div>

        )}



        {/* BUTTON */}

        <button
          onClick={login}
          disabled={loading}
          style={{

            width: '100%',
            padding: 14,
            borderRadius: 10,
            border: 'none',

            background: '#C6A01B',
            color: '#0B1F3A',

            fontWeight: 700,
            fontSize: 16,

            cursor: 'pointer'
          }}
        >

          {loading ? 'Signing in...' : 'Login'}

        </button>



      </div>


    </div>

  )

}



/* ========================= */

const inputStyle = {

  width: '100%',
  padding: 12,
  marginBottom: 15,

  borderRadius: 8,
  border: '1px solid #ccc',

  fontSize: 15,
  outline: 'none',

  background: '#f9f9f9',
  color: '#000'

} as const