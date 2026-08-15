const CATEGORY_COLOR_COUNT = 8

// 同一個類別名稱（跨訂閱/消費兩邊）永遠拿到同一個顏色 - 不用維護對照表，新類別自動有色
function hashCategory(category: string): number {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % CATEGORY_COLOR_COUNT
}

// 回傳 inline style 而非 Tailwind class - bg-category-${index} 這種動態組字串
// class 名稱，Tailwind 的靜態掃描器看不到，永遠不會產生對應的 utility
export function getCategoryColorStyle(category: string | undefined): Record<string, string> {
  if (!category) {
    return { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }
  }
  const index = hashCategory(category) + 1
  return {
    backgroundColor: `var(--category-${index})`,
    color: `var(--category-${index}-foreground)`,
  }
}
