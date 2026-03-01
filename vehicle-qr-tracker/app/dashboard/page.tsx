'use client'

import { useEffect, useState } from 'react'

export default function DashboardPage() {

  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {

    try {

      const res = await fetch('/api/dashboard/live', {
  cache: 'no-store'
})

      if (res.ok) {

        const data = await res.json()
        setStats(data)

      }

    } catch (error) {

      console.error(error)

    }

    setLoading(false)

  }

  useEffect(() => {

    loadStats()

    const interval = setInterval(loadStats, 3000)

    return () => clearInterval(interval)

  }, [])


  if (loading || !stats)
    return (
      <div style={{ padding: 30 }}>
        Loading dashboard...
      </div>
    )


  return (

    <div style={{ padding: 30 }}>

      <h1 style={{
        color: "#0B1F3A",
        marginBottom: 20
      }}>
        Live Dashboard
      </h1>


      <div style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20
      }}>


        <StatCard
          title="Active Vehicles"
          value={stats.activeTrips}
          color="#00c853"
        />


        <StatCard
          title="Trips Today"
          value={stats.tripsToday}
          color="#2962ff"
        />


        <StatCard
          title="Active Operators"
          value={stats.uniqueOperators}
          color="#ff9800"
        />


        <StatCard
          title="Fleet Size"
          value={stats.totalVehicles}
          color="#9c27b0"
        />


        <StatCard
          title="Active Shift"
          value={stats.activeShift}
          color="#0B1F3A"
        />


        <StatCard
          title="System Health"
          value={stats.systemHealth}
          color="#00c853"
        />

      </div>


    </div>

  )

}



function StatCard({
  title,
  value,
  color
}: any) {

  return (

    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>

      <div style={{
        color: "#666",
        fontSize: 14
      }}>
        {title}
      </div>

      <div style={{
        fontSize: 28,
        fontWeight: "bold",
        color,
        marginTop: 6
      }}>
        {value}
      </div>

    </div>

  )

}