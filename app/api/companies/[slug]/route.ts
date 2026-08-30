import { getCompany } from '@/lib/companies'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const company = await getCompany(slug)
  if (!company) return Response.json({ error: 'Company not found' }, { status: 404 })
  return Response.json(company)
}
