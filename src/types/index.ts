// 訂閱相關類型
export interface SubscriptionItem {
  id: string
  name: string
  plan: string
  amount: number
  currency: 'TWD' | 'USD'
  cycle: 'Monthly' | 'Yearly'
  active: boolean
  startDate: string
  nextPayment: string
  paymentMethod: string
  renewal: 'Automatic' | 'Manual'
  category?: string
}

// 新增訂閱時的輸入（不含系統自動產生/計算的欄位）
export interface NewSubscriptionInput {
  name: string
  plan: string
  amount: number
  currency: 'TWD' | 'USD'
  cycle: 'Monthly' | 'Yearly'
  category?: string
  paymentMethod: string
  renewal: 'Automatic' | 'Manual'
  startDate: string
}

// 統計數據類型
export interface SubscriptionStats {
  total: number
  active: number
  cancelled: number
  monthlyTotal: number
  yearlyTotal: number
}

// 類別統計類型
export interface CategoryStats {
  category: string
  amount: number
  percentage: number
}

// 供應商統計類型
export interface VendorStats {
  vendor: string
  amount: number
  subscriptions: number
  trend: string
}

// 月度數據類型
export interface MonthlyData {
  month: string
  amount: number
  change: string
}

// 通知類型
export interface NotificationItem {
  id: number
  title: string
  message: string
  type: 'renewal' | 'payment' | 'new' | 'cancellation' | 'warning'
  priority: 'low' | 'medium' | 'high'
  read: boolean
  timestamp: string
}

// 通知設定類型
export interface NotificationSettings {
  email: {
    enabled: boolean
    renewal: boolean
    payment: boolean
    newSubscription: boolean
    cancellation: boolean
  }
  push: {
    enabled: boolean
    renewal: boolean
    payment: boolean
    newSubscription: boolean
    cancellation: boolean
  }
  sms: {
    enabled: boolean
    renewal: boolean
    payment: boolean
    newSubscription: boolean
    cancellation: boolean
  }
}

// 路由元數據類型
export interface RouteMeta {
  title: string
  description?: string
  icon?: string
  requiresAuth?: boolean
}

// 篩選狀態類型
export type FilterStatus = 'All' | 'Active' | 'Trial' | 'Cancelled'

// 排序類型
export type SortBy = 'name' | 'price' | 'nextPayment'

// 視圖模式類型
export type ViewMode = 'grid' | 'list'

// 時間範圍類型
export type TimeRange = '3months' | '6months' | '1year' | 'all'

// 匯出格式類型
export type ExportFormat = 'pdf' | 'csv' | 'excel'

// API 響應類型
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// 分頁類型
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 錯誤類型
export interface AppError {
  code: string
  message: string
  details?: unknown
}

// 消費紀錄類型
export interface ExpenseRecord {
  id: string
  title: string
  description?: string
  amount: number
  category: string
  date: string
  paymentMethod: string
  tags?: string[]
  receipt?: string
  subscriptionId?: string
  createdAt: string
  updatedAt: string
}

// 消費類別類型
export interface ExpenseCategory {
  id: string
  name: string
  icon: string
  color: string
  budget?: number
}

// 消費統計類型
export interface ExpenseStats {
  totalAmount: number
  averageAmount: number
  recordCount: number
  categoryCount: number
  monthlyTotal: number
  yearlyTotal: number
}

// 消費篩選類型
export type ExpenseFilter = 'All' | 'This Month' | 'This Year' | 'Last 30 Days' | 'Custom'

// 消費排序類型
export type ExpenseSortBy = 'date' | 'amount' | 'category' | 'title'
