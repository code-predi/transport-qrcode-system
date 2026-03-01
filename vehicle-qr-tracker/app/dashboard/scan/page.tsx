'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function ScanPage() {

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [status, setStatus] = useState("Initializing camera...")
  const [cameraReady, setCameraReady] = useState(false)

  useEffect(() => {

    const startScanner = async () => {

      try {

        const scanner = new Html5Qrcode("scanner")
        scannerRef.current = scanner

        // Try rear camera first
        try {

          await scanner.start(
            { facingMode: { exact: "environment" } },
            {
              fps: 10,
              qrbox: { width: 280, height: 280 }
            },
            onScanSuccess,
            onScanError
          )

        } catch {

          // fallback
          await scanner.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 280, height: 280 }
            },
            onScanSuccess,
            onScanError
          )

        }

        setCameraReady(true)
        setStatus("Camera ready — Scan QR Code")

      } catch (error) {

        console.error(error)
        setStatus("Failed to open camera")

      }

    }

    startScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(()=>{})
      }
    }

  }, [])

  const onScanSuccess = (decodedText: string) => {

    setStatus("QR detected. Opening vehicle...")

    window.location.href = decodedText

  }

  const onScanError = () => {}

  return (

    <div style={{
      padding: 30,
      maxWidth: 500,
      margin: "0 auto"
    }}>

      <h1 style={{
        fontSize: 26,
        marginBottom: 10,
        color: "#0B1F3A"
      }}>
        Scan Vehicle QR
      </h1>

      <div style={{
        color: "#666",
        marginBottom: 20
      }}>
        Point camera at vehicle QR code
      </div>

      {/* Scanner box */}
      <div style={{
        background: "white",
        padding: 15,
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>

        <div
          id="scanner"
          style={{
            width: "100%",
            borderRadius: 10,
            overflow: "hidden"
          }}
        />

      </div>

      {/* Status */}
      <div style={{
        marginTop: 20,
        padding: 15,
        background: cameraReady ? "#e8f5e9" : "#fff3e0",
        borderRadius: 8,
        fontWeight: "bold",
        color: cameraReady ? "#2e7d32" : "#ef6c00"
      }}>
        {status}
      </div>

    </div>

  )

}