import { describe, expect, it, vi } from 'vitest'

const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
}

vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }))

describe('useAuth', () => {
  it('resolves isReady even when getSession rejects', async () => {
    mockSupabase.auth.getSession.mockRejectedValue(new Error('network down'))
    vi.resetModules()

    const { useAuth } = await import('./useAuth')
    const { isReady } = useAuth()

    await vi.waitFor(() => {
      expect(isReady.value).toBe(true)
    })
  })
})
