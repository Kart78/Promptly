import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DEFAULTS = {
  id: 'singleton',
  name: 'Promptly',
  url: 'promptly.vercel.app',
  description:
    'A community for builders, indie developers, and creators. Share wins, discover tools, and grow together.',
  logoUrl: null as string | null,
  bannerUrl: null as string | null,
}

export async function GET() {
  const settings = await prisma.communitySettings
    .findUnique({ where: { id: 'singleton' } })
    .catch(() => null)
  return NextResponse.json(settings || DEFAULTS)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name, url, description, logoUrl, bannerUrl } = await req.json()

  const settings = await prisma.communitySettings.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      name: name || DEFAULTS.name,
      url: url || DEFAULTS.url,
      description: description || DEFAULTS.description,
      logoUrl: logoUrl || null,
      bannerUrl: bannerUrl || null,
    },
    update: {
      ...(name !== undefined && { name: name || DEFAULTS.name }),
      ...(url !== undefined && { url: url || DEFAULTS.url }),
      ...(description !== undefined && { description: description || DEFAULTS.description }),
      ...(logoUrl !== undefined && { logoUrl: logoUrl || null }),
      ...(bannerUrl !== undefined && { bannerUrl: bannerUrl || null }),
    },
  })

  return NextResponse.json(settings)
}
