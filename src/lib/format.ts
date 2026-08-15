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
