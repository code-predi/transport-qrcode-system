import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {

  const username = "admin"
  const password = "admin123"

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.upsert({

    where: { username },

    update: {},

    create: {
      username,
      password: hashed,
      role: "ADMIN"
    }

  })

  console.log("Admin user created:")
  console.log("username:", username)
  console.log("password:", password)

}

main()