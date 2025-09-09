import { ref, computed } from 'vue'
import type {
  SubscriptionItem,
  SubscriptionStats,
  CategoryStats,
  VendorStats,
  MonthlyData,
  FilterStatus,
} from '@/types'

// 原始訂閱數據
const originalItems = ref<SubscriptionItem[]>([
  {
    name: 'Spotify',
    plan: 'Family',
    price: 'NT$143',
    cycle: 'Monthly',
    active: true,
    nextPayment: '2025年7月15日',
    paymentMethod: 'Apple Pay',
    renewal: 'Automatic',
    category: '音樂串流',
  },
  {
    name: 'VPS-HK',
    plan: '4H4G',
    price: 'NT$28',
    cycle: 'Monthly',
    active: true,
    nextPayment: '2025年7月26日',
    paymentMethod: 'Wechat Pay',
    renewal: 'Manual',
    category: 'VPS服務',
  },
  {
    name: 'YouTube',
    plan: 'Premium',
    price: 'NT$57',
    cycle: 'Monthly',
    active: true,
    nextPayment: '2025年8月8日',
    paymentMethod: 'Google Pay',
    renewal: 'Manual',
    category: '影片串流',
  },
  {
    name: '阿里雲',
    plan: '.top',
    price: 'NT$39',
    cycle: 'Yearly',
    active: true,
    nextPayment: '2025年10月11日',
    paymentMethod: 'Alipay',
    renewal: 'Manual',
    category: '域名服務',
  },
  {
    name: 'Monica',
    plan: 'Unlimited',
    price: 'NT$780',
    cycle: 'Yearly',
    active: true,
    nextPayment: '2025年12月7日',
    paymentMethod: 'Alipay',
    renewal: 'Manual',
    category: '生產力工具',
  },
  {
    name: 'Cursor',
    plan: 'Pro',
    price: 'NT$716',
    cycle: 'Yearly',
    active: true,
    nextPayment: '2026年4月17日',
    paymentMethod: 'Credit Card',
    renewal: 'Manual',
    category: '軟體工具',
  },
  {
    name: 'Netflix',
    plan: 'Standard',
    price: 'NT$68',
    cycle: 'Monthly',
    active: false,
    nextPayment: '已取消',
    paymentMethod: 'Credit Card',
    renewal: 'Manual',
    category: '影片串流',
  },
])

// 計算統計數據
const stats = computed(
  (): SubscriptionStats => ({
    total: originalItems.value.length,
    active: originalItems.value.filter((item) => item.active).length,
    cancelled: originalItems.value.filter((item) => !item.active).length,
    monthlyTotal: originalItems.value
      .filter((item) => item.active && item.cycle === 'Monthly')
      .reduce((sum, item) => sum + parseFloat(item.price.replace(/[NT$,]/g, '')), 0),
    yearlyTotal: originalItems.value
      .filter((item) => item.active && item.cycle === 'Yearly')
      .reduce((sum, item) => sum + parseFloat(item.price.replace(/[NT$,]/g, '')), 0),
  }),
)

// 計算類別統計
const categoryStats = computed((): CategoryStats[] => {
  const categoryMap = new Map<string, number>()

  originalItems.value
    .filter((item) => item.active && item.category)
    .forEach((item) => {
      const category = item.category!
      const amount = parseFloat(item.price.replace(/[NT$,]/g, ''))
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount)
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
      const amount = parseFloat(item.price.replace(/[NT$,]/g, ''))
      const existing = vendorMap.get(vendor)

      if (existing) {
        existing.amount += amount
        existing.subscriptions += 1
      } else {
        vendorMap.set(vendor, { amount, subscriptions: 1 })
      }
    })

  return Array.from(vendorMap.entries()).map(([vendor, data]) => ({
    vendor,
    amount: data.amount,
    subscriptions: data.subscriptions,
    trend: '+2.1%', // 這裡可以根據實際數據計算趨勢
  }))
})

// 月度數據（用於報表）
const monthlyData = computed((): MonthlyData[] => {
  // 這裡可以根據實際的歷史數據來計算
  // 目前使用模擬數據
  return [
    { month: '2025年1月', amount: 1234.56, change: '+5.2%' },
    { month: '2025年2月', amount: 1456.78, change: '+18.0%' },
    { month: '2025年3月', amount: 1678.9, change: '+15.2%' },
    { month: '2025年4月', amount: 1890.12, change: '+12.6%' },
    { month: '2025年5月', amount: 2012.34, change: '+6.5%' },
    { month: '2025年6月', amount: 2134.56, change: '+6.1%' },
  ]
})

// 搜尋和篩選功能
const searchQuery = ref('')
const filterStatus = ref<FilterStatus>('All')

const filteredItems = computed(() => {
  let result = originalItems.value

  // 狀態篩選
  if (filterStatus.value === 'Active') {
    result = result.filter((item) => item.active)
  } else if (filterStatus.value === 'Cancelled') {
    result = result.filter((item) => !item.active)
  } else if (filterStatus.value === 'Trial') {
    result = result.filter((item) => item.plan.toLowerCase().includes('trial'))
  }

  // 搜尋篩選
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

    // 狀態
    searchQuery,
    filterStatus,

    // 方法
    addSubscription: (item: SubscriptionItem) => {
      originalItems.value.push(item)
    },
    updateSubscription: (index: number, item: SubscriptionItem) => {
      originalItems.value[index] = item
    },
    removeSubscription: (index: number) => {
      originalItems.value.splice(index, 1)
    },
  }
}
