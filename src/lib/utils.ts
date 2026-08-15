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

