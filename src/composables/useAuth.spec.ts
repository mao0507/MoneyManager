import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

let sessionRef: ReturnType<typeof ref<{ data: unknown; isPending: boolean }>>

vi.mock('@/lib/auth-client', () => {
  sessionRef = ref({ data: null, isPending: true })
  return {
    authClient: {
      useSession: () => sessionRef,
      signIn: { social: vi.fn() },
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
  }
})

describe('useAuth', () => {
  it('reflects isReady once the session finishes loading', async () => {
    vi.resetModules()

    const { useAuth } = await import('./useAuth')
    const { isReady } = useAuth()

    expect(isReady.value).toBe(false)

    sessionRef.value = { data: null, isPending: false }
    await vi.waitFor(() => {
      expect(isReady.value).toBe(true)
    })
  })

  it('isAuthenticated reflects whether a user is present in the session', async () => {
    vi.resetModules()

    const { useAuth } = await import('./useAuth')
    const { isAuthenticated } = useAuth()

    expect(isAuthenticated.value).toBe(false)

    sessionRef.value = { data: { user: { id: 'user-1' } }, isPending: false }
    await vi.waitFor(() => {
      expect(isAuthenticated.value).toBe(true)
    })
  })
})
