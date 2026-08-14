<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, LayoutDashboard, Receipt, Repeat, Settings, TrendingUp } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { isAuthenticated, signOut } = useAuth()

// 導航配置
const navigationItems = [
  { path: '/', label: '儀表板', icon: LayoutDashboard },
  { path: '/subscriptions', label: '訂閱管理', icon: Repeat },
  { path: '/expense-records', label: '消費紀錄', icon: Receipt },
  { path: '/reports', label: '支出報表', icon: TrendingUp },
  { path: '/notifications', label: '通知設定', icon: Bell },
  { path: '/settings', label: '設定', icon: Settings },
] as const

// 檢查路由是否為當前活躍狀態
const isActive = (path: string) => computed(() => route.path === path)
</script>

<template>
  <div class="min-h-dvh">
    <header class="border-b">
      <div class="container mx-auto px-4 h-14 flex items-center gap-3">
        <span class="font-semibold">MoneyManager</span>
        <nav class="ml-auto flex items-center gap-2 text-sm">
          <RouterLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'px-2 py-1 rounded-md transition-colors flex items-center gap-1',
              isActive(item.path).value ? 'bg-secondary' : 'hover:bg-secondary cursor-pointer',
            ]"
          >
            <component :is="item.icon" class="size-4" aria-hidden="true" />
            {{ item.label }}
          </RouterLink>
          <button
            v-if="isAuthenticated"
            class="px-2 py-1 rounded-md hover:bg-secondary cursor-pointer"
            @click="signOut"
          >
            登出
          </button>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 md:py-8">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* 頁面樣式盡量以 Tailwind 類別完成，這裡不做客製 */
</style>
