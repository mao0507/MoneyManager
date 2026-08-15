<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Receipt, Repeat, TrendingUp, Wallet } from 'lucide-vue-next'

defineOptions({ name: 'LandingPage' })

// 三小一大的 bento 排列 - 「正確總額」是核心價值主張，給它最大的版位
const features = [
  {
    icon: TrendingUp,
    title: '正確的月/年總額',
    detail: 'TWD/USD 混合、月繳年繳並存，一次算清楚，不用自己拿計算機湊。',
    span: 'sm:col-span-2',
  },
  { icon: Repeat, title: '訂閱管理', detail: '月繳/年繳都算得對' },
  { icon: Receipt, title: '消費紀錄', detail: '日常花費一筆一筆記' },
  { icon: Wallet, title: '單一帳號', detail: 'Google 登入，資料只屬於你' },
]
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-16 sm:py-20">
    <div class="mx-auto max-w-2xl text-center">
      <h1
        class="text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl"
        style="font-family: var(--font-display)"
      >
        把訂閱與消費<br />看得清清楚楚
      </h1>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
        一個地方追蹤所有訂閱與日常消費，正確算出每月、每年的實際花費。
      </p>

      <Button
        as-child
        size="lg"
        class="mt-8 h-14 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-[var(--shadow-cta-glow)] hover:bg-primary/90"
      >
        <RouterLink to="/login" class="group">
          開始使用
          <ArrowRight
            class="size-5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </RouterLink>
      </Button>
    </div>

    <!-- Bento feature grid -->
    <div class="mt-16 grid gap-4 sm:grid-cols-2">
      <div
        v-for="item in features"
        :key="item.title"
        :class="item.span"
        class="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-transform duration-200 hover:scale-[1.02]"
      >
        <div
          class="flex size-11 items-center justify-center rounded-xl bg-accent text-primary"
        >
          <component :is="item.icon" class="size-5" aria-hidden="true" />
        </div>
        <p
          class="mt-4 text-lg font-semibold text-foreground"
          style="font-family: var(--font-display)"
        >
          {{ item.title }}
        </p>
        <p class="mt-1 text-sm text-muted-foreground">{{ item.detail }}</p>
      </div>
    </div>
  </div>
</template>
