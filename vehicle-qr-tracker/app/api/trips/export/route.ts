import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {

  try {

    const trips = await prisma.trip.findMany({

      include: {
        vehicle: true,
        operator: true,
        shift: true
      },

      orderBy: {
        startTime: 'desc'
      }

    })

    const data = trips.map(trip => {

      const durationMinutes = trip.endTime
        ? Math.floor(
            (new Date(trip.endTime).getTime() -
             new Date(trip.startTime).getTime()) / 60000
          )
        : null

      return {

        "Vehicle Plate": trip.vehicle.plateNumber,

        "Vehicle Model": trip.vehicle.carModel,

        "Driver": trip.vehicle.driverName,

        "Operator": trip.operator?.username || "Unknown",

        "Shift": trip.shift?.name || "No shift",

        "Start Time": new Date(trip.startTime).toLocaleString(),

        "End Time": trip.endTime
          ? new Date(trip.endTime).toLocaleString()
          : "Active",

        "Duration (min)": durationMinutes ?? "Active",

        "Status": trip.status

      }

    })

    const worksheet = XLSX.utils.json_to_sheet(data)

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Trip History"
    )

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    })

    return new NextResponse(buffer, {

      headers: {

        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          "attachment; filename=trip-history.xlsx"

      }

    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    )

  }

}