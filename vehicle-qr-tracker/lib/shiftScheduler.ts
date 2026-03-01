import { prisma } from './prisma'

export async function updateActiveShift() {

  const now = new Date()

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes()

  const shifts = await prisma.shift.findMany({
    orderBy: { startHour: 'asc' }
  })

  // STEP 1: check override
  const overrideShift = shifts.find(
    s =>
      s.overrideActive &&
      s.overrideUntil &&
      new Date(s.overrideUntil) > now
  )

  if (overrideShift) {

    await prisma.shift.updateMany({
      data: { active: false }
    })

    await prisma.shift.update({
      where: { id: overrideShift.id },
      data: { active: true }
    })

    return overrideShift
  }

  // STEP 2: automatic scheduling
  let activeShift = null

  for (const shift of shifts) {

    const start =
      shift.startHour * 60 + shift.startMin

    const end =
      shift.endHour * 60 + shift.endMin

    if (
      currentMinutes >= start &&
      currentMinutes <= end
    ) {

      activeShift = shift
      break
    }
  }

  if (!activeShift) return null

  await prisma.shift.updateMany({
    data: {
      active: false,
      overrideActive: false
    }
  })

  await prisma.shift.update({
    where: { id: activeShift.id },
    data: { active: true }
  })

  return activeShift

}