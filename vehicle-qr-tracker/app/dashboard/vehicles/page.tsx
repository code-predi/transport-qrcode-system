'use client'

import { useEffect, useState } from 'react'

export default function VehiclesPage() {

  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  const loadVehicles = async () => {

    try {

      const res = await fetch('/api/vehicles/list')

      if (res.ok) {

        const data = await res.json()
        setVehicles(data)

      }

    } catch (err) {

      console.error(err)

    }

    setLoading(false)

  }


  const toggleVehicle = async (vehicleId: string) => {

    await fetch('/api/vehicles/toggle', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ vehicleId })

    })

    loadVehicles()

  }


  useEffect(() => {

    loadVehicles()

  }, [])



  if (loading)
    return (
      <div style={{
        padding: 30,
        color: "#0B1F3A"
      }}>
        Loading vehicles...
      </div>
    )



  return (

    <div style={{
      padding: 30,
      color: "#0B1F3A"
    }}>


      <h1 style={{
        marginBottom: 20,
        color: "#0B1F3A"
      }}>
        Vehicle Management
      </h1>



      {vehicles.map(vehicle => {

        const isActive = vehicle.active

        return (

          <div
            key={vehicle.id}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
              marginBottom: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderLeft: `6px solid ${
                isActive ? "#00c853" : "#ff3d00"
              }`
            }}
          >


            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>


              {/* Left Info */}
              <div>

                <div style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#0B1F3A"
                }}>
                  {vehicle.plateNumber}
                </div>


                <div style={{
                  marginTop: 4,
                  color: "#444"
                }}>
                  Model: {vehicle.carModel}
                </div>


                <div style={{
                  color: "#444"
                }}>
                  Driver: {vehicle.driverName}
                </div>


                <div style={{
                  color: "#666",
                  marginTop: 4
                }}>
                  Total Trips: {vehicle.tripCount}
                </div>

              </div>



              {/* Right Controls */}
              <div style={{
                textAlign: "right"
              }}>


                <div style={{
                  fontWeight: "bold",
                  color: isActive
                    ? "#00c853"
                    : "#ff3d00"
                }}>
                  {isActive
                    ? "ACTIVE"
                    : "INACTIVE"}
                </div>



                <button
                  onClick={() =>
                    toggleVehicle(vehicle.id)
                  }
                  style={{
                    marginTop: 10,
                    padding: "6px 14px",
                    background: isActive
                      ? "#ff3d00"
                      : "#00c853",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >

                  {isActive
                    ? "Disable"
                    : "Enable"}

                </button>



                <button
                  onClick={() =>
                    window.open(
                      `/print/${vehicle.id}`,
                      '_blank'
                    )
                  }
                  style={{
                    marginTop: 10,
                    marginLeft: 10,
                    padding: "6px 14px",
                    background: "#C6A75E",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >

                  Print QR

                </button>


              </div>


            </div>


          </div>

        )

      })}


    </div>

  )

}