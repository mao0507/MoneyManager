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
  const { useSubscriptionData } = await import('./useSubscriptionData')
  return useSubscriptionData()
}

async function signIn(userId = 'user-1') {
  sessionRef.value = { data: { user: { id: userId } }, isPending: false }
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
  paymentMethod: 'Credit Card',
  renewal: 'Automatic',
  startDate: '2026-01-15',
  nextPayment: '2026-02-15',
  active: true,
}

describe('useSubscriptionData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches subscriptions for the signed-in user', async () => {
    mockApiClient.get.mockResolvedValue([sampleRow])

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
    mockApiClient.get.mockResolvedValue([sampleRow])
    const { originalItems } = await loadComposable()
    await signIn()
    expect(originalItems.value).toHaveLength(1)

    sessionRef.value = { data: null, isPending: false }
    await nextTick()

    expect(originalItems.value).toHaveLength(0)
  })

  it('addSubscription computes nextPayment and inserts', async () => {
    mockApiClient.get.mockResolvedValue([])
    const { addSubscription, originalItems } = await loadComposable()
    await signIn('user-42')

    mockApiClient.post.mockResolvedValue({ ...sampleRow, id: 'sub-new' })

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

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/subscriptions',
      expect.objectContaining({
        name: 'Netflix',
        amount: 390,
        currency: 'TWD',
        startDate: '2026-01-15',
        nextPayment: '2026-02-15',
      }),
    )
    expect(originalItems.value[0].id).toBe('sub-new')
  })

  it('addSubscription rejects when the server refuses the request', async () => {
    mockApiClient.get.mockResolvedValue([])
    const { addSubscription } = await loadComposable()

    mockApiClient.post.mockRejectedValue(new Error('未登入'))

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

  it('updateSubscription recalculates nextPayment when startDate changes', async () => {
    mockApiClient.get.mockResolvedValue([sampleRow])
    const { updateSubscription, originalItems } = await loadComposable()
    await signIn()

    mockApiClient.patch.mockResolvedValue({
      ...sampleRow,
      startDate: '2026-03-01',
      nextPayment: '2026-04-01',
    })

    await updateSubscription('sub-1', { startDate: '2026-03-01' })

    expect(mockApiClient.patch).toHaveBeenCalledWith(
      '/subscriptions/sub-1',
      expect.objectContaining({ startDate: '2026-03-01', nextPayment: '2026-04-01' }),
    )
    expect(originalItems.value[0].nextPayment).toBe('2026-04-01')
  })

  it('surfaces the error and stops loading when fetchSubscriptions fails', async () => {
    mockApiClient.get.mockRejectedValue(new Error('連線失敗'))
    const { fetchError, isLoading, originalItems } = await loadComposable()
    await signIn()

    expect(fetchError.value).toBe('連線失敗')
    expect(isLoading.value).toBe(false)
    expect(originalItems.value).toEqual([])
  })

  it('ignores a stale fetch that resolves after the user signs out', async () => {
    let resolveFetch: (value: unknown[]) => void = () => {}
    mockApiClient.get.mockReturnValue(new Promise((resolve) => (resolveFetch = resolve)))

    const { originalItems } = await loadComposable()
    sessionRef.value = { data: { user: { id: 'user-1' } }, isPending: false }
    await nextTick()

    sessionRef.value = { data: null, isPending: false }
    await nextTick()

    resolveFetch([sampleRow])
    await nextTick()
    await nextTick()

    expect(originalItems.value).toEqual([])
  })

  it('updateSubscription looks up cycle from the API when the item is not cached locally', async () => {
    mockApiClient.get.mockResolvedValue([])
    const { updateSubscription, originalItems } = await loadComposable()
    await signIn()
    expect(originalItems.value).toEqual([])

    mockApiClient.get.mockResolvedValueOnce({ cycle: 'Yearly' })
    mockApiClient.patch.mockResolvedValue({
      ...sampleRow,
      id: 'sub-missing',
      startDate: '2026-03-01',
      nextPayment: '2027-03-01',
    })

    await updateSubscription('sub-missing', { startDate: '2026-03-01' })

    expect(mockApiClient.patch).toHaveBeenCalledWith(
      '/subscriptions/sub-missing',
      expect.objectContaining({ startDate: '2026-03-01', nextPayment: '2027-03-01' }),
    )
  })

  it('removeSubscription deletes the row and drops it from state', async () => {
    mockApiClient.get.mockResolvedValue([sampleRow])
    const { removeSubscription, originalItems } = await loadComposable()
    await signIn()
    expect(originalItems.value).toHaveLength(1)

    mockApiClient.delete.mockResolvedValue(undefined)

    await removeSubscription('sub-1')

    expect(mockApiClient.delete).toHaveBeenCalledWith('/subscriptions/sub-1')
    expect(originalItems.value).toHaveLength(0)
  })
})
