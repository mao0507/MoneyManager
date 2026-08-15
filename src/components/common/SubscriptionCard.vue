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
import { computed } from 'vue'
import { Bot, Server, Smartphone } from 'lucide-vue-next'
import { formatCurrency } from '@/lib/format'
import { findBrandIcon } from '@/lib/brand-icons'
import { getCategoryColorStyle } from '@/lib/category-colors'
import BrandLogo from './BrandLogo.vue'

interface Props {
  name: string
  plan: string
  amount: number
  currency: 'TWD' | 'USD'
  cycle: 'Monthly' | 'Yearly'
  active?: boolean
  nextPayment?: string
  paymentMethod?: string
  renewal: 'Automatic' | 'Manual'
  category?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: []
  delete: []
}>()
defineOptions({ name: 'SubscriptionCard' })

const currencySymbol = (currency: 'TWD' | 'USD') => (currency === 'USD' ? 'US$' : 'NT$')

// 官方品牌 logo 找不到時的通用圖示（非知名品牌 / simple-icons 未收錄的服務）
const fallbackServiceIcon = (name: string) => {
  const icons: Record<string, typeof Smartphone> = {
    'VPS-HK': Server,
    Monica: Bot,
  }
  return icons[name] || Smartphone
}

const brandIcon = computed(() => findBrandIcon(props.name))
</script>

<template>
  <Card
    class="group relative overflow-hidden transition-all duration-200 hover:shadow-raised hover:-translate-y-0.5"
  >
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between">
        <!-- 服務資訊 -->
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <BrandLogo v-if="brandIcon" :icon="brandIcon" class="size-6" />
            <component v-else :is="fallbackServiceIcon(props.name)" class="size-6" aria-hidden="true" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-foreground truncate">{{ props.name }}</h3>
            <p class="text-sm text-muted-foreground truncate">{{ props.plan }}</p>
            <div v-if="props.category" class="mt-1">
              <Badge
                variant="outline"
                :style="getCategoryColorStyle(props.category)"
                class="text-xs border-transparent"
              >
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
              :variant="props.active ? 'outline' : 'secondary'"
              :class="props.active ? 'text-success border-success/30' : ''"
              class="text-xs w-16 justify-center"
            >
              <div v-if="props.active" class="mr-1 h-1.5 w-1.5 rounded-full bg-success"></div>
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
              <DropdownMenuItem @click="emit('edit')">
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
              <DropdownMenuSeparator />
              <DropdownMenuItem class="text-destructive" @click="emit('delete')">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                刪除訂閱
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>

    <CardContent class="pt-0">
      <!-- 價格 -->
      <div class="mb-4">
        <div class="text-2xl font-bold text-foreground">
          {{ formatCurrency(props.amount, currencySymbol(props.currency)) }}
        </div>
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
          <Badge
            :variant="props.renewal === 'Automatic' ? 'outline' : 'secondary'"
            :class="props.renewal === 'Automatic' ? 'text-success border-success/30' : ''"
            class="text-xs"
          >
            {{ props.renewal === 'Automatic' ? '自動' : '手動' }}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
