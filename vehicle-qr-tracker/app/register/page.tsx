'use client'

import { useState } from 'react'
import QRCode from 'qrcode'

export default function RegisterPage() {
  const [plateNumber, setPlateNumber] = useState('')
  const [carModel, setCarModel] = useState('')
  const [driverName, setDriverName] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [vehicleId, setVehicleId] = useState('')

  const registerVehicle = async () => {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plateNumber, carModel, driverName }),
    })

    const vehicle = await res.json()

    const qrUrl = `${window.location.origin}/scan?vehicleId=${vehicle.id}`

    const qrImage = await QRCode.toDataURL(qrUrl)

    setQrCode(qrImage)
    setVehicleId(vehicle.id)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Register Vehicle</h1>

      <input
        placeholder="Plate Number"
        value={plateNumber}
        onChange={(e) => setPlateNumber(e.target.value)}
      /><br /><br />

      <input
        placeholder="Car Model"
        value={carModel}
        onChange={(e) => setCarModel(e.target.value)}
      /><br /><br />

      <input
        placeholder="Driver Name"
        value={driverName}
        onChange={(e) => setDriverName(e.target.value)}
      /><br /><br />

      <button onClick={registerVehicle}>
        Register Vehicle
      </button>

      {qrCode && (
        <div>
          <h2>QR Code:</h2>

          <img src={qrCode} width={200} />

          <br /><br />

<button
  onClick={() => window.open(`/print/${vehicleId}`, '_blank')}
>
  Open Print Label
</button>
        </div>
      )}
    </div>
  )
}