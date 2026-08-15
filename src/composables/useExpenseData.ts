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
import { supabase } from '@/lib/supabase'
import { useSupabaseCollection } from './useSupabaseCollection'

// 消費類別是固定的前端設定，不是使用者資料，不需要建表
const expenseCategories = ref<ExpenseCategory[]>([
  { id: '1', name: '訂閱', icon: Repeat },
  { id: '2', name: '餐飲', icon: Utensils },
  { id: '3', name: '交通', icon: Car },
  { id: '4', name: '購物', icon: ShoppingBag },
  { id: '5', name: '娛樂', icon: Clapperboard },
  { id: '6', name: '醫療', icon: HeartPulse },
  { id: '7', name: '教育', icon: BookOpen },
  { id: '8', name: '生活用品', icon: Home },
  { id: '9', name: '其他', icon: Package },
])

interface ExpenseRow {
  id: string
  title: string
  description: string | null
  amount: number
  category: string
  date: string
  payment_method: string
  tags: string[] | null
  receipt: string | null
  subscription_id: string | null
  created_at: string
  updated_at: string
}

function mapRowToExpense(row: ExpenseRow): ExpenseRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    amount: row.amount,
    category: row.category,
    date: row.date,
    paymentMethod: row.payment_method,
    tags: row.tags ?? undefined,
    receipt: row.receipt ?? undefined,
    subscriptionId: row.subscription_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const collection = useSupabaseCollection<ExpenseRow, ExpenseRecord>({
  table: 'expenses',
  mapRow: mapRowToExpense,
  orderBy: [
    { column: 'date', ascending: false },
    { column: 'created_at', ascending: false },
  ],
  getId: (item) => item.id,
})
const originalExpenses = collection.items
const isLoading = collection.isLoading
const fetchError = collection.fetchError

// 內部 seam：月份/年份比對邏輯，原本在 stats/categoryStats/filteredExpenses 三處各寫一次
function isInMonth(dateStr: string, month: number, year: number): boolean {
  const date = new Date(dateStr)
  return date.getMonth() === month && date.getFullYear() === year
}

function isInYear(dateStr: string, year: number): boolean {
  return new Date(dateStr).getFullYear() === year
}

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

  const monthlyExpenses = originalExpenses.value.filter((expense) =>
    isInMonth(expense.date, targetMonth, targetYear),
  )

  const yearlyExpenses = originalExpenses.value.filter((expense) => isInYear(expense.date, targetYear))

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
    expensesToAnalyze = originalExpenses.value.filter((expense) =>
      isInMonth(expense.date, targetMonth, targetYear),
    )
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
    result = result.filter((expense) => isInMonth(expense.date, targetMonth, targetYear))
  } else {
    // 時間篩選（當沒有選中特定月份時）
    const now = new Date()
    switch (filterStatus.value) {
      case 'This Month': {
        result = result.filter((expense) => isInMonth(expense.date, now.getMonth(), now.getFullYear()))
        break
      }
      case 'This Year': {
        result = result.filter((expense) => isInYear(expense.date, now.getFullYear()))
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
    }
  )
}

async function addExpense(expense: Omit<ExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>) {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    throw new Error('必須登入才能新增消費紀錄')
  }

  await collection.insert({
    user_id: currentUser.id,
    title: expense.title,
    description: expense.description || null,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    payment_method: expense.paymentMethod,
    tags: expense.tags && expense.tags.length > 0 ? expense.tags : null,
    receipt: expense.receipt || null,
    subscription_id: expense.subscriptionId || null,
  })
}

async function updateExpense(
  id: string,
  expense: Partial<Omit<ExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const dbUpdates: Record<string, unknown> = {}

  if (expense.title !== undefined) dbUpdates.title = expense.title
  if (expense.description !== undefined) dbUpdates.description = expense.description || null
  if (expense.amount !== undefined) dbUpdates.amount = expense.amount
  if (expense.category !== undefined) dbUpdates.category = expense.category
  if (expense.date !== undefined) dbUpdates.date = expense.date
  if (expense.paymentMethod !== undefined) dbUpdates.payment_method = expense.paymentMethod
  if (expense.tags !== undefined) dbUpdates.tags = expense.tags.length > 0 ? expense.tags : null
  if (expense.receipt !== undefined) dbUpdates.receipt = expense.receipt || null
  if (expense.subscriptionId !== undefined)
    dbUpdates.subscription_id = expense.subscriptionId || null

  await collection.update(id, dbUpdates)
}

async function removeExpense(id: string) {
  await collection.remove(id)
}

async function clearAllExpenses() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    throw new Error('必須登入才能清除消費紀錄')
  }

  const { error } = await supabase.from('expenses').delete().eq('user_id', currentUser.id)
  if (error) throw error

  originalExpenses.value = []
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
    isLoading,
    fetchError,

    // 狀態
    searchQuery,
    filterStatus,
    sortBy,
    viewMode,
    selectedMonth,

    // 方法
    addExpense,
    updateExpense,
    removeExpense,
    getCategoryInfo,
    clearAllExpenses,
  }
}
