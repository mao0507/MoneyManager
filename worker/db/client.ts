import { drizzle } from 'drizzle-orm/d1'
import * as appSchema from './app-schema'
import * as authSchema from './auth-schema'

const schema = { ...appSchema, ...authSchema }

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

export type Db = ReturnType<typeof createDb>
