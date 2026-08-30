import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { companyBookmarks } from '@/lib/db/schema'
import { getCompany } from '@/lib/companies'

const COOKIE_NAME = 'aiorbit-visitor'

export const dynamic = 'force-dynamic'

async function getVisitorId() {
  const store = await cookies()
  const existing = store.get(COOKIE_NAME)?.value
  if (existing) return { id: existing, isNew: false }
  return { id: randomUUID(), isNew: true }
}

function setVisitorCookie(response: Response, visitorId: string) {
  response.headers.append('Set-Cookie', `${COOKIE_NAME}=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly`)
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const visitor = await getVisitorId()
  const [bookmark] = await db.select({ id: companyBookmarks.id }).from(companyBookmarks).where(and(eq(companyBookmarks.visitorId, visitor.id), eq(companyBookmarks.companySlug, slug))).limit(1)
  const response = Response.json({ saved: Boolean(bookmark) }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  if (visitor.isNew) setVisitorCookie(response, visitor.id)
  return response
}

export async function POST(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!(await getCompany(slug))) return Response.json({ error: 'Company not found' }, { status: 404 })
  const visitor = await getVisitorId()
  try {
    await db.insert(companyBookmarks).values({ visitorId: visitor.id, companySlug: slug, createdAt: new Date() }).onConflictDoNothing()
  } catch {}
  const response = Response.json({ saved: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  if (visitor.isNew) setVisitorCookie(response, visitor.id)
  return response
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const visitor = await getVisitorId()
  await db.delete(companyBookmarks).where(and(eq(companyBookmarks.visitorId, visitor.id), eq(companyBookmarks.companySlug, slug)))
  const response = Response.json({ saved: false }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  if (visitor.isNew) setVisitorCookie(response, visitor.id)
  return response
}
