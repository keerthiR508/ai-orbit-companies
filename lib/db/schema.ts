import { integer, numeric, pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'

export const companyBookmarks = pgTable('company_bookmarks', {
  id: uuid('id').defaultRandom().primaryKey(),
  visitorId: text('visitor_id').notNull(),
  companySlug: text('company_slug').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export const companiesTable = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), slug: text('slug').notNull().unique(), logo: text('logo').notNull(),
  description: text('description').notNull(), tagline: text('tagline').notNull(), country: text('country').notNull(),
  foundedYear: integer('foundedYear').notNull(), valuation: integer('valuation').notNull(), employees: integer('employees').notNull(),
  valuationPerEmployee: numeric('valuationPerEmployee').notNull(), aiNative: boolean('aiNative').notNull(), profitable: boolean('profitable').notNull(),
  sector: text('sector').notNull(), category: text('category').notNull(), modelsCount: integer('modelsCount').notNull(), toolsCount: integer('toolsCount').notNull(),
  website: text('website').notNull(), products: text('products').array().notNull(), verified: boolean('verified').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(), updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
})

export type CompanyRow = typeof companiesTable.$inferSelect
