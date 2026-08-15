<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Bell,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Receipt,
  Repeat,
  Search,
  Settings,
  Sun,
  TrendingUp,
  Zap,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'
import { isDark, toggleDark } from '@/composables/useTheme'
import { useSubscriptionData } from '@/composables/useSubscriptionData'
import { useExpenseData } from '@/composables/useExpenseData'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, signOut } = useAuth()

// 導航配置
const navigationItems = [
  { path: '/dashboard', label: '儀表板', icon: LayoutDashboard },
  { path: '/subscriptions', label: '訂閱管理', icon: Repeat },
  { path: '/expense-records', label: '消費紀錄', icon: Receipt },
  { path: '/reports', label: '支出報表', icon: TrendingUp },
  { path: '/notifications', label: '通知設定', icon: Bell },
  { path: '/settings', label: '設定', icon: Settings },
] as const

// 檢查路由是否為當前活躍狀態
const isActive = (path: string) => computed(() => route.path === path)

// 介紹頁/登入頁不顯示側邊欄 - 未登入的訪客不該看到一堆點了就被彈回登入頁的連結
const isPublicPage = computed(() => route.meta.publicOnly === true)

// 全站搜尋：直接查已載入的訂閱/消費資料，選中結果時才把 query 同步進該頁自己的 searchQuery composable state
const searchQuery = ref('')
const showSearchResults = ref(false)
const subs = useSubscriptionData()
const expenses = useExpenseData()

const searchedSubscriptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []
  return subs.originalItems.value
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.plan.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query),
    )
    .slice(0, 5)
})

const searchedExpenses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []
  return expenses.originalExpenses.value
    .filter(
      (expense) =>
        expense.title.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query),
    )
    .slice(0, 5)
})

const hasSearchResults = computed(
  () => searchedSubscriptions.value.length > 0 || searchedExpenses.value.length > 0,
)

function goToSubscription() {
  subs.searchQuery.value = searchQuery.value
  showSearchResults.value = false
  router.push('/subscriptions')
}

function goToExpense() {
  expenses.searchQuery.value = searchQuery.value
  showSearchResults.value = false
  router.push('/expense-records')
}

function onSearchEnter() {
  if (!searchQuery.value.trim()) return
  if (searchedSubscriptions.value.length >= searchedExpenses.value.length) {
    goToSubscription()
  } else {
    goToExpense()
  }
}
</script>

<template>
  <div v-if="isPublicPage" class="min-h-dvh">
    <header class="border-b border-border">
      <div class="container mx-auto flex h-14 items-center gap-3 px-4">
        <RouterLink to="/" class="text-lg font-extrabold tracking-wide">
          <span class="text-foreground">Money</span
          ><span class="text-primary">Manager</span>
        </RouterLink>
      </div>
    </header>
    <main class="container mx-auto px-4 py-6 md:py-8">
      <ErrorBoundary :key="route.fullPath">
        <RouterView />
      </ErrorBoundary>
    </main>
  </div>

  <div v-else class="flex min-h-dvh">
    <!-- 側邊欄導覽：md 以上固定顯示，md 以下收進頂欄漢堡選單 -->
    <aside
      class="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex"
    >
      <RouterLink to="/dashboard" class="flex items-center gap-2.5 px-2 py-2">
        <span
          class="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
        >
          <Zap class="size-5" aria-hidden="true" />
        </span>
        <span class="flex flex-col leading-tight">
          <span class="text-base font-extrabold tracking-tight text-sidebar-foreground"
            >MoneyManager</span
          >
          <span class="text-xs font-semibold tracking-wide text-muted-foreground"
            >訂閱與消費追蹤</span
          >
        </span>
      </RouterLink>

      <nav class="mt-6 flex flex-1 flex-col gap-1">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            isActive(item.path).value
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
              : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground cursor-pointer',
          ]"
        >
          <component :is="item.icon" class="size-4.5 shrink-0" aria-hidden="true" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <button
        v-if="isAuthenticated"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground cursor-pointer"
        @click="signOut"
      >
        <LogOut class="size-4.5 shrink-0" aria-hidden="true" />
        登出
      </button>
    </aside>

    <div class="flex min-h-dvh flex-1 flex-col">
      <header
        class="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70"
      >
        <div class="flex h-16 items-center gap-3 px-4 md:px-6">
          <!-- 行動版：漢堡選單取代側邊欄 -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="size-11 md:hidden"
                aria-label="開啟選單"
              >
                <Menu class="size-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" class="w-56">
              <DropdownMenuItem v-for="item in navigationItems" :key="item.path" as-child>
                <RouterLink
                  :to="item.path"
                  :class="[
                    'flex items-center gap-2',
                    isActive(item.path).value ? 'text-primary font-medium' : '',
                  ]"
                >
                  <component :is="item.icon" class="size-4" aria-hidden="true" />
                  {{ item.label }}
                </RouterLink>
              </DropdownMenuItem>
              <template v-if="isAuthenticated">
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" @click="signOut">
                  <LogOut class="size-4" aria-hidden="true" />
                  登出
                </DropdownMenuItem>
              </template>
            </DropdownMenuContent>
          </DropdownMenu>

          <div class="relative hidden max-w-sm flex-1 sm:block">
            <Search
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="搜尋訂閱、消費紀錄…"
              aria-label="搜尋訂閱、消費紀錄"
              autocomplete="off"
              class="h-10 w-full rounded-xl border border-input bg-muted/50 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-card"
              @focus="showSearchResults = true"
              @blur="showSearchResults = false"
              @keydown.enter="onSearchEnter"
              @keydown.esc="searchQuery = ''"
            />
            <div
              v-if="showSearchResults && searchQuery.trim()"
              class="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lifted"
            >
              <p v-if="!hasSearchResults" class="px-3 py-2.5 text-sm text-muted-foreground">
                查無「{{ searchQuery }}」的結果
              </p>
              <template v-else>
                <button
                  v-for="item in searchedSubscriptions"
                  :key="`sub-${item.id}`"
                  type="button"
                  class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                  @mousedown.prevent="goToSubscription"
                >
                  <Repeat class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span class="truncate">{{ item.name }}</span>
                  <span class="ml-auto shrink-0 text-xs text-muted-foreground">訂閱</span>
                </button>
                <button
                  v-for="expense in searchedExpenses"
                  :key="`exp-${expense.id}`"
                  type="button"
                  class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                  @mousedown.prevent="goToExpense"
                >
                  <Receipt class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span class="truncate">{{ expense.title }}</span>
                  <span class="ml-auto shrink-0 text-xs text-muted-foreground">消費</span>
                </button>
              </template>
            </div>
          </div>

          <div class="ml-auto flex items-center gap-1">
            <button
              class="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              :aria-label="isDark ? '切換為淺色模式' : '切換為深色模式'"
              @click="toggleDark()"
            >
              <Sun v-if="isDark" class="size-4.5" aria-hidden="true" />
              <Moon v-else class="size-4.5" aria-hidden="true" />
            </button>
            <RouterLink
              to="/notifications"
              class="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="通知"
            >
              <Bell class="size-4.5" aria-hidden="true" />
            </RouterLink>
            <RouterLink
              to="/settings"
              class="hidden size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
              aria-label="說明與設定"
            >
              <HelpCircle class="size-4.5" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>
      </header>

      <main class="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div class="mx-auto max-w-7xl">
          <ErrorBoundary :key="route.fullPath">
            <RouterView />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 頁面樣式盡量以 Tailwind 類別完成，這裡不做客製 */
</style>
