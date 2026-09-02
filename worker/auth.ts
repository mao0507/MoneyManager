import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from './db/client'

export interface AuthEnv {
  DB: D1Database
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL?: string
}

// bindings/secrets are stable for the lifetime of a Worker isolate,
// so the betterAuth instance (and its drizzle adapter) is built once and reused
let cachedAuth: ReturnType<typeof betterAuth> | undefined

export function createAuth(env: AuthEnv) {
  if (!cachedAuth) {
    cachedAuth = betterAuth({
      database: drizzleAdapter(createDb(env.DB), { provider: 'sqlite' }),
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      basePath: '/api/auth',
      socialProviders: {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      },
    })
  }
  return cachedAuth
}
