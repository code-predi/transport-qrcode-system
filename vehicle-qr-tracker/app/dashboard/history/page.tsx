'use client'

import { useEffect, useState } from 'react'

export default function TripHistoryPage() {

  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadTrips = async () => {

    try {

      const res = await fetch('/api/trips/history?limit=200')

      if (res.ok) {

        const data = await res.json()
        setTrips(data)

      }

    } catch (error) {

      console.error(error)

    }

    setLoading(false)

  }

  useEffect(() => {

    loadTrips()

  }, [])


  const exportExcel = () => {

    window.open('/api/trips/export', '_blank')

  }


  const activeCount = trips.filter(t => t.status === "IN_PROGRESS").length
  const completedCount = trips.filter(t => t.status === "COMPLETED").length


  if (loading)
    return (
      <div style={{
        padding: 30,
        color: "#0B1F3A"
      }}>
        Loading trip history...
      </div>
    )


  return (

    <div style={{
      padding: 30,
      color: "#0B1F3A"
    }}>


      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>

        <div>

          <h1 style={{
            margin: 0,
            color: "#0B1F3A"
          }}>
            Trip History
          </h1>

          <div style={{
            marginTop: 6,
            color: "#444"
          }}>
            Total: {trips.length}
            {" | "}
            Active: {activeCount}
            {" | "}
            Completed: {completedCount}
          </div>

        </div>


        <div style={{
          display: "flex",
          gap: 10
        }}>

          <button
            onClick={exportExcel}
            style={{
              padding: "10px 18px",
              background: "#C6A75E",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Export Excel
          </button>


        </div>

      </div>



      {/* Trip Cards */}
      {trips.map(trip => {

        const isActive = trip.status === "IN_PROGRESS"

        return (

          <div
            key={trip.tripId}
            style={{
              border: "1px solid #ddd",
              padding: 18,
              marginBottom: 12,
              borderRadius: 10,
              background: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}
          >


            {/* Top Row */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8
            }}>

              <strong style={{
                fontSize: 18,
                color: "#0B1F3A"
              }}>
                {trip.plateNumber}
              </strong>


              <strong style={{
                color: isActive ? "#00c853" : "#2962ff"
              }}>
                {trip.status}
              </strong>

            </div>


            <div>Model: {trip.carModel}</div>

            <div>Driver: {trip.driverName}</div>

            <div>Operator: {trip.operator}</div>

            <div>Shift: {trip.shift}</div>

            <div>
              Duration:
              {trip.durationMinutes !== null
                ? ` ${trip.durationMinutes} min`
                : " Active"}
            </div>


            <div>
              Start: {new Date(trip.startTime).toLocaleString()}
            </div>


            {trip.endTime && (

              <div>
                End: {new Date(trip.endTime).toLocaleString()}
              </div>

            )}

          </div>

        )

      })}


    </div>

  )

}