import { ref, computed } from 'vue'
import {
  BookOpen,
  Car,
  Clapperboard,
  HeartPulse,
  Home,
  Package,
  Repeat,
  ShoppingBag,
  Utensils,
} from 'lucide-vue-next'
import type {
  ExpenseRecord,
  ExpenseCategory,
  ExpenseStats,
  ExpenseFilter,
  ExpenseSortBy,
} from '@/types'
import { generateId } from '@/lib/utils'

// 消費類別數據
const expenseCategories = ref<ExpenseCategory[]>([
  { id: '1', name: '訂閱', icon: Repeat, color: 'bg-indigo-500' },
  { id: '2', name: '餐飲', icon: Utensils, color: 'bg-orange-500' },
  { id: '3', name: '交通', icon: Car, color: 'bg-blue-500' },
  { id: '4', name: '購物', icon: ShoppingBag, color: 'bg-pink-500' },
  { id: '5', name: '娛樂', icon: Clapperboard, color: 'bg-purple-500' },
  { id: '6', name: '醫療', icon: HeartPulse, color: 'bg-red-500' },
  { id: '7', name: '教育', icon: BookOpen, color: 'bg-green-500' },
  { id: '8', name: '生活用品', icon: Home, color: 'bg-yellow-500' },
  { id: '9', name: '其他', icon: Package, color: 'bg-gray-500' },
])

// 原始消費紀錄數據
const originalExpenses = ref<ExpenseRecord[]>([
  {
    id: '1',
    title: '午餐',
    description: '公司附近的日式料理',
    amount: 180,
    category: '餐飲',
    date: '2025-01-15',
    paymentMethod: '信用卡',
    tags: ['工作餐', '日式'],
    createdAt: '2025-01-15T12:00:00Z',
    updatedAt: '2025-01-15T12:00:00Z',
  },
  {
    id: '2',
    title: 'Uber 車費',
    description: '從公司到家的車費',
    amount: 120,
    category: '交通',
    date: '2025-01-15',
    paymentMethod: 'Apple Pay',
    tags: ['通勤'],
    createdAt: '2025-01-15T18:30:00Z',
    updatedAt: '2025-01-15T18:30:00Z',
  },
  {
    id: '3',
    title: 'Netflix 訂閱',
    description: '月費訂閱',
    amount: 390,
    category: '訂閱',
    date: '2025-01-14',
    paymentMethod: '信用卡',
    tags: ['串流', '月費'],
    subscriptionId: 'netflix-001',
    createdAt: '2025-01-14T00:00:00Z',
    updatedAt: '2025-01-14T00:00:00Z',
  },
  {
    id: '4',
    title: '星巴克咖啡',
    description: '下午茶時間',
    amount: 150,
    category: '餐飲',
    date: '2025-01-14',
    paymentMethod: '悠遊卡',
    tags: ['咖啡', '下午茶'],
    createdAt: '2025-01-14T15:00:00Z',
    updatedAt: '2025-01-14T15:00:00Z',
  },
  {
    id: '5',
    title: '藥局購物',
    description: '感冒藥和維他命',
    amount: 450,
    category: '醫療',
    date: '2025-01-13',
    paymentMethod: '現金',
    tags: ['藥品', '維他命'],
    createdAt: '2025-01-13T10:00:00Z',
    updatedAt: '2025-01-13T10:00:00Z',
  },
  {
    id: '6',
    title: '書店購書',
    description: '程式設計相關書籍',
    amount: 680,
    category: '教育',
    date: '2025-01-12',
    paymentMethod: '信用卡',
    tags: ['程式設計', '學習'],
    createdAt: '2025-01-12T14:00:00Z',
    updatedAt: '2025-01-12T14:00:00Z',
  },
  {
    id: '7',
    title: '超市購物',
    description: '週末食材採買',
    amount: 1200,
    category: '生活用品',
    date: '2025-01-11',
    paymentMethod: '信用卡',
    tags: ['食材', '週末'],
    createdAt: '2025-01-11T16:00:00Z',
    updatedAt: '2025-01-11T16:00:00Z',
  },
  {
    id: '8',
    title: '電影票',
    description: '週末看電影',
    amount: 320,
    category: '娛樂',
    date: '2025-01-10',
    paymentMethod: '信用卡',
    tags: ['電影', '週末'],
    createdAt: '2025-01-10T20:00:00Z',
    updatedAt: '2025-01-10T20:00:00Z',
  },
  {
    id: '9',
    title: 'Spotify Premium',
    description: '音樂串流訂閱',
    amount: 149,
    category: '訂閱',
    date: '2025-01-08',
    paymentMethod: '信用卡',
    tags: ['音樂', '月費'],
    subscriptionId: 'spotify-001',
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
  },
  {
    id: '10',
    title: 'YouTube Premium',
    description: '影片串流訂閱',
    amount: 179,
    category: '訂閱',
    date: '2025-01-05',
    paymentMethod: '信用卡',
    tags: ['影片', '月費'],
    subscriptionId: 'youtube-001',
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
  },
  {
    id: '11',
    title: 'Adobe Creative Cloud',
    description: '設計軟體訂閱',
    amount: 680,
    category: '訂閱',
    date: '2025-01-01',
    paymentMethod: '信用卡',
    tags: ['軟體', '月費'],
    subscriptionId: 'adobe-001',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
])

// 搜尋和篩選狀態
const searchQuery = ref('')
const filterStatus = ref<ExpenseFilter>('All')
const sortBy = ref<ExpenseSortBy>('date')
const viewMode = ref<'grid' | 'list'>('list')
const selectedMonth = ref<Date | undefined>(undefined)

// 計算統計數據
const stats = computed((): ExpenseStats => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // 根據選中的月份計算統計
  let targetMonth = currentMonth
  let targetYear = currentYear

  if (selectedMonth.value) {
    targetMonth = selectedMonth.value.getMonth()
    targetYear = selectedMonth.value.getFullYear()
  }

  const monthlyExpenses = originalExpenses.value.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === targetMonth && expenseDate.getFullYear() === targetYear
  })

  const yearlyExpenses = originalExpenses.value.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getFullYear() === targetYear
  })

  // 如果選中了特定月份，則統計該月份的數據
  const expensesToCalculate = selectedMonth.value ? monthlyExpenses : originalExpenses.value

  const totalAmount = expensesToCalculate.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const yearlyTotal = yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const uniqueCategories = new Set(expensesToCalculate.map((expense) => expense.category))

  return {
    totalAmount,
    averageAmount: totalAmount / expensesToCalculate.length || 0,
    recordCount: expensesToCalculate.length,
    categoryCount: uniqueCategories.size,
    monthlyTotal,
    yearlyTotal,
  }
})

// 計算類別統計
const categoryStats = computed(() => {
  const categoryMap = new Map<string, { amount: number; count: number }>()

  // 根據選中的月份篩選數據
  let expensesToAnalyze = originalExpenses.value

  if (selectedMonth.value) {
    const targetMonth = selectedMonth.value.getMonth()
    const targetYear = selectedMonth.value.getFullYear()
    expensesToAnalyze = originalExpenses.value.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === targetMonth && expenseDate.getFullYear() === targetYear
    })
  }

  expensesToAnalyze.forEach((expense) => {
    const existing = categoryMap.get(expense.category)
    if (existing) {
      existing.amount += expense.amount
      existing.count += 1
    } else {
      categoryMap.set(expense.category, { amount: expense.amount, count: 1 })
    }
  })

  const total = Array.from(categoryMap.values()).reduce((sum, data) => sum + data.amount, 0)

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    amount: data.amount,
    count: data.count,
    percentage: Math.round((data.amount / total) * 100),
  }))
})

// 篩選後的數據
const filteredExpenses = computed(() => {
  let result = [...originalExpenses.value]

  // 月份篩選（優先級最高）
  if (selectedMonth.value) {
    const targetMonth = selectedMonth.value.getMonth()
    const targetYear = selectedMonth.value.getFullYear()
    result = result.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === targetMonth && expenseDate.getFullYear() === targetYear
    })
  } else {
    // 時間篩選（當沒有選中特定月份時）
    const now = new Date()
    switch (filterStatus.value) {
      case 'This Month': {
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        result = result.filter((expense) => {
          const expenseDate = new Date(expense.date)
          return (
            expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
          )
        })
        break
      }
      case 'This Year': {
        const currentYear = now.getFullYear()
        result = result.filter((expense) => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getFullYear() === currentYear
        })
        break
      }
      case 'Last 30 Days': {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        result = result.filter((expense) => new Date(expense.date) >= thirtyDaysAgo)
        break
      }
    }
  }

  // 搜尋篩選
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (expense) =>
        expense.title.toLowerCase().includes(query) ||
        expense.description?.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        expense.tags?.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  return result
})

// 排序後的數據
const sortedExpenses = computed(() => {
  const expenses = [...filteredExpenses.value]

  expenses.sort((a, b) => {
    switch (sortBy.value) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'amount':
        return b.amount - a.amount
      case 'category':
        return a.category.localeCompare(b.category)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return expenses
})

// 獲取類別資訊
const getCategoryInfo = (categoryName: string) => {
  return (
    expenseCategories.value.find((cat) => cat.name === categoryName) || {
      id: '0',
      name: categoryName,
      icon: Package,
      color: 'bg-gray-500',
    }
  )
}

// 導出 composable
export function useExpenseData() {
  return {
    // 數據
    originalExpenses,
    filteredExpenses,
    sortedExpenses,
    expenseCategories,
    stats,
    categoryStats,

    // 狀態
    searchQuery,
    filterStatus,
    sortBy,
    viewMode,
    selectedMonth,

    // 方法
    addExpense: (expense: Omit<ExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newExpense: ExpenseRecord = {
        ...expense,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      originalExpenses.value.unshift(newExpense)
    },
    updateExpense: (id: string, expense: Partial<ExpenseRecord>) => {
      const index = originalExpenses.value.findIndex((e) => e.id === id)
      if (index > -1) {
        originalExpenses.value[index] = {
          ...originalExpenses.value[index],
          ...expense,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    removeExpense: (id: string) => {
      const index = originalExpenses.value.findIndex((e) => e.id === id)
      if (index > -1) {
        originalExpenses.value.splice(index, 1)
      }
    },
    getCategoryInfo,
  }
}
