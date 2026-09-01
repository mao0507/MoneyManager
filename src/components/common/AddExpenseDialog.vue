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
import DatePicker from '@/components/common/DatePicker.vue'
import type { ExpenseCategory, ExpenseRecord } from '@/types'

type NewExpenseInput = Omit<ExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>

interface Props {
  isOpen: boolean
  categories: ExpenseCategory[]
  editItem?: ExpenseRecord | null
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  editItem: null,
  error: null,
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  submit: [data: NewExpenseInput]
}>()

defineOptions({ name: 'AddExpenseDialog' })

const emptyForm = (): NewExpenseInput => ({
  title: '',
  description: '',
  amount: 0,
  category: '',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: '',
  tags: [],
})

const formData = ref<NewExpenseInput>(emptyForm())

// 監聽 isOpen 而非 editItem 本身 - 同一筆消費物件參照沒變時（連續兩次點編輯同一筆）
// 監聽 editItem 不會觸發，畫面會留著上次 resetForm() 後的空表單
watch(
  () => props.isOpen,
  (open) => {
    if (!open) return
    const item = props.editItem
    formData.value = item
      ? {
          title: item.title,
          description: item.description ?? '',
          amount: item.amount,
          category: item.category,
          date: item.date,
          paymentMethod: item.paymentMethod,
          tags: item.tags ?? [],
        }
      : emptyForm()
  },
  { immediate: true },
)

const isFormValid = () =>
  !!formData.value.title &&
  formData.value.amount > 0 &&
  !!formData.value.category &&
  !!formData.value.date &&
  !!formData.value.paymentMethod

const handleSubmit = () => {
  if (!isFormValid()) return
  emit('submit', { ...formData.value })
}

const handleCancel = () => {
  emit('update:isOpen', false)
}

const paymentMethods = ['信用卡', 'Apple Pay', 'Google Pay', 'LINE Pay', '悠遊卡', '現金', '其他']
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
    <Card class="border-0 shadow-none">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg">{{ editItem ? '編輯消費' : '新增消費' }}</CardTitle>
        <CardDescription>請填寫消費紀錄的詳細資訊</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">項目名稱 *</label>
          <Input v-model="formData.title" placeholder="例如：午餐、Uber 車費" class="w-full" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">備註</label>
          <Input v-model="formData.description" placeholder="選填" class="w-full" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">金額 *</label>
            <Input v-model.number="formData.amount" type="number" min="0" step="0.01" class="w-full" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">日期 *</label>
            <DatePicker v-model="formData.date" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">類別 *</label>
          <Select v-model="formData.category">
            <SelectTrigger>
              <SelectValue placeholder="選擇類別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">付款方式 *</label>
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

        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

        <div class="flex gap-2 pt-4">
          <Button @click="handleSubmit" class="flex-1" :disabled="!isFormValid()">
            {{ editItem ? '儲存變更' : '新增消費' }}
          </Button>
          <Button variant="outline" @click="handleCancel" class="flex-1"> 取消 </Button>
        </div>
      </CardContent>
    </Card>
  </Dialog>
</template>
