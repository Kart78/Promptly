import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'karthi@promptly.dev' },
    update: {},
    create: {
      name: 'Karthi',
      email: 'karthi@promptly.dev',
      password,
      role: 'ADMIN',
      xp: 10,
      level: 1,
    },
  })

  await prisma.post.upsert({
    where: { id: 'seed-post-1' },
    update: {},
    create: {
      id: 'seed-post-1',
      title: 'Promptly AI',
      content: '<p>A community for builders, indie developers, and creators. Share wins, discover tools, and grow together.</p>',
      category: 'general',
      authorId: admin.id,
    },
  })

  await prisma.event.upsert({
    where: { id: 'seed-event-1' },
    update: {},
    create: {
      id: 'seed-event-1',
      title: 'Office Hours w/ Karthi',
      description: 'Live Q&A — bring your questions about building in public, side projects, and indie hacking.',
      startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    },
  })

  console.log('✅ Seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
