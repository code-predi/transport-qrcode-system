'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddVehiclePage() {

  const router = useRouter()

  const [plateNumber, setPlateNumber] = useState('')
  const [carModel, setCarModel] = useState('')
  const [driverName, setDriverName] = useState('')
  const [loading, setLoading] = useState(false)

  const createVehicle = async () => {

    if (!plateNumber || !carModel || !driverName) {
      alert("All fields required")
      return
    }

    setLoading(true)

    try {

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plateNumber,
          carModel,
          driverName
        })
      })

      if (!res.ok) {

        const err = await res.json()
        alert(err.error || "Failed to create vehicle")

      } else {

        alert("Vehicle created successfully")

        router.push('/dashboard/vehicles')

      }

    } catch {

      alert("Network error")

    }

    setLoading(false)

  }

  return (

    <div style={{
      padding: 40,
      maxWidth: 600
    }}>

      {/* Page Title */}
      <h1 style={{
        color: "#0B1F3A",
        marginBottom: 30
      }}>
        Create Vehicle
      </h1>


      {/* Form Card */}
      <div style={{
        background: "white",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid #e0e0e0"
      }}>


        {/* Plate Number */}
        <label style={{
          fontWeight: "bold",
          color: "#0B1F3A"
        }}>
          Plate Number
        </label>

        <input
          value={plateNumber}
          onChange={e => setPlateNumber(e.target.value)}
          style={inputStyle}
        />


        {/* Car Model */}
        <label style={labelStyle}>
          Car Model
        </label>

        <input
          value={carModel}
          onChange={e => setCarModel(e.target.value)}
          style={inputStyle}
        />


        {/* Driver Name */}
        <label style={labelStyle}>
          Driver Name
        </label>

        <input
          value={driverName}
          onChange={e => setDriverName(e.target.value)}
          style={inputStyle}
        />


        {/* Button */}
        <button
          onClick={createVehicle}
          disabled={loading}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 14,
            fontSize: 16,
            background: "#C8A951",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {loading ? "Creating..." : "Create Vehicle"}
        </button>


      </div>

    </div>

  )

}


const labelStyle = {
  marginTop: 15,
  display: "block",
  fontWeight: "bold",
  color: "#0B1F3A"
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginTop: 6,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
  color: "#0B1F3A",
  background: "white"
}