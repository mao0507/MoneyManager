<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { NewSubscriptionInput, SubscriptionItem } from '@/types'

interface Props {
  isOpen: boolean
  editItem?: SubscriptionItem | null
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  editItem: null,
  error: null,
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  submit: [data: NewSubscriptionInput]
}>()

defineOptions({ name: 'AddSubscriptionDialog' })

const emptyForm = (): NewSubscriptionInput => ({
  name: '',
  plan: '',
  amount: 0,
  currency: 'TWD',
  cycle: 'Monthly',
  category: '',
  paymentMethod: '',
  renewal: 'Automatic',
  startDate: '',
})

const formData = ref<NewSubscriptionInput>(emptyForm())

// 監聽 isOpen 而非 editItem 本身 - 同一筆訂閱物件參照沒變時（連續兩次點編輯同一筆）
// 監聽 editItem 不會觸發，畫面會留著上次 resetForm() 後的空表單
watch(
  () => props.isOpen,
  (open) => {
    if (!open) return
    const item = props.editItem
    formData.value = item
      ? {
          name: item.name,
          plan: item.plan,
          amount: item.amount,
          currency: item.currency,
          cycle: item.cycle,
          category: item.category ?? '',
          paymentMethod: item.paymentMethod,
          renewal: item.renewal,
          startDate: item.startDate,
        }
      : emptyForm()
  },
  { immediate: true },
)

const isFormValid = () =>
  !!formData.value.name && formData.value.amount > 0 && !!formData.value.startDate

// 表單只送出資料，開關與重置交給父層 - 送出失敗時 dialog 才能留著不關
const handleSubmit = () => {
  if (!isFormValid()) return
  emit('submit', { ...formData.value })
}

const handleCancel = () => {
  emit('update:isOpen', false)
}

const categories = ['音樂串流', '影片串流', '生產力工具', 'VPS服務', '域名服務', '軟體工具', '其他']

const paymentMethods = [
  '信用卡',
  'Apple Pay',
  'Google Pay',
  'PayPal',
  'Alipay',
  'Wechat Pay',
  '銀行轉帳',
  '其他',
]
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
    <Card class="border-0 shadow-none">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg">{{ editItem ? '編輯訂閱服務' : '新增訂閱服務' }}</CardTitle>
        <CardDescription>請填寫訂閱服務的詳細資訊</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">服務名稱 *</label>
          <Input v-model="formData.name" placeholder="例如：Netflix、Spotify" class="w-full" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">方案名稱</label>
          <Input v-model="formData.plan" placeholder="例如：Premium、Family" class="w-full" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">金額 *</label>
            <Input v-model.number="formData.amount" type="number" min="0" step="0.01" class="w-full" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">幣別</label>
            <Select v-model="formData.currency">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TWD">TWD</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">計費週期</label>
          <Select v-model="formData.cycle">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">月費</SelectItem>
              <SelectItem value="Yearly">年費</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">類別</label>
          <Select v-model="formData.category">
            <SelectTrigger>
              <SelectValue placeholder="選擇類別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">付款方式</label>
          <Select v-model="formData.paymentMethod">
            <SelectTrigger>
              <SelectValue placeholder="選擇付款方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="method in paymentMethods" :key="method" :value="method">
                {{ method }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">續費方式</label>
          <Select v-model="formData.renewal">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">自動</SelectItem>
              <SelectItem value="Manual">手動</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">開始日期 *</label>
          <Input v-model="formData.startDate" type="date" class="w-full" />
          <p class="text-xs text-muted-foreground">下次扣款日會依開始日期與週期自動計算</p>
        </div>

        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

        <div class="flex gap-2 pt-4">
          <Button @click="handleSubmit" class="flex-1" :disabled="!isFormValid()">
            {{ editItem ? '儲存變更' : '新增訂閱' }}
          </Button>
          <Button variant="outline" @click="handleCancel" class="flex-1"> 取消 </Button>
        </div>
      </CardContent>
    </Card>
  </Dialog>
</template>
