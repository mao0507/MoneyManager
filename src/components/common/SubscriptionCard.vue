<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  name: string
  plan: string
  price: string
  cycle: 'Monthly' | 'Yearly'
  active?: boolean
  nextPayment?: string
  paymentMethod?: string
  renewal: 'Automatic' | 'Manual'
  category?: string
}

const props = defineProps<Props>()
defineOptions({ name: 'SubscriptionCard' })

// 獲取服務圖示
const getServiceIcon = (name: string) => {
  const icons: Record<string, string> = {
    Spotify: '🎵',
    YouTube: '📺',
    Netflix: '🎬',
    'VPS-HK': '🖥️',
    阿里雲: '☁️',
    Monica: '🤖',
    Cursor: '💻',
  }
  return icons[name] || '📱'
}

// 獲取類別顏色
const getCategoryColor = (category?: string) => {
  const colors: Record<string, string> = {
    音樂串流: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    影片串流: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    生產力工具: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    VPS服務: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    域名服務: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    軟體工具: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  }
  return (
    colors[category || ''] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  )
}
</script>

<template>
  <Card
    class="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
  >
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between">
        <!-- 服務資訊 -->
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
            {{ getServiceIcon(props.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-foreground truncate">{{ props.name }}</h3>
            <p class="text-sm text-muted-foreground truncate">{{ props.plan }}</p>
            <div v-if="props.category" class="mt-1">
              <Badge :class="getCategoryColor(props.category)" variant="secondary" class="text-xs">
                {{ props.category }}
              </Badge>
            </div>
          </div>
        </div>

        <!-- 狀態和操作 -->
        <div class="flex items-center gap-2">
          <!-- 狀態標籤 -->
          <div class="flex flex-col gap-1">
            <Badge
              :variant="props.active ? 'default' : 'secondary'"
              class="text-xs w-16 justify-center"
            >
              <div v-if="props.active" class="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></div>
              {{ props.active ? '啟用' : '停用' }}
            </Badge>
            <Badge
              :variant="props.cycle === 'Monthly' ? 'secondary' : 'outline'"
              class="text-xs w-16 justify-center"
            >
              {{ props.cycle === 'Monthly' ? '月費' : '年費' }}
            </Badge>
          </div>

          <!-- 操作選單 -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8 opacity-60 hover:opacity-100 hover:bg-muted transition-all duration-200"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuItem>
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem>
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                查看詳情
              </DropdownMenuItem>
              <DropdownMenuItem>
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                匯出
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="text-destructive">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                取消訂閱
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>

    <CardContent class="pt-0">
      <!-- 價格 -->
      <div class="mb-4">
        <div class="text-2xl font-bold text-foreground">{{ props.price }}</div>
        <p class="text-sm text-muted-foreground">
          {{ props.cycle === 'Monthly' ? '每月' : '每年' }}
        </p>
      </div>

      <Separator class="mb-4" />

      <!-- 詳細資訊 -->
      <div class="space-y-3">
        <div v-if="props.nextPayment" class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">下次付款</span>
          <span class="text-sm font-medium text-foreground">{{ props.nextPayment }}</span>
        </div>
        <div v-if="props.paymentMethod" class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">付款方式</span>
          <span class="text-sm font-medium text-foreground">{{ props.paymentMethod }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">續費</span>
          <Badge :variant="props.renewal === 'Automatic' ? 'default' : 'secondary'" class="text-xs">
            {{ props.renewal === 'Automatic' ? '自動' : '手動' }}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
