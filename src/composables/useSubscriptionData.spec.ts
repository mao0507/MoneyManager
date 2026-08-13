import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

type AuthChangeCallback = (event: string, session: { user: { id: string } } | null) => void

let authChangeCallback: AuthChangeCallback | null = null

function createQueryBuilder(result: { data?: unknown; error?: unknown }) {
  const builder: Record<string, unknown> = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(result)),
    then: (resolve: (value: typeof result) => void) => resolve(result),
  }
  return builder
}

const mockSupabase = {
  from: vi.fn(),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    onAuthStateChange: vi.fn((cb: AuthChangeCallback) => {
      authChangeCallback = cb
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    }),
  },
}

vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }))

async function loadComposable() {
  vi.resetModules()
  authChangeCallback = null
  mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } })
  mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
  const { useSubscriptionData } = await import('./useSubscriptionData')
  return useSubscriptionData()
}

async function signIn(userId = 'user-1') {
  mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } } })
  authChangeCallback?.('SIGNED_IN', { user: { id: userId } })
  await nextTick()
  await nextTick()
}

const sampleRow = {
  id: 'sub-1',
  name: 'Netflix',
  plan: 'Standard',
  amount: 390,
  currency: 'TWD',
  cycle: 'Monthly',
  category: '影片串流',
  payment_method: 'Credit Card',
  renewal: 'Automatic',
  start_date: '2026-01-15',
  next_payment: '2026-02-15',
  active: true,
}

describe('useSubscriptionData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches subscriptions for the signed-in user', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [sampleRow], error: null }))

    const { originalItems } = await loadComposable()
    await signIn()

    expect(originalItems.value).toEqual([
      {
        id: 'sub-1',
        name: 'Netflix',
        plan: 'Standard',
        amount: 390,
        currency: 'TWD',
        cycle: 'Monthly',
        active: true,
        startDate: '2026-01-15',
        nextPayment: '2026-02-15',
        paymentMethod: 'Credit Card',
        renewal: 'Automatic',
        category: '影片串流',
      },
    ])
  })

  it('clears items when the user signs out', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [sampleRow], error: null }))
    const { originalItems } = await loadComposable()
    await signIn()
    expect(originalItems.value).toHaveLength(1)

    authChangeCallback?.('SIGNED_OUT', null)
    await nextTick()

    expect(originalItems.value).toHaveLength(0)
  })

  it('addSubscription computes next_payment and inserts with the current user id', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [], error: null }))
    const { addSubscription, originalItems } = await loadComposable()
    await signIn('user-42')

    const builder = createQueryBuilder({ data: { ...sampleRow, id: 'sub-new' }, error: null })
    mockSupabase.from.mockReturnValue(builder)

    await addSubscription({
      name: 'Netflix',
      plan: 'Standard',
      amount: 390,
      currency: 'TWD',
      cycle: 'Monthly',
      category: '影片串流',
      paymentMethod: 'Credit Card',
      renewal: 'Automatic',
      startDate: '2026-01-15',
    })

    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-42',
        name: 'Netflix',
        amount: 390,
        currency: 'TWD',
        start_date: '2026-01-15',
        next_payment: '2026-02-15',
      }),
    )
    expect(originalItems.value[0].id).toBe('sub-new')
  })

  it('addSubscription throws when nobody is signed in', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [], error: null }))
    const { addSubscription } = await loadComposable()

    await expect(
      addSubscription({
        name: 'Netflix',
        plan: 'Standard',
        amount: 390,
        currency: 'TWD',
        cycle: 'Monthly',
        paymentMethod: 'Credit Card',
        renewal: 'Automatic',
        startDate: '2026-01-15',
      }),
    ).rejects.toThrow()
  })

  it('updateSubscription recalculates next_payment when startDate changes', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [sampleRow], error: null }))
    const { updateSubscription, originalItems } = await loadComposable()
    await signIn()

    const updatedRow = { ...sampleRow, start_date: '2026-03-01', next_payment: '2026-04-01' }
    const builder = createQueryBuilder({ data: updatedRow, error: null })
    mockSupabase.from.mockReturnValue(builder)

    await updateSubscription('sub-1', { startDate: '2026-03-01' })

    expect(builder.update).toHaveBeenCalledWith(
      expect.objectContaining({ start_date: '2026-03-01', next_payment: '2026-04-01' }),
    )
    expect(originalItems.value[0].nextPayment).toBe('2026-04-01')
  })

  it('removeSubscription deletes the row and drops it from state', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [sampleRow], error: null }))
    const { removeSubscription, originalItems } = await loadComposable()
    await signIn()
    expect(originalItems.value).toHaveLength(1)

    const builder = createQueryBuilder({ data: null, error: null })
    mockSupabase.from.mockReturnValue(builder)

    await removeSubscription('sub-1')

    expect(builder.delete).toHaveBeenCalled()
    expect(originalItems.value).toHaveLength(0)
  })
})
