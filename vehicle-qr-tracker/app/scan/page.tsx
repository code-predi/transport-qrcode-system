'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useRouter } from 'next/navigation'

export default function ScanPage() {

  const router = useRouter()

  // ✅ FIX: explicitly typed ref
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [started, setStarted] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {

    startScanner()

    return () => {
      stopScanner()
    }

  }, [])


  const startScanner = async (): Promise<void> => {

    try {

      setError("")
      setLoading(true)

      // ✅ FIX: explicitly typed scanner
      const scanner: Html5Qrcode = new Html5Qrcode("reader")

      scannerRef.current = scanner

      await scanner.start(

        // safer camera selection
        { facingMode: "environment" },

        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1
        },

        // success callback
        (decodedText: string) => {

          stopScanner()

          try {

            const url = new URL(decodedText)
            const vehicleId = url.searchParams.get("vehicleId")

            if (vehicleId) {

              router.push(`/scan?vehicleId=${vehicleId}`)

            } else {

              alert("Invalid QR code")

            }

          } catch {

            alert("Invalid QR format")

          }

        },

        // required error callback
        (_errorMessage: string) => {
          // ignore scan frame errors
        }

      )

      setStarted(true)
      setLoading(false)

    }
    catch (err) {

      console.error(err)

      setError("Unable to access camera. Please allow permission.")

      setLoading(false)

    }

  }


  const stopScanner = async (): Promise<void> => {

    const scanner = scannerRef.current

    if (!scanner) return

    try {

      await scanner.stop()
      await scanner.clear()

    }
    catch {}

    scannerRef.current = null

    setStarted(false)

  }


  return (

    <div style={{
      padding: 24,
      maxWidth: 500,
      margin: "0 auto",
      color: "#0B1F3A"
    }}>

      <h1 style={{
        fontSize: 26,
        fontWeight: 700,
        marginBottom: 20
      }}>
        Scan Vehicle QR
      </h1>


      <div
        id="reader"
        style={{
          width: "100%",
          height: 320,
          borderRadius: 12,
          border: "2px solid #C6A85A",
          background: "#000",
          overflow: "hidden"
        }}
      />


      {loading && (
        <div style={{ marginTop: 15 }}>
          Opening camera...
        </div>
      )}


      {error && (
        <div style={{
          marginTop: 15,
          padding: 12,
          background: "#FFECEC",
          color: "#9B1C1C",
          borderRadius: 8
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
            padding: 14,
            fontSize: 16,
            background: "#C6A85A",
            color: "#0B1F3A",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Start Camera
        </button>
      )}

    </div>

  )

}