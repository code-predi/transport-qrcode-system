'use client'

import Sidebar from '@/components/Sidebar'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [operator, setOperator] = useState<any>(null)
  const [shift, setShift] = useState<any>(null)
  const [time, setTime] = useState('')
  const [systemOnline, setSystemOnline] = useState(true)


  /* =============================
     LIVE CLOCK
     ============================= */

  useEffect(() => {

    const updateClock = () => {

      const now = new Date()

      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      )

    }

    updateClock()

    const interval = setInterval(updateClock, 1000)

    return () => clearInterval(interval)

  }, [])


  /* =============================
     LOAD OPERATOR
     ============================= */

  useEffect(() => {

    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setOperator(data))
      .catch(() => setSystemOnline(false))

  }, [])


  /* =============================
     LOAD ACTIVE SHIFT
     ============================= */

  useEffect(() => {

    fetch('/api/shifts/active')
      .then(res => res.json())
      .then(data => setShift(data))
      .catch(() => setSystemOnline(false))

  }, [])



  return (

    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--beige)'
    }}>

      {/* SIDEBAR */}

      <Sidebar />


      {/* MAIN AREA */}

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>



        {/* HEADER */}

        <div className="dashboard-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-soft)',
            background: 'var(--white)'
          }}
        >


          {/* LEFT INFO */}

          <div style={{
            display: 'flex',
            gap: 40,
            alignItems: 'center'
          }}>

            <HeaderItem
              label="Operator"
              value={operator?.username || "Loading"}
            />

            <HeaderItem
              label="Active Shift"
              value={shift?.name || "None"}
            />

          </div>



          {/* RIGHT INFO */}

          <div style={{
            display: 'flex',
            gap: 40,
            alignItems: 'center'
          }}>

            <HeaderItem
              label="Time"
              value={time}
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 600
            }}>

              <span className={`status-dot ${
                systemOnline
                ? 'status-online'
                : 'status-offline'
              }`} />

              <span style={{
                color: systemOnline
                  ? 'var(--success)'
                  : 'var(--danger)'
              }}>
                {systemOnline ? 'Online' : 'Offline'}
              </span>

            </div>

          </div>

        </div>



        {/* PAGE CONTENT */}

        <div style={{
          padding: 30
        }}>
          {children}
        </div>


      </div>


    </div>

  )

}



/* =============================
   HEADER ITEM COMPONENT
   ============================= */

function HeaderItem({
  label,
  value
}: {
  label: string
  value: string
}) {

  return (

    <div>

      <div style={{
        fontSize: 13,
        color: 'var(--text-muted)'
      }}>
        {label}
      </div>

      <div style={{
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--navy)'
      }}>
        {value}
      </div>

    </div>

  )

}