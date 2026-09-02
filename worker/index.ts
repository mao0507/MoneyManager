import { Hono } from 'hono'
import { createAuth } from './auth'
import type { AuthEnv } from './auth'
import { requireSession } from './middleware/require-session'
import { subscriptionsRoute } from './routes/subscriptions'
import { expensesRoute } from './routes/expenses'

// wrangler.jsonc 的 assets.run_worker_first 只把 /api/* 導來這個 Worker，
// 其餘路徑（含 SPA 導覽）在平台層就直接交給靜態資源，不會進到這個 fetch handler
const app = new Hono<{ Bindings: AuthEnv; Variables: { userId: string } }>()

app.on(['GET', 'POST'], '/api/auth/*', (c) => createAuth(c.env).handler(c.req.raw))

// 掛在 /api/auth/* 之後：該路徑已被上面的 route 處理掉，不會落到這層，
// 其餘 /api/* 一律預設要登入，之後新增路由忘記加驗證也不會變成公開 API
app.use('/api/*', requireSession)

app.route('/api/subscriptions', subscriptionsRoute)
app.route('/api/expenses', expensesRoute)

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

export default app
