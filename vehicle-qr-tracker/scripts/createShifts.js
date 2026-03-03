const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {

  const shifts = [
    {
      name: "Fajr Namaz",
      startHour: 5,
      startMin: 0,
      endHour: 7,
      endMin: 0,
    },
    {
      name: "Zohr Namaz",
      startHour: 13,
      startMin: 0,
      endHour: 16,
      endMin: 0,
    },
    {
      name: "Maghrib Namaz",
      startHour: 18,
      startMin: 0,
      endHour: 21,
      endMin: 0,
    }
  ]

  for (const shift of shifts) {

    await prisma.shift.upsert({
      where: { name: shift.name },
      update: {},
      create: shift,
    })

  }

  console.log("Shifts created successfully")

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())