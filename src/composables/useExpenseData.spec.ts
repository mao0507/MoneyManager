import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

let sessionRef: ReturnType<typeof ref<{ data: { user: { id: string } } | null; isPending: boolean }>>

vi.mock('@/lib/auth-client', () => {
  sessionRef = ref({ data: null, isPending: false })
  return {
    authClient: {
      useSession: () => sessionRef,
      signIn: { social: vi.fn() },
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
  }
})

const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

vi.mock('@/lib/api-client', () => ({ apiClient: mockApiClient }))

async function loadComposable() {
  vi.resetModules()
  const { useExpenseData } = await import('./useExpenseData')
  return useExpenseData()
}

async function signIn(userId = 'user-1') {
  sessionRef.value = { data: { user: { id: userId } }, isPending: false }
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
  paymentMethod: '信用卡',
  tags: ['工作餐', '日式'],
  receipt: null,
  subscriptionId: null,
  createdAt: '2026-01-15T12:00:00Z',
  updatedAt: '2026-01-15T12:00:00Z',
}

describe('useExpenseData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches expenses for the signed-in user', async () => {
    mockApiClient.get.mockResolvedValue([sampleRow])

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
    mockApiClient.get.mockResolvedValue([sampleRow])
    const { originalExpenses } = await loadComposable()
    await signIn()
    expect(originalExpenses.value).toHaveLength(1)

    sessionRef.value = { data: null, isPending: false }
    await nextTick()

    expect(originalExpenses.value).toHaveLength(0)
  })

  it('surfaces the error and stops loading when fetchExpenses fails', async () => {
    mockApiClient.get.mockRejectedValue(new Error('連線失敗'))
    const { fetchError, isLoading, originalExpenses } = await loadComposable()
    await signIn()

    expect(fetchError.value).toBe('連線失敗')
    expect(isLoading.value).toBe(false)
    expect(originalExpenses.value).toEqual([])
  })

  it('ignores a stale fetch that resolves after the user signs out', async () => {
    let resolveFetch: (value: unknown[]) => void = () => {}
    mockApiClient.get.mockReturnValue(new Promise((resolve) => (resolveFetch = resolve)))

    const { originalExpenses } = await loadComposable()
    sessionRef.value = { data: { user: { id: 'user-1' } }, isPending: false }
    await nextTick()

    sessionRef.value = { data: null, isPending: false }
    await nextTick()

    resolveFetch([sampleRow])
    await nextTick()
    await nextTick()

    expect(originalExpenses.value).toEqual([])
  })

  it('addExpense inserts and prepends the result', async () => {
    mockApiClient.get.mockResolvedValue([])
    const { addExpense, originalExpenses } = await loadComposable()
    await signIn('user-42')

    mockApiClient.post.mockResolvedValue({ ...sampleRow, id: 'exp-new' })

    await addExpense({
      title: '午餐',
      description: '公司附近的日式料理',
      amount: 180,
      category: '餐飲',
      date: '2026-01-15',
      paymentMethod: '信用卡',
      tags: ['工作餐', '日式'],
    })

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/expenses',
      expect.objectContaining({
        title: '午餐',
        amount: 180,
        category: '餐飲',
        date: '2026-01-15',
        paymentMethod: '信用卡',
      }),
    )
    expect(originalExpenses.value[0].id).toBe('exp-new')
  })

  it('addExpense normalises empty description/tags to null', async () => {
    mockApiClient.get.mockResolvedValue([])
    const { addExpense } = await loadComposable()
    await signIn('user-42')

    mockApiClient.post.mockResolvedValue({ ...sampleRow, id: 'exp-new' })

    await addExpense({
      title: '午餐',
      description: '',
      amount: 180,
      category: '餐飲',
      date: '2026-01-15',
      paymentMethod: '信用卡',
      tags: [],
    })

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/expenses',
      expect.objectContaining({ description: null, tags: null }),
    )
  })

  it('addExpense rejects when the server refuses the request', async () => {
    mockApiClient.get.mockResolvedValue([])
    const { addExpense } = await loadComposable()

    mockApiClient.post.mockRejectedValue(new Error('未登入'))

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
    mockApiClient.get.mockResolvedValue([sampleRow])
    const { updateExpense, originalExpenses } = await loadComposable()
    await signIn()

    mockApiClient.patch.mockResolvedValue({ ...sampleRow, amount: 250 })

    await updateExpense('exp-1', { amount: 250 })

    expect(mockApiClient.patch).toHaveBeenCalledWith('/expenses/exp-1', expect.objectContaining({ amount: 250 }))
    expect(originalExpenses.value[0].amount).toBe(250)
  })

  it('maps a null tags column to undefined', async () => {
    mockApiClient.get.mockResolvedValue([{ ...sampleRow, tags: null }])
    const { originalExpenses } = await loadComposable()
    await signIn()

    expect(originalExpenses.value[0].tags).toBeUndefined()
  })

  it('filteredExpenses applies the month filter and the search query over fetched data', async () => {
    const inMonth = { ...sampleRow, id: 'exp-in', date: '2026-01-20', title: '午餐特輯' }
    const outOfMonth = { ...sampleRow, id: 'exp-out', date: '2025-11-01', title: '晚餐' }
    mockApiClient.get.mockResolvedValue([inMonth, outOfMonth])
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
    mockApiClient.get.mockResolvedValue([sampleRow])
    const { removeExpense, originalExpenses } = await loadComposable()
    await signIn()
    expect(originalExpenses.value).toHaveLength(1)

    mockApiClient.delete.mockResolvedValue(undefined)

    await removeExpense('exp-1')

    expect(mockApiClient.delete).toHaveBeenCalledWith('/expenses/exp-1')
    expect(originalExpenses.value).toHaveLength(0)
  })
})
