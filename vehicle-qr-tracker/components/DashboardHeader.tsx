'use client'

import { useEffect, useState } from 'react'
import { useLiveData } from '@/lib/useLiveData'
export default function DashboardHeader() {

  const [operator, setOperator] = useState<any>(null)
  const [shift, setShift] = useState<any>(null)
  const [time, setTime] = useState<string | null>(null)
  const [systemOnline, setSystemOnline] = useState(true)


  // Load operator
  useEffect(() => {

    fetch('/api/auth/me', {
  cache: 'no-store'
})
      .then(res => res.json())
      .then(setOperator)
      .catch(() => setOperator(null))

  }, [])


  // Load active shift
  useEffect(() => {

    fetch('/api/shifts/active', {
  cache: 'no-store'
})
      .then(res => res.json())
      .then(setShift)
      .catch(() => setShift(null))

  }, [])


  // Live clock
useEffect(() => {

  const updateClock = () => {

    const now = new Date()

    const formatted =
      now.getHours().toString().padStart(2, '0') +
      ':' +
      now.getMinutes().toString().padStart(2, '0') +
      ':' +
      now.getSeconds().toString().padStart(2, '0')

    setTime(formatted)

  }

  updateClock()

  const interval = setInterval(updateClock, 1000)

  return () => clearInterval(interval)

}, [])


  // System health check
  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const res = await fetch('/api/auth/me', {
  cache: 'no-store'
})

        setSystemOnline(res.ok)

      } catch {

        setSystemOnline(false)

      }

    }, 5000)

    return () => clearInterval(interval)

  }, [])



  return (

    <div style={{
      background: "white",
      padding: "12px 20px",
      borderBottom: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>


      {/* Left Section */}
      <div style={{
        display: "flex",
        gap: 30,
        alignItems: "center"
      }}>

        <HeaderItem
          label="Operator"
          value={operator?.username || "Unknown"}
        />

        <HeaderItem
          label="Active Shift"
          value={shift?.name || "None"}
        />

      </div>



      {/* Right Section */}
      <div style={{
        display: "flex",
        gap: 30,
        alignItems: "center"
      }}>

        {/* Clock */}
        <HeaderItem
          label="Time"
          value={time || "--:--:--"}
        />


        {/* System Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>

          <div style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: systemOnline ? "#00c853" : "#ff3d00"
          }} />

          <span style={{
            fontWeight: "bold",
            color: systemOnline ? "#00c853" : "#ff3d00"
          }}>
            {systemOnline ? "Online" : "Offline"}
          </span>

        </div>

      </div>


    </div>

  )

}



function HeaderItem({
  label,
  value
}: any) {

  return (

    <div>

      <div style={{
        fontSize: 12,
        color: "#666"
      }}>
        {label}
      </div>

      <div style={{
        fontWeight: "bold",
        color: "#0B1F3A"
      }}>
        {value}
      </div>

    </div>

  )

}