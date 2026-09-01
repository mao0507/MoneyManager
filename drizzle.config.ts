import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: ['./worker/db/app-schema.ts', './worker/db/auth-schema.ts'],
  out: './drizzle',
  dialect: 'sqlite',
})
