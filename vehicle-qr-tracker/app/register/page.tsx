'use client'

import { useState } from 'react'
import QRCode from 'qrcode'
import { APP_URL } from '@/lib/config'

export default function RegisterPage() {

  const [plateNumber, setPlateNumber] = useState('')
  const [carModel, setCarModel] = useState('')
  const [driverName, setDriverName] = useState('')

  const [qrCode, setQrCode] = useState('')
  const [vehicleId, setVehicleId] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const registerVehicle = async () => {

    try {

      setLoading(true)
      setError('')

      if (!plateNumber || !carModel || !driverName) {
        setError("Please fill all fields")
        setLoading(false)
        return
      }

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plateNumber,
          carModel,
          driverName
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to register vehicle")
        setLoading(false)
        return
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        window.location.origin

      const qrUrl =
        `${APP_URL}/scan?vehicleId=${data.id}`

      const qrImage =
        await QRCode.toDataURL(qrUrl)

      setQrCode(qrImage)
      setVehicleId(data.id)

    }
    catch (err) {

      console.error(err)
      setError("Unexpected error occurred")

    }
    finally {

      setLoading(false)

    }

  }


  const openPrint = () => {

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      window.location.origin

    window.open(
      `${baseUrl}/print/${vehicleId}`,
      '_blank'
    )

  }


  return (

    <div style={{
      padding: 30,
      maxWidth: 600
    }}>

      <h1 style={{
        color: "#0B1F3A",
        marginBottom: 20
      }}>
        Register Vehicle
      </h1>


      <div style={{
        background: "white",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>


        <label>Plate Number</label>

        <input
          value={plateNumber}
          onChange={(e) =>
            setPlateNumber(e.target.value)
          }
          style={inputStyle}
        />


        <label>Car Model</label>

        <input
          value={carModel}
          onChange={(e) =>
            setCarModel(e.target.value)
          }
          style={inputStyle}
        />


        <label>Driver Name</label>

        <input
          value={driverName}
          onChange={(e) =>
            setDriverName(e.target.value)
          }
          style={inputStyle}
        />


        {error && (

          <div style={{
            color: "red",
            marginBottom: 10
          }}>
            {error}
          </div>

        )}


        <button
          onClick={registerVehicle}
          disabled={loading}
          style={{
            background: "#C9A227",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%"
          }}
        >

          {loading
            ? "Creating Vehicle..."
            : "Create Vehicle"}

        </button>

      </div>



      {qrCode && (

        <div style={{
          marginTop: 30,
          textAlign: "center",
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>

          <h2 style={{
            color: "#0B1F3A"
          }}>
            QR Code Generated
          </h2>


          <img
            src={qrCode}
            width={220}
          />


          <br /><br />


          <button
            onClick={openPrint}
            style={{
              background: "#0B1F3A",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Print QR Label
          </button>

        </div>

      )}

    </div>

  )

}



const inputStyle = {

  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderRadius: 6,
  border: "1px solid #ccc"

}