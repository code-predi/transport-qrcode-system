import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'
import AutoPrint from '@/components/AutoPrint'

export default async function PrintPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {

  // Get vehicleId safely (Next.js 16 requirement)
  const { vehicleId } = await params

  if (!vehicleId) {
    return <div>Invalid vehicle ID</div>
  }

  // Fetch vehicle from database
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  })

  if (!vehicle) {
    return <div>Vehicle not found</div>
  }

  // Base URL (use env or fallback)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  // Generate QR URL
  const qrUrl = `${baseUrl}/scan?vehicleId=${vehicle.id}`

  // Generate QR image
  const qrCode = await QRCode.toDataURL(qrUrl)

  return (
    <>
      {/* Auto open print dialog */}
      <AutoPrint />

      {/* Print container */}
      <div id="print-container">

        {/* Label box */}
        <div
          style={{
            width: "400px",
            padding: "20px",
            border: "4px solid black",
            textAlign: "center",
            background: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >

          {/* Plate Number */}
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            {vehicle.plateNumber}
          </h1>

          {/* Car Model */}
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            {vehicle.carModel}
          </h2>

          {/* Driver Name */}
          <h2
            style={{
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            Driver: {vehicle.driverName}
          </h2>

          {/* Centered QR code */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <img
              src={qrCode}
              width={250}
              height={250}
              alt="QR Code"
            />
          </div>

          {/* Footer text */}
          <p
            style={{
              fontSize: "18px",
            }}
          >
            Scan for Trip Tracking
          </p>

        </div>

      </div>
    </>
  )
}