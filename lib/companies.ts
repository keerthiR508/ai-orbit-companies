import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { companiesTable, type CompanyRow } from '@/lib/db/schema'
import { mockCompanies } from './mock-data'
import { formatNumber, formatValuation, type Company } from './company-format'

export type { Company }
export { formatNumber, formatValuation }

function toCompany(row: CompanyRow): Company {
  return {
    slug: row.slug,
    name: row.name,
    initials: row.logo,
    logoTone: 'violet',
    tagline: row.tagline,
    description: row.description,
    country: row.country,
    founded: row.foundedYear,
    sector: row.sector,
    type: 'Private',
    categories: [row.category, row.sector, ...(row.aiNative ? ['AI Native'] : [])],
    valuation: row.valuation,
    employees: row.employees,
    models: row.modelsCount,
    tools: row.toolsCount,
    aiNative: row.aiNative,
    profitable: row.profitable,
    verified: row.verified,
    website: row.website,
    products: row.products
  }
}

export type CompanyQuery = {
  search?: string
  category?: string
  sector?: string
  country?: string
  aiNative?: boolean | string
  profitable?: boolean | string
  sort?: string
  page?: number
  limit?: number
}

export async function getCompanies(query: CompanyQuery = {}) {
  const search = query.search?.trim().toLowerCase()
  const category = query.category && query.category !== 'All' ? query.category : undefined
  const sort = query.sort ?? 'newest'
  const limit = Math.min(50, Math.max(1, query.limit ?? 8))
  const page = Math.max(1, query.page ?? 1)
  const aiNativeFilter = query.aiNative !== undefined && query.aiNative !== '' ? String(query.aiNative) === 'true' : undefined
  const profitableFilter = query.profitable !== undefined && query.profitable !== '' ? String(query.profitable) === 'true' : undefined

  // Attempt database query if configured
  if (process.env.DATABASE_URL) {
    try {
      const filters = []
      if (search) {
        filters.push(
          or(
            ilike(companiesTable.name, `%${search}%`),
            ilike(companiesTable.description, `%${search}%`),
            ilike(companiesTable.country, `%${search}%`),
            ilike(companiesTable.sector, `%${search}%`)
          )
        )
      }
      if (category) {
        if (category === 'AI Native') {
          filters.push(eq(companiesTable.aiNative, true))
        } else {
          filters.push(eq(companiesTable.category, category))
        }
      }
      if (aiNativeFilter !== undefined) {
        filters.push(eq(companiesTable.aiNative, aiNativeFilter))
      }
      if (profitableFilter !== undefined) {
        filters.push(eq(companiesTable.profitable, profitableFilter))
      }

      const order =
        sort === 'oldest'
          ? asc(companiesTable.foundedYear)
          : sort === 'valuation-high'
          ? desc(companiesTable.valuation)
          : sort === 'valuation-low'
          ? asc(companiesTable.valuation)
          : sort === 'employees'
          ? desc(companiesTable.employees)
          : sort === 'models'
          ? desc(companiesTable.modelsCount)
          : sort === 'tools'
          ? desc(companiesTable.toolsCount)
          : desc(companiesTable.foundedYear)

      const rows = await db
        .select()
        .from(companiesTable)
        .where(filters.length ? sql.join(filters, sql` AND `) : undefined)
        .orderBy(order)
        .limit(limit)
        .offset((page - 1) * limit)

      const count = await db
        .select({ count: sql<number>`count(*)` })
        .from(companiesTable)
        .where(filters.length ? sql.join(filters, sql` AND `) : undefined)

      const total = Number(count[0]?.count ?? 0)
      if (total > 0 || rows.length > 0) {
        return {
          companies: rows.map(toCompany),
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit))
        }
      }
    } catch {
      // Fallback to in-memory dataset
    }
  }

  // In-memory robust fallback filtering & sorting
  let filtered = [...mockCompanies]

  if (search) {
    filtered = filtered.filter((c) =>
      c.name.toLowerCase().includes(search) ||
      c.tagline.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search) ||
      c.sector.toLowerCase().includes(search) ||
      c.country.toLowerCase().includes(search) ||
      c.products.some((p) => p.toLowerCase().includes(search)) ||
      c.categories.some((cat) => cat.toLowerCase().includes(search))
    )
  }

  if (category) {
    if (category === 'AI Native') {
      filtered = filtered.filter((c) => c.aiNative)
    } else if (category === 'Unicorns') {
      filtered = filtered.filter((c) => c.valuation >= 1000)
    } else if (category === 'Model Companies') {
      filtered = filtered.filter((c) => c.models > 0 || c.sector === 'Foundation Models')
    } else {
      filtered = filtered.filter(
        (c) =>
          c.categories.includes(category) ||
          c.sector.toLowerCase() === category.toLowerCase()
      )
    }
  }

  if (aiNativeFilter !== undefined) {
    filtered = filtered.filter((c) => c.aiNative === aiNativeFilter)
  }

  if (profitableFilter !== undefined) {
    filtered = filtered.filter((c) => c.profitable === profitableFilter)
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return a.founded - b.founded
      case 'valuation-high':
        return b.valuation - a.valuation
      case 'valuation-low':
        return a.valuation - b.valuation
      case 'employees':
        return b.employees - a.employees
      case 'models':
        return b.models - a.models
      case 'tools':
        return b.tools - a.tools
      case 'newest':
      default:
        return b.founded - a.founded
    }
  })

  const total = filtered.length
  const offset = (page - 1) * limit
  const paginated = filtered.slice(offset, offset + limit)

  return {
    companies: paginated,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit))
  }
}

export async function getCompany(slug: string): Promise<Company | undefined> {
  if (process.env.DATABASE_URL) {
    try {
      const rows = await db.select().from(companiesTable).where(eq(companiesTable.slug, slug)).limit(1)
      if (rows[0]) return toCompany(rows[0])
    } catch {
      // Fallback
    }
  }
  return mockCompanies.find((c) => c.slug.toLowerCase() === slug.toLowerCase())
}
