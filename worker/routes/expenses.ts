import { Hono } from 'hono'
import { and, desc, eq } from 'drizzle-orm'
import { createDb } from '../db/client'
import { expenses, subscriptions } from '../db/app-schema'
import { ValidationError, sanitizeExpenseUpdate, validateNewExpense } from '../lib/validation'
import type { AuthEnv } from '../auth'

export const expensesRoute = new Hono<{
  Bindings: AuthEnv
  Variables: { userId: string }
}>()

async function assertOwnsSubscription(db: ReturnType<typeof createDb>, userId: string, subscriptionId: string) {
  const [row] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.userId, userId)))
  if (!row) throw new ValidationError('subscriptionId 不存在或不屬於你')
}

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
  const body = await c.req.json()
  const userId = c.get('userId')
  const db = createDb(c.env.DB)

  try {
    validateNewExpense(body)
    if (body.subscriptionId) await assertOwnsSubscription(db, userId, body.subscriptionId)
  } catch (error) {
    if (error instanceof ValidationError) return c.json({ error: error.message }, 400)
    throw error
  }

  const now = new Date().toISOString()
  const row = {
    id: crypto.randomUUID(),
    userId,
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
  const id = c.req.param('id')
  const userId = c.get('userId')
  const body = await c.req.json()
  const db = createDb(c.env.DB)

  let updates: ReturnType<typeof sanitizeExpenseUpdate>
  try {
    updates = sanitizeExpenseUpdate(body)
    if (updates.subscriptionId) await assertOwnsSubscription(db, userId, updates.subscriptionId)
  } catch (error) {
    if (error instanceof ValidationError) return c.json({ error: error.message }, 400)
    throw error
  }

  const [row] = await db
    .update(expenses)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .returning()
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
