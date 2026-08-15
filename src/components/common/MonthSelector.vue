<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDate } from '@/lib/format'

interface Props {
  modelValue?: Date
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placeholder: '選擇月份',
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | undefined]
}>()

defineOptions({ name: 'MonthSelector' })

const isOpen = ref(false)

// 當前選中的月份
const selectedMonth = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 格式化顯示的月份
const displayMonth = computed(() => {
  if (!selectedMonth.value) return props.placeholder
  return formatDate(selectedMonth.value, 'YYYY年MM月')
})

// 處理月份選擇
const handleMonthSelect = (date: Date | undefined) => {
  if (date) {
    // 設置為該月的第一天
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    selectedMonth.value = firstDayOfMonth
  } else {
    selectedMonth.value = undefined
  }
  isOpen.value = false
}

// 快速選擇按鈕
const quickSelectOptions = [
  { label: '本月', getValue: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
  {
    label: '上月',
    getValue: () => {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth() - 1, 1)
    },
  },
  { label: '今年', getValue: () => new Date(new Date().getFullYear(), 0, 1) },
  { label: '清除', getValue: () => undefined },
]

// 生成年份和月份選項
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
const months = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
]

// 選擇年份和月份
const selectedYear = ref(currentYear)
const selectedMonthIndex = ref(new Date().getMonth())

// 當彈出框打開時，初始化選中的年份和月份
const initializeSelection = () => {
  if (selectedMonth.value) {
    selectedYear.value = selectedMonth.value.getFullYear()
    selectedMonthIndex.value = selectedMonth.value.getMonth()
  } else {
    selectedYear.value = currentYear
    selectedMonthIndex.value = new Date().getMonth()
  }
}

// 確認選擇
const confirmSelection = () => {
  const date = new Date(selectedYear.value, selectedMonthIndex.value, 1)
  selectedMonth.value = date
  isOpen.value = false
}
</script>

<template>
  <Popover v-model:open="isOpen" @open-change="(open: boolean) => open && initializeSelection()">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        class="w-full justify-start text-left font-normal bg-card"
        :class="!selectedMonth && 'text-muted-foreground'"
      >
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {{ displayMonth }}
        <svg class="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <div class="p-4 w-80">
        <!-- 快速選擇按鈕 -->
        <div class="grid grid-cols-2 gap-2 mb-4">
          <Button
            v-for="option in quickSelectOptions"
            :key="option.label"
            variant="outline"
            size="sm"
            @click="handleMonthSelect(option.getValue())"
            :class="option.label === '清除' ? 'text-destructive hover:text-destructive' : ''"
          >
            {{ option.label }}
          </Button>
        </div>

        <!-- 年份和月份選擇 -->
        <div class="space-y-4">
          <!-- 年份選擇 -->
          <div>
            <label class="text-sm font-medium mb-2 block">年份</label>
            <div class="grid grid-cols-5 gap-1">
              <Button
                v-for="year in years"
                :key="year"
                variant="outline"
                size="sm"
                :class="selectedYear === year ? 'bg-primary text-primary-foreground' : ''"
                @click="selectedYear = year"
              >
                {{ year }}
              </Button>
            </div>
          </div>

          <!-- 月份選擇 -->
          <div>
            <label class="text-sm font-medium mb-2 block">月份</label>
            <div class="grid grid-cols-3 gap-1">
              <Button
                v-for="(month, index) in months"
                :key="month"
                variant="outline"
                size="sm"
                :class="selectedMonthIndex === index ? 'bg-primary text-primary-foreground' : ''"
                @click="selectedMonthIndex = index"
              >
                {{ month }}
              </Button>
            </div>
          </div>

          <!-- 確認按鈕 -->
          <div class="flex gap-2 pt-2">
            <Button @click="confirmSelection" class="flex-1">確認</Button>
            <Button variant="outline" @click="isOpen = false">取消</Button>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
