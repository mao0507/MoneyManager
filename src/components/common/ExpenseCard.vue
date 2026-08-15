<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Banknote,
  BookOpen,
  Car,
  Clapperboard,
  CreditCard,
  HeartPulse,
  Home,
  Package,
  ShoppingBag,
  Smartphone,
  Utensils,
  Wallet,
} from 'lucide-vue-next'
import type { ExpenseRecord } from '@/types'
import { formatCurrency, formatDate } from '@/lib/format'
import { getCategoryColorStyle } from '@/lib/category-colors'

interface Props {
  expense: ExpenseRecord
}

const props = defineProps<Props>()
const emit = defineEmits<{ edit: []; delete: [] }>()
defineOptions({ name: 'ExpenseCard' })

// 獲取類別圖示和顏色
const getCategoryIcon = (category: string) => {
  const icons: Record<string, typeof Package> = {
    餐飲: Utensils,
    交通: Car,
    購物: ShoppingBag,
    娛樂: Clapperboard,
    醫療: HeartPulse,
    教育: BookOpen,
    生活用品: Home,
    其他: Package,
  }
  return icons[category] || Package
}

const getPaymentMethodIcon = (method: string) => {
  const icons: Record<string, typeof CreditCard> = {
    信用卡: CreditCard,
    現金: Banknote,
    'Apple Pay': Smartphone,
    悠遊卡: Wallet,
    'Google Pay': Smartphone,
    'Line Pay': Wallet,
  }
  return icons[method] || CreditCard
}
</script>

<template>
  <Card
    class="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
  >
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :style="getCategoryColorStyle(props.expense.category)"
          >
            <component :is="getCategoryIcon(props.expense.category)" class="size-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle class="text-lg">{{ props.expense.title }}</CardTitle>
            <p v-if="props.expense.description" class="text-sm text-muted-foreground">
              {{ props.expense.description }}
            </p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-1">
          <Badge
            variant="outline"
            :style="getCategoryColorStyle(props.expense.category)"
            class="text-xs border-transparent"
          >
            {{ props.expense.category }}
          </Badge>
          <div class="flex items-center gap-1 text-xs text-muted-foreground">
            <component :is="getPaymentMethodIcon(props.expense.paymentMethod)" class="size-3" aria-hidden="true" />
            <span>{{ props.expense.paymentMethod }}</span>
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <div class="flex items-end justify-between">
        <div class="text-3xl font-bold text-foreground">
          {{ formatCurrency(props.expense.amount) }}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
          <DropdownMenuContent align="end">
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
            <DropdownMenuItem class="text-destructive" @click="emit('delete')">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              刪除紀錄
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator />

      <div class="space-y-3 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">消費日期</span>
          <span class="font-medium">{{ formatDate(props.expense.date) }}</span>
        </div>
        <div
          v-if="props.expense.tags && props.expense.tags.length > 0"
          class="flex items-center justify-between"
        >
          <span class="text-muted-foreground">標籤</span>
          <div class="flex gap-1">
            <Badge v-for="tag in props.expense.tags" :key="tag" variant="secondary" class="text-xs">
              {{ tag }}
            </Badge>
          </div>
        </div>
        <div v-if="props.expense.subscriptionId" class="flex items-center justify-between">
          <span class="text-muted-foreground">關聯訂閱</span>
          <Badge variant="outline" class="text-xs"> 訂閱相關 </Badge>
        </div>
      </div>

      <div class="flex gap-2 pt-4 border-t border-border/30">
        <Button variant="outline" size="sm" class="flex-1" @click="emit('edit')">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          編輯
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label="刪除紀錄"
          class="text-destructive hover:bg-destructive/10 hover:text-destructive"
          @click="emit('delete')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
