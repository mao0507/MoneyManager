import { Hono } from 'hono'
import { and, desc, eq } from 'drizzle-orm'
import { createDb } from '../db/client'
import { subscriptions } from '../db/app-schema'
import { ValidationError, sanitizeSubscriptionUpdate, validateNewSubscription } from '../lib/validation'
import type { AuthEnv } from '../auth'

export const subscriptionsRoute = new Hono<{
  Bindings: AuthEnv
  Variables: { userId: string }
}>()

subscriptionsRoute.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, c.get('userId')))
    .orderBy(desc(subscriptions.createdAt))
  return c.json({ data: rows })
})

subscriptionsRoute.get('/:id', async (c) => {
  const db = createDb(c.env.DB)
  const [row] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.id, c.req.param('id')), eq(subscriptions.userId, c.get('userId'))))
  if (!row) return c.json({ error: '找不到訂閱' }, 404)
  return c.json({ data: row })
})

subscriptionsRoute.post('/', async (c) => {
  const body = await c.req.json()
  try {
    validateNewSubscription(body)
  } catch (error) {
    if (error instanceof ValidationError) return c.json({ error: error.message }, 400)
    throw error
  }

  const db = createDb(c.env.DB)
  const now = new Date().toISOString()
  const row = {
    id: crypto.randomUUID(),
    userId: c.get('userId'),
    name: body.name,
    plan: body.plan,
    amount: body.amount,
    currency: body.currency,
    cycle: body.cycle,
    category: body.category ?? null,
    paymentMethod: body.paymentMethod,
    renewal: body.renewal,
    startDate: body.startDate,
    nextPayment: body.nextPayment,
    active: body.active ?? true,
    createdAt: now,
    updatedAt: now,
  }
  await db.insert(subscriptions).values(row)
  return c.json({ data: row }, 201)
})

subscriptionsRoute.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.get('userId')
  const body = await c.req.json()

  let updates: ReturnType<typeof sanitizeSubscriptionUpdate>
  try {
    updates = sanitizeSubscriptionUpdate(body)
  } catch (error) {
    if (error instanceof ValidationError) return c.json({ error: error.message }, 400)
    throw error
  }

  const db = createDb(c.env.DB)
  const [row] = await db
    .update(subscriptions)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning()
  if (!row) return c.json({ error: '找不到訂閱' }, 404)
  return c.json({ data: row })
})

subscriptionsRoute.delete('/:id', async (c) => {
  const db = createDb(c.env.DB)
  await db
    .delete(subscriptions)
    .where(and(eq(subscriptions.id, c.req.param('id')), eq(subscriptions.userId, c.get('userId'))))
  return c.body(null, 204)
})

subscriptionsRoute.delete('/', async (c) => {
  const db = createDb(c.env.DB)
  await db.delete(subscriptions).where(eq(subscriptions.userId, c.get('userId')))
  return c.body(null, 204)
})
