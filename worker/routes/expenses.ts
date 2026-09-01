import { Hono } from 'hono'
import { and, desc, eq } from 'drizzle-orm'
import { createDb } from '../db/client'
import { expenses } from '../db/app-schema'
import { requireSession } from '../middleware/require-session'
import type { AuthEnv } from '../auth'

export const expensesRoute = new Hono<{
  Bindings: AuthEnv
  Variables: { userId: string }
}>()

expensesRoute.use('*', requireSession)

expensesRoute.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const rows = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, c.get('userId')))
    .orderBy(desc(expenses.date), desc(expenses.createdAt))
  return c.json({ data: rows })
})

expensesRoute.post('/', async (c) => {
  const db = createDb(c.env.DB)
  const body = await c.req.json()
  const now = new Date().toISOString()
  const row = {
    id: crypto.randomUUID(),
    userId: c.get('userId'),
    title: body.title,
    description: body.description ?? null,
    amount: body.amount,
    category: body.category,
    date: body.date,
    paymentMethod: body.paymentMethod,
    tags: body.tags && body.tags.length > 0 ? body.tags : null,
    receipt: body.receipt ?? null,
    subscriptionId: body.subscriptionId ?? null,
    createdAt: now,
    updatedAt: now,
  }
  await db.insert(expenses).values(row)
  return c.json({ data: row }, 201)
})

expensesRoute.patch('/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const userId = c.get('userId')
  const updates = await c.req.json()

  await db
    .update(expenses)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))

  const [row] = await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
  if (!row) return c.json({ error: '找不到消費紀錄' }, 404)
  return c.json({ data: row })
})

expensesRoute.delete('/:id', async (c) => {
  const db = createDb(c.env.DB)
  await db
    .delete(expenses)
    .where(and(eq(expenses.id, c.req.param('id')), eq(expenses.userId, c.get('userId'))))
  return c.body(null, 204)
})

expensesRoute.delete('/', async (c) => {
  const db = createDb(c.env.DB)
  await db.delete(expenses).where(eq(expenses.userId, c.get('userId')))
  return c.body(null, 204)
})
