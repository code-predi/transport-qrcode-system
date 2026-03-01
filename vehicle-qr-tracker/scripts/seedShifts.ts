import { prisma } from '../lib/prisma'

async function main() {

  await prisma.shift.deleteMany()

  await prisma.shift.createMany({

    data: [

      {
        name: "Fajr Namaz",
        startHour: 4,
        startMin: 30,
        endHour: 10,
        endMin: 0,
      },

      {
        name: "Zohr Namaz",
        startHour: 12,
        startMin: 0,
        endHour: 16,
        endMin: 30,
      },

      {
        name: "Maghrib Namaz",
        startHour: 18,
        startMin: 0,
        endHour: 23,
        endMin: 59,
      },

    ],

  })

  console.log("Shifts seeded successfully")
}

main()