import { createMiddleware } from 'hono/factory'
import type { Context } from 'hono'
import { createAuth } from '../auth'
import type { AuthEnv } from '../auth'

type SessionUser = { id: string }

export const requireSession = createMiddleware<{
  Bindings: AuthEnv
  Variables: { userId: string }
}>(async (c: Context, next) => {
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    return c.json({ error: '未登入' }, 401)
  }

  c.set('userId', (session.user as SessionUser).id)
  await next()
})
