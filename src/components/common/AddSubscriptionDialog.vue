<script setup lang="ts">
import { ref } from 'vue'
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

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'add-subscription': [data: any]
}>()

defineOptions({ name: 'AddSubscriptionDialog' })

// 表單數據
const formData = ref({
  name: '',
  plan: '',
  price: '',
  cycle: 'Monthly' as 'Monthly' | 'Yearly',
  category: '',
  paymentMethod: '',
  renewal: 'Automatic' as 'Automatic' | 'Manual',
  nextPayment: '',
})

// 重置表單
const resetForm = () => {
  formData.value = {
    name: '',
    plan: '',
    price: '',
    cycle: 'Monthly',
    category: '',
    paymentMethod: '',
    renewal: 'Automatic',
    nextPayment: '',
  }
}

// 提交表單
const handleSubmit = () => {
  if (!formData.value.name || !formData.value.price) {
    return
  }

  emit('add-subscription', { ...formData.value })
  resetForm()
  emit('update:isOpen', false)
}

// 取消
const handleCancel = () => {
  resetForm()
  emit('update:isOpen', false)
}

// 類別選項
const categories = ['音樂串流', '影片串流', '生產力工具', 'VPS服務', '域名服務', '軟體工具', '其他']

// 付款方式選項
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
        <CardTitle class="text-lg">新增訂閱服務</CardTitle>
        <CardDescription>請填寫訂閱服務的詳細資訊</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- 服務名稱 -->
        <div class="space-y-2">
          <label class="text-sm font-medium">服務名稱 *</label>
          <Input v-model="formData.name" placeholder="例如：Netflix、Spotify" class="w-full" />
        </div>

        <!-- 方案名稱 -->
        <div class="space-y-2">
          <label class="text-sm font-medium">方案名稱</label>
          <Input v-model="formData.plan" placeholder="例如：Premium、Family" class="w-full" />
        </div>

        <!-- 價格和週期 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">價格 *</label>
            <Input v-model="formData.price" placeholder="NT$" class="w-full" />
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
        </div>

        <!-- 類別 -->
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

        <!-- 付款方式 -->
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

        <!-- 續費方式 -->
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

        <!-- 下次付款日期 -->
        <div class="space-y-2">
          <label class="text-sm font-medium">下次付款日期</label>
          <Input v-model="formData.nextPayment" placeholder="例如：2025年2月15日" class="w-full" />
        </div>

        <!-- 操作按鈕 -->
        <div class="flex gap-2 pt-4">
          <Button
            @click="handleSubmit"
            class="flex-1"
            :disabled="!formData.name || !formData.price"
          >
            新增訂閱
          </Button>
          <Button variant="outline" @click="handleCancel" class="flex-1"> 取消 </Button>
        </div>
      </CardContent>
    </Card>
  </Dialog>
</template>
