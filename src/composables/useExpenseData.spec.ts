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
  const { useExpenseData } = await import('./useExpenseData')
  return useExpenseData()
}

async function signIn(userId = 'user-1') {
  mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } } })
  authChangeCallback?.('SIGNED_IN', { user: { id: userId } })
  await nextTick()
  await nextTick()
}

const sampleRow = {
  id: 'exp-1',
  title: '午餐',
  description: '公司附近的日式料理',
  amount: 180,
  category: '餐飲',
  date: '2026-01-15',
  payment_method: '信用卡',
  tags: ['工作餐', '日式'],
  receipt: null,
  subscription_id: null,
  created_at: '2026-01-15T12:00:00Z',
  updated_at: '2026-01-15T12:00:00Z',
}

describe('useExpenseData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches expenses for the signed-in user', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [sampleRow], error: null }))

    const { originalExpenses } = await loadComposable()
    await signIn()

    expect(originalExpenses.value).toEqual([
      {
        id: 'exp-1',
        title: '午餐',
        description: '公司附近的日式料理',
        amount: 180,
        category: '餐飲',
        date: '2026-01-15',
        paymentMethod: '信用卡',
        tags: ['工作餐', '日式'],
        receipt: undefined,
        subscriptionId: undefined,
        createdAt: '2026-01-15T12:00:00Z',
        updatedAt: '2026-01-15T12:00:00Z',
      },
    ])
  })

  it('clears expenses when the user signs out', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [sampleRow], error: null }))
    const { originalExpenses } = await loadComposable()
    await signIn()
    expect(originalExpenses.value).toHaveLength(1)

    authChangeCallback?.('SIGNED_OUT', null)
    await nextTick()

    expect(originalExpenses.value).toHaveLength(0)
  })

  it('surfaces the error and stops loading when fetchExpenses fails', async () => {
    mockSupabase.from.mockReturnValue(
      createQueryBuilder({ data: null, error: { message: '連線失敗' } }),
    )
    const { fetchError, isLoading, originalExpenses } = await loadComposable()
    await signIn()

    expect(fetchError.value).toBe('連線失敗')
    expect(isLoading.value).toBe(false)
    expect(originalExpenses.value).toEqual([])
  })

  it('ignores a stale fetch that resolves after the user signs out', async () => {
    let resolveFetch: (value: { data: unknown; error: unknown }) => void = () => {}
    const slowBuilder = createQueryBuilder({ data: [sampleRow], error: null })
    slowBuilder.then = (resolve: (value: { data: unknown; error: unknown }) => void) => {
      resolveFetch = resolve
    }
    mockSupabase.from.mockReturnValue(slowBuilder)

    const { originalExpenses } = await loadComposable()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    authChangeCallback?.('SIGNED_IN', { user: { id: 'user-1' } })
    await nextTick()

    authChangeCallback?.('SIGNED_OUT', null)
    await nextTick()

    resolveFetch({ data: [sampleRow], error: null })
    await nextTick()
    await nextTick()

    expect(originalExpenses.value).toEqual([])
  })

  it('addExpense inserts with the current user id and prepends the result', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [], error: null }))
    const { addExpense, originalExpenses } = await loadComposable()
    await signIn('user-42')

    const builder = createQueryBuilder({ data: { ...sampleRow, id: 'exp-new' }, error: null })
    mockSupabase.from.mockReturnValue(builder)

    await addExpense({
      title: '午餐',
      description: '公司附近的日式料理',
      amount: 180,
      category: '餐飲',
      date: '2026-01-15',
      paymentMethod: '信用卡',
      tags: ['工作餐', '日式'],
    })

    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-42',
        title: '午餐',
        amount: 180,
        category: '餐飲',
        date: '2026-01-15',
        payment_method: '信用卡',
      }),
    )
    expect(originalExpenses.value[0].id).toBe('exp-new')
  })

  it('addExpense normalises empty description/tags to null', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [], error: null }))
    const { addExpense } = await loadComposable()
    await signIn('user-42')

    const builder = createQueryBuilder({ data: { ...sampleRow, id: 'exp-new' }, error: null })
    mockSupabase.from.mockReturnValue(builder)

    await addExpense({
      title: '午餐',
      description: '',
      amount: 180,
      category: '餐飲',
      date: '2026-01-15',
      paymentMethod: '信用卡',
      tags: [],
    })

    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ description: null, tags: null }),
    )
  })

  it('addExpense throws when nobody is signed in', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [], error: null }))
    const { addExpense } = await loadComposable()

    await expect(
      addExpense({
        title: '午餐',
        amount: 180,
        category: '餐飲',
        date: '2026-01-15',
        paymentMethod: '信用卡',
      }),
    ).rejects.toThrow()
  })

  it('updateExpense updates the row and syncs local state', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [sampleRow], error: null }))
    const { updateExpense, originalExpenses } = await loadComposable()
    await signIn()

    const updatedRow = { ...sampleRow, amount: 250 }
    const builder = createQueryBuilder({ data: updatedRow, error: null })
    mockSupabase.from.mockReturnValue(builder)

    await updateExpense('exp-1', { amount: 250 })

    expect(builder.update).toHaveBeenCalledWith(expect.objectContaining({ amount: 250 }))
    expect(originalExpenses.value[0].amount).toBe(250)
  })

  it('maps a null tags column to undefined', async () => {
    mockSupabase.from.mockReturnValue(
      createQueryBuilder({ data: [{ ...sampleRow, tags: null }], error: null }),
    )
    const { originalExpenses } = await loadComposable()
    await signIn()

    expect(originalExpenses.value[0].tags).toBeUndefined()
  })

  it('filteredExpenses applies the month filter and the search query over fetched data', async () => {
    const inMonth = { ...sampleRow, id: 'exp-in', date: '2026-01-20', title: '午餐特輯' }
    const outOfMonth = { ...sampleRow, id: 'exp-out', date: '2025-11-01', title: '晚餐' }
    mockSupabase.from.mockReturnValue(
      createQueryBuilder({ data: [inMonth, outOfMonth], error: null }),
    )
    const { filteredExpenses, filterStatus, searchQuery } = await loadComposable()
    await signIn()

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-25'))
    filterStatus.value = 'This Month'
    expect(filteredExpenses.value.map((e) => e.id)).toEqual(['exp-in'])
    vi.useRealTimers()

    filterStatus.value = 'All'
    searchQuery.value = '日式'
    expect(filteredExpenses.value.map((e) => e.id)).toEqual(['exp-in', 'exp-out'])
  })

  it('removeExpense deletes the row and drops it from state', async () => {
    mockSupabase.from.mockReturnValue(createQueryBuilder({ data: [sampleRow], error: null }))
    const { removeExpense, originalExpenses } = await loadComposable()
    await signIn()
    expect(originalExpenses.value).toHaveLength(1)

    const builder = createQueryBuilder({ data: null, error: null })
    mockSupabase.from.mockReturnValue(builder)

    await removeExpense('exp-1')

    expect(builder.delete).toHaveBeenCalled()
    expect(originalExpenses.value).toHaveLength(0)
  })
})
