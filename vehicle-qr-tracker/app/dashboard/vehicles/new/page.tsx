'use client'

import { useState } from 'react'

export default function CreateVehiclePage() {

  const [plateNumber, setPlateNumber] = useState("")
  const [carModel, setCarModel] = useState("")
  const [driverName, setDriverName] = useState("")
  const [loading, setLoading] = useState(false)

  const createVehicle = async () => {

    if (!plateNumber || !carModel || !driverName) {

      alert("Fill all fields")
      return

    }

    setLoading(true)

    const res = await fetch('/api/vehicles', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        plateNumber,
        carModel,
        driverName,
      })

    })

    if (res.ok) {

      const vehicle = await res.json()

      alert("Vehicle created successfully")

      window.open(`/print/${vehicle.id}`, '_blank')

      setPlateNumber("")
      setCarModel("")
      setDriverName("")

    } else {

      const err = await res.json()

      alert(err.error || "Failed")

    }

    setLoading(false)

  }

  return (

    <div style={{ padding: 30 }}>

      <h1>Create Vehicle</h1>

      <div style={{ marginTop: 20 }}>

        <input
          placeholder="Plate Number"
          value={plateNumber}
          onChange={e => setPlateNumber(e.target.value)}
        />

      </div>

      <div style={{ marginTop: 10 }}>

        <input
          placeholder="Car Model"
          value={carModel}
          onChange={e => setCarModel(e.target.value)}
        />

      </div>

      <div style={{ marginTop: 10 }}>

        <input
          placeholder="Driver Name"
          value={driverName}
          onChange={e => setDriverName(e.target.value)}
        />

      </div>

      <button
        onClick={createVehicle}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: 10
        }}
      >

        {loading ? "Creating..." : "Create Vehicle"}

      </button>

    </div>

  )

}