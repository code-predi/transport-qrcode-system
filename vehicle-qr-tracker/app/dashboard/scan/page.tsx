'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function DashboardScannerPage() {

  const router = useRouter()

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "scanner",
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1.0,
      },
      false
    )

    scanner.render(

      (decodedText) => {

        try {

          const url = new URL(decodedText)
          const vehicleId = url.searchParams.get("vehicleId")

          if (vehicleId) {

            // Stop scanner safely
            scanner.clear().then(() => {

              router.push(`/scan?vehicleId=${vehicleId}`)

            })

          } else {

            alert("Invalid QR Code")

          }

        } catch {

          alert("Invalid QR Code")

        }

      },

      () => {}

    )

    // FIX: cleanup must not return Promise
    return () => {

      try {
        scanner.clear()
      } catch {}

    }

  }, [router])

  return (

    <div style={{
      padding: 30,
      maxWidth: 500
    }}>

      <h1>Scan Vehicle QR</h1>

      <div
        id="scanner"
        style={{
          marginTop: 20
        }}
      />

    </div>

  )

}