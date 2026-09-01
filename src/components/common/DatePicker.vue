<script setup lang="ts">
import { computed } from 'vue'
import { parseDate, type DateValue } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'

interface Props {
  modelValue?: string
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placeholder: '選擇日期',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

defineOptions({ name: 'DatePicker' })

const calendarValue = computed<DateValue | undefined>({
  get: () => (props.modelValue ? parseDate(props.modelValue) : undefined),
  set: (value) => emit('update:modelValue', value ? value.toString() : ''),
})

const displayLabel = computed(() => (props.modelValue ? formatDate(props.modelValue) : props.placeholder))
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        :class="
          cn(
            'w-full justify-start gap-2 text-left font-normal',
            !modelValue && 'text-muted-foreground',
            props.class,
          )
        "
      >
        <CalendarIcon class="size-4 opacity-60" />
        {{ displayLabel }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="calendarValue" />
    </PopoverContent>
  </Popover>
</template>
