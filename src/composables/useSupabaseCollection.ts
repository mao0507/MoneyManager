import { ref, watch, type Ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface OrderClause {
  column: string
  ascending: boolean
}

interface UseSupabaseCollectionOptions<Row, Item> {
  table: string
  mapRow: (row: Row) => Item
  orderBy: OrderClause[]
  getId: (item: Item) => string
}

// 共用的「登入者感知 Supabase 集合」深模組：處理 fetch/生成守衛/登出清空/CRUD 樂觀更新，
// 讓 useSubscriptionData / useExpenseData 只需專注在各自的欄位對應和統計邏輯。
export function useSupabaseCollection<Row, Item>(options: UseSupabaseCollectionOptions<Row, Item>) {
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

    let query = supabase.from(options.table).select('*')
    for (const clause of options.orderBy) {
      query = query.order(clause.column, { ascending: clause.ascending })
    }
    const { data, error } = await query

    if (generation !== fetchGeneration) return

    if (!error && data) {
      items.value = (data as Row[]).map(options.mapRow)
    } else if (error) {
      fetchError.value = error.message
    }
    isLoading.value = false
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
    const { data, error } = await supabase.from(options.table).insert(payload).select().single()
    if (error) throw error

    const item = options.mapRow(data as Row)
    items.value = [item, ...items.value]
    return item
  }

  async function update(id: string, payload: Record<string, unknown>): Promise<Item> {
    const { data, error } = await supabase.from(options.table).update(payload).eq('id', id).select().single()
    if (error) throw error

    const item = options.mapRow(data as Row)
    const index = items.value.findIndex((existing) => options.getId(existing) === id)
    if (index !== -1) {
      items.value[index] = item
    } else {
      items.value = [item, ...items.value]
    }
    return item
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from(options.table).delete().eq('id', id)
    if (error) throw error

    items.value = items.value.filter((existing) => options.getId(existing) !== id)
  }

  return { items, isLoading, fetchError, fetchAll, insert, update, remove }
}
