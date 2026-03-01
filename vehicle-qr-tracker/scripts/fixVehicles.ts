import { prisma } from '../lib/prisma'

async function fix() {

  await prisma.vehicle.updateMany({
    data: { active: true }
  })

  console.log("All vehicles activated")

}

fix()