import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 讀取 DESIGN.md 定義的 chart-1~5 CSS 變數，供圖表元件當調色盤使用
export function getChartPalette(): string[] {
  if (typeof window === 'undefined') return []
  const styles = getComputedStyle(document.documentElement)
  return [1, 2, 3, 4, 5].map((n) => styles.getPropertyValue(`--chart-${n}`).trim())
}

// 格式化貨幣
export function formatCurrency(amount: number, currency = 'NT$'): string {
  return `${currency}${amount.toLocaleString()}`
}

// 格式化日期
export function formatDate(date: string | Date, format?: string): string {
  const d = new Date(date)

  if (format === 'YYYY年MM月') {
    return (
      d
        .toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
        })
        .replace('/', '年') + '月'
    )
  }

  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 格式化相對時間
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInMs = target.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return '今天'
  if (diffInDays === 1) return '明天'
  if (diffInDays === -1) return '昨天'
  if (diffInDays > 0) return `${diffInDays} 天後`
  return `${Math.abs(diffInDays)} 天前`
}

// 生成唯一 ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 防抖函數
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 節流函數
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 深拷貝
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}
