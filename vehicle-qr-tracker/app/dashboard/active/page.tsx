'use client'

import { useEffect, useState } from 'react'

export default function ActiveVehiclesPage() {

  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadTrips = async () => {

    try {

      const res = await fetch('/api/trips/active')

      if (res.ok) {

        const data = await res.json()
        setTrips(data)

      }

    } catch (err) {

      console.error(err)

    }

    setLoading(false)

  }

  useEffect(() => {

    loadTrips()

    const interval = setInterval(loadTrips, 5000)

    return () => clearInterval(interval)

  }, [])

  const activeCount = trips.length

  if (loading)
    return <div style={{ padding: 20 }}>Loading active vehicles...</div>

  return (

    <div style={{ padding: 30 }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>

        <div>

          <h1 style={{ margin: 0 }}>
            Active Vehicles
          </h1>

          <div style={{
            marginTop: 5,
            fontSize: 18,
            color: "#00c853"
          }}>
            {activeCount} vehicle{activeCount !== 1 ? 's' : ''} active
          </div>

        </div>

      </div>


      {/* Empty state */}
      {activeCount === 0 && (

        <div style={{
          marginTop: 20,
          fontSize: 18,
          color: "#888"
        }}>
          No vehicles currently active
        </div>

      )}


      {/* Active vehicle cards */}
      {trips.map(trip => (

        <div
          key={trip.tripId}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: "#111"
          }}
        >

          <strong style={{ fontSize: 18 }}>
            {trip.plateNumber}
          </strong>

          <div>Model: {trip.carModel}</div>

          <div>Driver: {trip.driverName}</div>

          <div>Operator: {trip.operator}</div>

          <div>Shift: {trip.shift}</div>

          <div>
            Duration:
            <strong style={{ marginLeft: 5 }}>
              {trip.durationMinutes} min
            </strong>
          </div>

        </div>

      ))}

    </div>

  )

}