'use client'

import LogoutButton from '@/components/LogoutButton'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ScanClient() {

  const searchParams = useSearchParams()
  const vehicleId = searchParams.get('vehicleId')

  const [vehicle, setVehicle] = useState<any>(null)
  const [operator, setOperator] = useState<any>(null)
  const [shift, setShift] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [tripActive, setTripActive] = useState(false)

  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)


  // Load operator
  useEffect(() => {

    fetch('/api/auth/me', { cache: 'no-store' })
      .then(res => res.json())
      .then(setOperator)
      .catch(() => setOperator(null))

  }, [])


  // Load active shift
  useEffect(() => {

    fetch('/api/shifts/active', { cache: 'no-store' })
      .then(res => res.json())
      .then(setShift)
      .catch(() => setShift(null))

  }, [])


  // Load vehicle info
  useEffect(() => {

    if (!vehicleId) {
      setLoading(false)
      return
    }

    const loadVehicle = async () => {

      try {

        const res = await fetch(`/api/vehicles/${vehicleId}`, {
          cache: 'no-store'
        })

        if (!res.ok) {
          setVehicle(null)
          setLoading(false)
          return
        }

        const data = await res.json()
        setVehicle(data)

      } catch {

        setVehicle(null)

      }

      setLoading(false)

    }

    loadVehicle()

  }, [vehicleId])


  // Auto-refresh trip status
  useEffect(() => {

    if (!vehicleId) return

    const loadStatus = async () => {

      try {

        const res = await fetch(
          `/api/trips/status?vehicleId=${vehicleId}`,
          { cache: 'no-store' }
        )

        if (res.ok) {

          const data = await res.json()
          setTripActive(data.active)

        }

      } catch {}

    }

    loadStatus()

    const interval = setInterval(loadStatus, 3000)

    return () => clearInterval(interval)

  }, [vehicleId])



  const startTrip = async () => {

    if (!vehicle?.active) {

      alert("Vehicle is inactive")
      return

    }

    if (starting) return

    setStarting(true)

    const sendRequest = async (coords?: any) => {

      const body: any = { vehicleId }

      if (coords) {

        body.latitude = coords.latitude
        body.longitude = coords.longitude

      }

      const res = await fetch('/api/trips/start', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(body)

      })

      if (!res.ok) {

        const err = await res.json()
        alert(err.error || "Failed to start trip")

      } else {

        setTripActive(true)
        alert("Trip started successfully")

      }

      setStarting(false)

    }

    navigator.geolocation.getCurrentPosition(

      pos => sendRequest(pos.coords),

      () => sendRequest()

    )

  }



  const endTrip = async () => {

    if (ending) return

    if (!confirm("End this trip?")) return

    setEnding(true)

    const sendRequest = async (coords?: any) => {

      const body: any = { vehicleId }

      if (coords) {

        body.latitude = coords.latitude
        body.longitude = coords.longitude

      }

      const res = await fetch('/api/trips/end', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(body)

      })

      const data = await res.json()

      if (!res.ok) {

        alert(data.error || "Failed to end trip")

      } else {

        setTripActive(false)

        alert(
          `Trip ended successfully.\nDuration: ${data.durationMinutes} minutes`
        )

      }

      setEnding(false)

    }

    navigator.geolocation.getCurrentPosition(

      pos => sendRequest(pos.coords),

      () => sendRequest()

    )

  }



  if (loading)
    return <div style={{ padding: 20 }}>Loading...</div>


  if (!vehicle)
    return <div style={{ padding: 20 }}>Vehicle not found</div>



  return (

    <div style={{ padding: 20 }}>


      {/* Header */}

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20
      }}>

        <div>

          <div>
            <strong>
              Operator: {operator?.username || "Unknown"}
            </strong>
          </div>

          <div style={{ marginTop: 5 }}>
            Active Shift:
            <strong>
              {" "}
              {shift?.name || "No active shift"}
            </strong>
          </div>

        </div>

        <LogoutButton />

      </div>



      {/* Vehicle Info */}

      <h1>{vehicle.plateNumber}</h1>

      <h2>{vehicle.carModel}</h2>

      <h3>Driver: {vehicle.driverName}</h3>



      {/* Vehicle Status */}

      <div style={{ marginTop: 10 }}>

        Vehicle Status:

        <strong style={{
          marginLeft: 5,
          color: vehicle.active ? "green" : "red"
        }}>

          {vehicle.active ? "ACTIVE" : "INACTIVE"}

        </strong>

      </div>



      {/* Trip Status */}

      <div style={{ marginTop: 10 }}>

        Trip Status:

        <strong style={{
          marginLeft: 5,
          color: tripActive ? "green" : "gray"
        }}>

          {tripActive ? "ACTIVE TRIP" : "IDLE"}

        </strong>

      </div>



      {/* Warning */}

      {!vehicle.active && (

        <div style={{
          marginTop: 20,
          color: "red",
          fontWeight: "bold"
        }}>
          Vehicle inactive — cannot operate
        </div>

      )}



      {/* Buttons */}

      <div style={{ marginTop: 30 }}>

        {tripActive ? (

          <button
            onClick={endTrip}
            disabled={ending}
            style={{
              fontSize: 20,
              padding: "12px 24px",
              background: "#ff3d00",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >

            {ending
              ? "Ending Trip..."
              : "End Trip"}

          </button>

        ) : (

          <button
            onClick={startTrip}
            disabled={starting || !vehicle.active}
            style={{
              fontSize: 20,
              padding: "12px 24px",
              background: "#00c853",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >

            {starting
              ? "Starting Trip..."
              : "Start Trip"}

          </button>

        )}

      </div>


    </div>

  )

}