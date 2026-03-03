'use client'

import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function ScanPage() {

  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {

    const startScanner = async () => {

      const scanner = new Html5Qrcode("scanner")
      scannerRef.current = scanner

      try {

        // FORCE back camera only
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 280,
            aspectRatio: 1
          },
          (decodedText) => {

            window.location.href = decodedText

          },
          () => {}
        )

      } catch (err) {

        console.error("Camera failed", err)

      }

    }

    startScanner()

    return () => {
      scannerRef.current?.stop().catch(()=>{})
    }

  }, [])

  return (

    <div style={{
      padding: 20,
      maxWidth: 400,
      margin: "auto"
    }}>

      <h2>Scan Vehicle QR</h2>

      <div
        id="scanner"
        style={{
          width: "100%",
          borderRadius: 10
        }}
      />

    </div>

  )

}