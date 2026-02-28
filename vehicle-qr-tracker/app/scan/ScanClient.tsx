'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ScanClient() {

  const searchParams = useSearchParams()
  const vehicleId = searchParams.get('vehicleId')

  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    if (!vehicleId) {
      setLoading(false)
      return
    }

    const loadVehicle = async () => {

      try {

        const res = await fetch(`/api/vehicles/${vehicleId}`)

        if (!res.ok) {
          setVehicle(null)
        } else {
          const data = await res.json()
          setVehicle(data)
        }

      } catch (error) {
        console.error(error)
        setVehicle(null)
      }

      setLoading(false)
    }

    loadVehicle()

  }, [vehicleId])

  const startTrip = async () => {

    await fetch('/api/trips/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId }),
    })

    alert('Trip started')
  }

  const endTrip = async () => {

    await fetch('/api/trips/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId }),
    })

    alert('Trip ended')
  }

  if (loading) return <div>Loading...</div>

  if (!vehicle) return <div>Vehicle not found</div>

  return (
    <div style={{ padding: 20 }}>

      <h1>{vehicle.plateNumber}</h1>

      <h2>{vehicle.carModel}</h2>

      <h3>Driver: {vehicle.driverName}</h3>

      <br />

      <button
        onClick={startTrip}
        style={{ fontSize: 20, marginRight: 10 }}
      >
        Start Trip
      </button>

      <button
        onClick={endTrip}
        style={{ fontSize: 20 }}
      >
        End Trip
      </button>

    </div>
  )
}