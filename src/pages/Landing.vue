<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Receipt, Repeat, TrendingUp } from 'lucide-vue-next'
import AuthBrandPanel from '@/components/common/AuthBrandPanel.vue'

defineOptions({ name: 'LandingPage' })

const capabilities = [
  { icon: Repeat, text: '訂閱管理', detail: '月繳/年繳、TWD/USD 混合都算得對' },
  { icon: Receipt, text: '消費紀錄', detail: '日常花費一筆一筆記下來' },
  { icon: TrendingUp, text: '正確總額', detail: '月/年實際花費，不用自己拿計算機湊' },
]
</script>

<template>
  <div
    class="grid overflow-hidden rounded-3xl border md:min-h-[calc(100dvh-3.5rem-3rem)] md:grid-cols-2"
    style="box-shadow: var(--shadow-lifted)"
  >
    <AuthBrandPanel>
      追蹤所有訂閱與日常消費，正確算出每月、每年的實際花費——不用自己拿計算機湊。
    </AuthBrandPanel>

    <div class="flex flex-col justify-center bg-card px-8 py-14 sm:px-12 lg:px-16">
      <h1
        class="text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground lg:text-5xl"
        style="font-family: var(--font-display); text-shadow: var(--title-glow)"
      >
        把訂閱與消費<br />看得清清楚楚
      </h1>
      <p class="mt-5 max-w-md text-base text-muted-foreground">
        一個地方追蹤所有訂閱與日常消費，正確算出每月、每年的實際花費。
      </p>

      <Button as-child size="lg" class="mt-8 w-fit">
        <RouterLink to="/login">開始使用</RouterLink>
      </Button>

      <div class="mt-12 grid gap-5 sm:grid-cols-3">
        <div v-for="item in capabilities" :key="item.text" class="flex items-start gap-3">
          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-lg"
            style="background: var(--secondary); color: var(--ring)"
          >
            <component :is="item.icon" class="size-4" aria-hidden="true" />
          </div>
          <div>
            <p class="text-sm font-semibold text-foreground">{{ item.text }}</p>
            <p class="text-xs text-muted-foreground">{{ item.detail }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
