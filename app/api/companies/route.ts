import { getCompanies } from '@/lib/companies'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const data = await getCompanies({
    search: searchParams.get('search') ?? '',
    category: searchParams.get('category') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
    aiNative: searchParams.get('aiNative') ?? undefined,
    profitable: searchParams.get('profitable') ?? undefined,
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 8)
  })
  return Response.json(data)
}
