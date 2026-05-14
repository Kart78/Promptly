export const XP_REWARDS = {
  POST: 10,
  COMMENT: 5,
  LIKE_RECEIVED: 2,
  FOLLOW_RECEIVED: 3,
}

export function getLevelFromXP(xp: number): number {
  // Every 100 XP = 1 level, minimum level 1
  return Math.max(1, Math.floor(xp / 100) + 1)
}

export function getLevelTitle(level: number): string {
  if (level < 2) return 'Newcomer'
  if (level < 5) return 'Builder'
  if (level < 10) return 'Maker'
  if (level < 20) return 'Pioneer'
  return 'Legend'
}

export function xpToNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const level = getLevelFromXP(xp)
  const levelStart = (level - 1) * 100
  const levelEnd = level * 100
  const current = xp - levelStart
  const needed = levelEnd - levelStart
  return { current, needed, progress: Math.round((current / needed) * 100) }
}

export async function awardXP(userId: string, amount: number) {
  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: { increment: amount },
    },
  })
  const newLevel = getLevelFromXP(user.xp)
  if (newLevel !== user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
    })
  }
  return user
}
