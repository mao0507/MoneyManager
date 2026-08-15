<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Receipt, Repeat, TrendingUp } from 'lucide-vue-next'

defineOptions({ name: 'LandingPage' })

const capabilities = [
  { icon: Repeat, text: '訂閱管理 - 月繳/年繳、TWD/USD 混合都算得對' },
  { icon: Receipt, text: '消費紀錄 - 日常花費一筆一筆記下來' },
  { icon: TrendingUp, text: '正確的月/年總額 - 不用自己拿計算機湊' },
]
</script>

<template>
  <div class="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4">
    <div class="w-full max-w-lg text-center">
      <h1 class="text-4xl font-bold tracking-tight text-foreground">
        把訂閱與消費<br class="sm:hidden" />看得清清楚楚
      </h1>
      <p class="mt-4 text-base text-muted-foreground">
        一個地方追蹤所有訂閱與日常消費，正確算出每月、每年的實際花費。
      </p>

      <Button as-child size="lg" class="mt-8">
        <RouterLink to="/login">開始使用</RouterLink>
      </Button>

      <div class="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        <div
          v-for="item in capabilities"
          :key="item.text"
          class="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <component :is="item.icon" class="size-4 shrink-0" aria-hidden="true" />
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
