import { ref, watch, type Ref } from 'vue'
import { apiClient } from '@/lib/api-client'
import { useAuth } from './useAuth'

interface UseApiCollectionOptions<Row, Item> {
  resource: string
  mapRow: (row: Row) => Item
  getId: (item: Item) => string
}

// 共用的「登入者感知 API 集合」深模組：處理 fetch/生成守衛/登出清空/CRUD 樂觀更新，
// 讓 useSubscriptionData / useExpenseData 只需專注在各自的欄位對應和統計邏輯。
export function useApiCollection<Row, Item>(options: UseApiCollectionOptions<Row, Item>) {
  const items = ref<Item[]>([]) as Ref<Item[]>
  const isLoading = ref(false)
  const fetchError = ref<string | null>(null)

  // 每次 fetch 遞增，讓過期的 fetch resolve 時能發現自己已經不是最新請求而放棄套用結果
  // 避免登出後，前一個帳號的 fetch 才 resolve 蓋掉已清空的畫面
  let fetchGeneration = 0

  async function fetchAll() {
    const generation = ++fetchGeneration
    isLoading.value = true
    fetchError.value = null

    try {
      const rows = await apiClient.get<Row[]>(`/${options.resource}`)
      if (generation !== fetchGeneration) return
      items.value = rows.map(options.mapRow)
    } catch (error) {
      if (generation !== fetchGeneration) return
      fetchError.value = error instanceof Error ? error.message : '載入失敗'
    } finally {
      if (generation === fetchGeneration) isLoading.value = false
    }
  }

  const { user } = useAuth()
  watch(
    user,
    (currentUser) => {
      if (currentUser) {
        fetchAll()
      } else {
        fetchGeneration++
        items.value = []
        fetchError.value = null
        isLoading.value = false
      }
    },
    { immediate: true },
  )

  async function insert(payload: Record<string, unknown>): Promise<Item> {
    const row = await apiClient.post<Row>(`/${options.resource}`, payload)
    const item = options.mapRow(row)
    items.value = [item, ...items.value]
    return item
  }

  async function update(id: string, payload: Record<string, unknown>): Promise<Item> {
    const row = await apiClient.patch<Row>(`/${options.resource}/${id}`, payload)
    const item = options.mapRow(row)
    const index = items.value.findIndex((existing) => options.getId(existing) === id)
    if (index !== -1) {
      items.value[index] = item
    } else {
      items.value = [item, ...items.value]
    }
    return item
  }

  async function remove(id: string): Promise<void> {
    await apiClient.delete(`/${options.resource}/${id}`)
    items.value = items.value.filter((existing) => options.getId(existing) !== id)
  }

  async function removeAll(): Promise<void> {
    await apiClient.delete(`/${options.resource}`)
    items.value = []
  }

  return { items, isLoading, fetchError, fetchAll, insert, update, remove, removeAll }
}
