import { Hono } from 'hono'
import { createAuth } from './auth'
import type { AuthEnv } from './auth'
import { subscriptionsRoute } from './routes/subscriptions'
import { expensesRoute } from './routes/expenses'

// wrangler.jsonc 的 assets.run_worker_first 只把 /api/* 導來這個 Worker，
// 其餘路徑（含 SPA 導覽）在平台層就直接交給靜態資源，不會進到這個 fetch handler
const app = new Hono<{ Bindings: AuthEnv }>()

app.on(['GET', 'POST'], '/api/auth/*', (c) => createAuth(c.env).handler(c.req.raw))
app.route('/api/subscriptions', subscriptionsRoute)
app.route('/api/expenses', expensesRoute)

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

export default app
