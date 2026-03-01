'use client'

import { useEffect, useState } from 'react'

export default function ShiftDashboard() {

  const [shifts, setShifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState(false)

  const loadShifts = async () => {

    const res = await fetch('/api/shifts')

    if (res.ok) {

      const data = await res.json()
      setShifts(data)

    }

    setLoading(false)

  }

  useEffect(() => {
    loadShifts()
  }, [])


  const activateShift = async (shiftId: string) => {

    if (changing) return

    setChanging(true)

    const res = await fetch('/api/shifts/set-active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shiftId })
    })
    await fetch('/api/shifts/set-active', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ shiftId })
})

await loadShifts()
    if (res.ok) {

      await loadShifts()
      alert("Shift activated successfully")

    } else {

      alert("Failed to activate shift")

    }

    setChanging(false)

  }


  if (loading)
    return <div style={{ padding: 20 }}>Loading shifts...</div>


return (

  <div style={{
    padding: 30,
    color: "#0B1F3A"
  }}>

    <div style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 30
    }}>

      <h1 style={{
        margin: 0,
        color: "#0B1F3A"
      }}>
        Shift Control Panel
      </h1>

    </div>


    {shifts.map((shift) => {

      const isActive = shift.active

      return (

        <div
          key={shift.id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginBottom: 15,
            borderRadius: 10,
            background: isActive ? "#e8f5e9" : "white",
            color: "#0B1F3A"
          }}
        >

          <div style={{
            fontSize: 20,
            fontWeight: "bold"
          }}>
            {shift.name}
          </div>

          <div style={{
            marginTop: 8
          }}>
            Status:
            <strong style={{
              marginLeft: 6,
              color: isActive ? "#00c853" : "#666"
            }}>
              {isActive ? "ACTIVE" : "INACTIVE"}
            </strong>
          </div>


          {!isActive && (

            <button
              onClick={() => activateShift(shift.id)}
              style={{
                marginTop: 15,
                padding: "8px 18px",
                background: "#0B1F3A",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              Activate Shift
            </button>

          )}

        </div>

      )

    })}

  </div>

)
}