import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'
import AutoPrint from '@/components/AutoPrint'
import { headers } from 'next/headers'

export default async function PrintPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {

  // ✅ Next.js 16 safe params handling
  const { vehicleId } = await params

  if (!vehicleId) {
    return <div>Invalid vehicle ID</div>
  }

  // ✅ Fetch vehicle
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  })

  if (!vehicle) {
    return <div>Vehicle not found</div>
  }

  /* ============================
     PRODUCTION-SAFE BASE URL
     ============================ */

  const headersList = await headers()
  const host = headersList.get('host')

  const protocol =
    process.env.NODE_ENV === 'production'
      ? 'https'
      : 'http'

  const baseUrl = `${protocol}://${host}`

  const qrUrl =
    `${baseUrl}/scan?vehicleId=${vehicle.id}`

  // ✅ Generate QR image
  const qrCode = await QRCode.toDataURL(qrUrl)

  return (
    <>
      <AutoPrint />

      <div id="print-container">

        <div
          style={{
            width: "420px",
            padding: "25px",
            border: "4px solid black",
            textAlign: "center",
            background: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px"
          }}
        >

          {/* Plate */}
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "bold",
            }}
          >
            {vehicle.plateNumber}
          </h1>

          {/* Model */}
          <h2
            style={{
              fontSize: "28px",
            }}
          >
            {vehicle.carModel}
          </h2>

          {/* Driver */}
          <h3
            style={{
              fontSize: "22px",
            }}
          >
            Driver: {vehicle.driverName}
          </h3>

          {/* QR */}
          <img
            src={qrCode}
            width={260}
            height={260}
            alt="QR Code"
          />

          <p
            style={{
              fontSize: "18px",
              marginTop: "10px"
            }}
          >
            Scan for Trip Tracking
          </p>

        </div>

      </div>
    </>
  )
}