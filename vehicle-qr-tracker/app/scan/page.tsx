'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useRouter } from 'next/navigation'

export default function ScanPage() {

  const router = useRouter()
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    startScanner()

    return () => {
      stopScanner()
    }

  }, [])


  const startScanner = async () => {

    try {

      setError('')
      setLoading(true)

      const scanner = new Html5Qrcode("reader")
      scannerRef.current = scanner

      // Get cameras first
      const cameras = await Html5Qrcode.getCameras()

      if (!cameras || cameras.length === 0) {
        throw new Error("No camera found")
      }

      // Prefer back camera
      const backCamera =
        cameras.find(cam =>
          cam.label.toLowerCase().includes("back") ||
          cam.label.toLowerCase().includes("rear")
        ) || cameras[cameras.length - 1]

      await scanner.start(

        backCamera.id,

        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250
          },
          aspectRatio: 1
        },

        // SUCCESS CALLBACK
        (decodedText) => {

          stopScanner()

          try {

            const url = new URL(decodedText)
            const vehicleId = url.searchParams.get("vehicleId")

            if (vehicleId) {
              router.push(`/scan?vehicleId=${vehicleId}`)
            }
            else {
              alert("Invalid QR format")
            }

          }
          catch {
            alert("Invalid QR code")
          }

        },

        // ERROR CALLBACK (required)
        (scanError) => {
          // ignore scan frame errors
        }

      )

      setStarted(true)
      setLoading(false)

    }
    catch (err) {

      console.error(err)

      setError(
        "Camera failed to start. Please allow camera permission and refresh."
      )

      setLoading(false)

    }

  }


  const stopScanner = async () => {

    try {

      if (scannerRef.current) {

        await scannerRef.current.stop()
        await scannerRef.current.clear()

        scannerRef.current = null

      }

    }
    catch {}

  }


  return (

    <div style={{
      padding: 20,
      maxWidth: 500,
      margin: 'auto'
    }}>

      <h1 style={{
        fontSize: 26,
        fontWeight: 700,
        marginBottom: 20,
        color: "#0B1F3A"
      }}>
        Scan Vehicle QR
      </h1>


      <div
        id="reader"
        style={{
          width: '100%',
          minHeight: 300,
          borderRadius: 12,
          overflow: 'hidden',
          border: '2px solid #0B1F3A',
          background: "#ffffff"
        }}
      />


      {loading && (

        <div style={{
          marginTop: 15,
          color: "#0B1F3A",
          fontSize: 16,
          fontWeight: 600
        }}>
          Opening camera...
        </div>

      )}


      {error && (

        <div style={{
          marginTop: 15,
          padding: 15,
          background: "#ffe5e5",
          color: "#cc0000",
          borderRadius: 8,
          fontWeight: 600
        }}>
          {error}
        </div>

      )}


      {!started && !loading && (

        <button
          onClick={startScanner}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 15,
            fontSize: 18,
            background: "#0B1F3A",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Start Camera
        </button>

      )}

    </div>

  )

}