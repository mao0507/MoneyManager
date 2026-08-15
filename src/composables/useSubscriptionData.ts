import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useSupabaseCollection } from './useSupabaseCollection'
import { calculateNextPayment } from '@/lib/subscription-calc'
import type {
  SubscriptionItem,
  NewSubscriptionInput,
  SubscriptionStats,
  CategoryStats,
  VendorStats,
  MonthlyData,
  FilterStatus,
} from '@/types'

interface SubscriptionRow {
  id: string
  name: string
  plan: string
  amount: number
  currency: 'TWD' | 'USD'
  cycle: 'Monthly' | 'Yearly'
  category: string | null
  payment_method: string
  renewal: 'Automatic' | 'Manual'
  start_date: string
  next_payment: string
  active: boolean
}

function mapRowToItem(row: SubscriptionRow): SubscriptionItem {
  return {
    id: row.id,
    name: row.name,
    plan: row.plan,
    amount: row.amount,
    currency: row.currency,
    cycle: row.cycle,
    active: row.active,
    startDate: row.start_date,
    nextPayment: row.next_payment,
    paymentMethod: row.payment_method,
    renewal: row.renewal,
    category: row.category ?? undefined,
  }
}

const collection = useSupabaseCollection<SubscriptionRow, SubscriptionItem>({
  table: 'subscriptions',
  mapRow: mapRowToItem,
  orderBy: [{ column: 'created_at', ascending: false }],
  getId: (item) => item.id,
})
const originalItems = collection.items
const isLoading = collection.isLoading
const fetchError = collection.fetchError
const refetch = collection.fetchAll

// 計算統計數據（月/年互算修正留給 T4，這裡維持既有邏輯不變，只是改吃 amount number）
const stats = computed(
  (): SubscriptionStats => ({
    total: originalItems.value.length,
    active: originalItems.value.filter((item) => item.active).length,
    cancelled: originalItems.value.filter((item) => !item.active).length,
    monthlyTotal: originalItems.value
      .filter((item) => item.active && item.cycle === 'Monthly')
      .reduce((sum, item) => sum + item.amount, 0),
    yearlyTotal: originalItems.value
      .filter((item) => item.active && item.cycle === 'Yearly')
      .reduce((sum, item) => sum + item.amount, 0),
  }),
)

// 計算類別統計
const categoryStats = computed((): CategoryStats[] => {
  const categoryMap = new Map<string, number>()

  originalItems.value
    .filter((item) => item.active && item.category)
    .forEach((item) => {
      const category = item.category!
      categoryMap.set(category, (categoryMap.get(category) || 0) + item.amount)
    })

  const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0)

  return Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: Math.round((amount / total) * 100),
  }))
})

// 計算供應商統計
const vendorStats = computed((): VendorStats[] => {
  const vendorMap = new Map<string, { amount: number; subscriptions: number }>()

  originalItems.value
    .filter((item) => item.active)
    .forEach((item) => {
      const vendor = item.name
      const existing = vendorMap.get(vendor)

      if (existing) {
        existing.amount += item.amount
        existing.subscriptions += 1
      } else {
        vendorMap.set(vendor, { amount: item.amount, subscriptions: 1 })
      }
    })

  return Array.from(vendorMap.entries()).map(([vendor, data]) => ({
    vendor,
    amount: data.amount,
    subscriptions: data.subscriptions,
    trend: '+2.1%', // 這裡可以根據實際數據計算趨勢
  }))
})

// 月度數據（用於報表，暫時使用模擬數據）
const monthlyData = computed(
  (): MonthlyData[] => [
    { month: '2025年1月', amount: 1234.56, change: '+5.2%' },
    { month: '2025年2月', amount: 1456.78, change: '+18.0%' },
    { month: '2025年3月', amount: 1678.9, change: '+15.2%' },
    { month: '2025年4月', amount: 1890.12, change: '+12.6%' },
    { month: '2025年5月', amount: 2012.34, change: '+6.5%' },
    { month: '2025年6月', amount: 2134.56, change: '+6.1%' },
  ],
)

// 搜尋和篩選功能
const searchQuery = ref('')
const filterStatus = ref<FilterStatus>('All')

const filteredItems = computed(() => {
  let result = originalItems.value

  if (filterStatus.value === 'Active') {
    result = result.filter((item) => item.active)
  } else if (filterStatus.value === 'Cancelled') {
    result = result.filter((item) => !item.active)
  } else if (filterStatus.value === 'Trial') {
    result = result.filter((item) => item.plan.toLowerCase().includes('trial'))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.plan.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query),
    )
  }

  return result
})

async function addSubscription(input: NewSubscriptionInput) {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    throw new Error('必須登入才能新增訂閱')
  }

  const nextPayment = calculateNextPayment(input.startDate, input.cycle)

  await collection.insert({
    user_id: currentUser.id,
    name: input.name,
    plan: input.plan,
    amount: input.amount,
    currency: input.currency,
    cycle: input.cycle,
    category: input.category || null,
    payment_method: input.paymentMethod,
    renewal: input.renewal,
    start_date: input.startDate,
    next_payment: nextPayment,
    active: true,
  })
}

async function updateSubscription(
  id: string,
  updates: Partial<NewSubscriptionInput> & { active?: boolean },
) {
  const dbUpdates: Record<string, unknown> = {}

  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.plan !== undefined) dbUpdates.plan = updates.plan
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount
  if (updates.currency !== undefined) dbUpdates.currency = updates.currency
  if (updates.cycle !== undefined) dbUpdates.cycle = updates.cycle
  if (updates.category !== undefined) dbUpdates.category = updates.category || null
  if (updates.paymentMethod !== undefined) dbUpdates.payment_method = updates.paymentMethod
  if (updates.renewal !== undefined) dbUpdates.renewal = updates.renewal
  if (updates.active !== undefined) dbUpdates.active = updates.active

  if (updates.startDate !== undefined) {
    dbUpdates.start_date = updates.startDate
    const existing = originalItems.value.find((item) => item.id === id)
    let cycle = updates.cycle ?? existing?.cycle

    // 本地快取沒有這筆（例如重新整理後直接編輯），改查 DB 拿現有 cycle，
    // 不然就會漏算 next_payment
    if (!cycle) {
      const { data: cycleRow, error: cycleError } = await supabase
        .from('subscriptions')
        .select('cycle')
        .eq('id', id)
        .single()
      if (cycleError) throw cycleError
      cycle = (cycleRow as { cycle: 'Monthly' | 'Yearly' }).cycle
    }

    if (cycle) {
      dbUpdates.next_payment = calculateNextPayment(updates.startDate, cycle)
    }
  }

  await collection.update(id, dbUpdates)
}

async function removeSubscription(id: string) {
  await collection.remove(id)
}

async function clearAllSubscriptions() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    throw new Error('必須登入才能清除訂閱資料')
  }

  const { error } = await supabase.from('subscriptions').delete().eq('user_id', currentUser.id)
  if (error) throw error

  originalItems.value = []
}

// 導出 composable
export function useSubscriptionData() {
  return {
    // 數據
    originalItems,
    filteredItems,
    stats,
    categoryStats,
    vendorStats,
    monthlyData,
    isLoading,
    fetchError,

    // 狀態
    searchQuery,
    filterStatus,

    // 方法
    refetch,
    addSubscription,
    updateSubscription,
    removeSubscription,
    clearAllSubscriptions,
  }
}
