'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { useRouter } from 'next/navigation'

export default function ScanPage() {

  const router = useRouter()

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const mountedRef = useRef(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    mountedRef.current = true

    const startScanner = async () => {

      try {

        const scanner = new Html5Qrcode("reader")
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 280 },

          (decodedText) => {

            if (!mountedRef.current) return

            handleScan(decodedText)

          },

          () => {}
        )

        if (!mountedRef.current) return

        setLoading(false)

      } catch (err) {

        if (!mountedRef.current) return

        console.error(err)
        setError("Camera permission required.")
        setLoading(false)

      }

    }

    startScanner()

    return () => {

      mountedRef.current = false

      safeStopScanner()

    }

  }, [])


  const handleScan = async (decodedText: string) => {

    await safeStopScanner()

    try {

      const url = new URL(decodedText)
      const vehicleId = url.searchParams.get("vehicleId")

      if (vehicleId) {
        router.push(`/trip?vehicleId=${vehicleId}`)
      }

    } catch {}

  }


  const safeStopScanner = async () => {

    const scanner = scannerRef.current

    if (!scanner) return

    try {

      const state = scanner.getState()

      if (
        state === Html5QrcodeScannerState.SCANNING ||
        state === Html5QrcodeScannerState.PAUSED
      ) {
        await scanner.stop()
      }

      await scanner.clear()

    } catch {
      // completely swallow stop errors
    }

    scannerRef.current = null

  }


  return (

    <div style={{
      padding: 24,
      maxWidth: 500,
      margin: "0 auto"
    }}>

      <h1>Scan Vehicle QR</h1>

      <div
        id="reader"
        style={{
          width: "100%",
          height: 320,
          borderRadius: 14,
          border: "3px solid var(--gold)",
          background: "#000"
        }}
      />

      {loading && <p>Opening camera...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

    </div>

  )

}