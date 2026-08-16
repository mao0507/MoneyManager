<!--
THESIS: 不用行銷詞彙說服訪客，直接讓他們看見自己的錢被鎖住——一張跟 Dashboard 一模一樣的 KPI 卡，數字打碼，登入才解鎖。
OWN-WORLD: WattVision 既有語言，原封不動——靛藍 primary、白卡片、icon 方塊、JetBrains Mono 數字、Badge、`--shadow-card`/`--shadow-cta-glow`。這次修正版直接借 Dashboard 的 KPI 卡當 hero，不再發明介紹頁專屬元件。
STORY: 訪客先看到「本月支出」KPI 卡，數字是遮碼的 NT$••,•••，一眼就懂這是「你的」數字，只是還沒登入看不到；Google 登入鈕就在卡片裡，不用先互動才發現要登入。
FIRST VIEWPORT: 標題一行 + 單一大 KPI 卡（icon 方塊 + 遮碼數字 + 登入鈕），跟 Dashboard 首列 KPI 卡同一套結構語言；下方維持三小一大 bento 功能簡介。
FORM: 使用者明確回饋「互動不直覺、太平淡、跟系統不一致」後的修正 — 拿掉 command-palette 搜尋互動，改直接借用已存在的 Dashboard KPI 卡語言，不再另骰新結構。
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md.
-->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { EyeOff, Receipt, Repeat, TrendingUp, Wallet } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

defineOptions({ name: 'LandingPage' })

const route = useRoute()
const { signInWithGoogle } = useAuth()

const handleGoogleLogin = async () => {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  await signInWithGoogle(redirect)
}

// 三小一大的 bento 排列 - 「正確總額」是核心價值主張，給它最大的版位
const features = [
  {
    icon: TrendingUp,
    title: '正確的月/年總額',
    detail: 'TWD/USD 混合、月繳年繳並存，一次算清楚，不用自己拿計算機湊。',
  },
  { icon: Repeat, title: '訂閱管理', detail: '月繳/年繳都算得對' },
  { icon: Receipt, title: '消費紀錄', detail: '日常花費一筆一筆記' },
  { icon: Wallet, title: '單一帳號', detail: 'Google 登入，資料只屬於你' },
]
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-16 sm:py-20">
    <div class="mx-auto max-w-sm text-center">
      <h1
        class="text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl"
        style="font-family: var(--font-display)"
      >
        把訂閱與消費<br />看得清清楚楚
      </h1>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
        一個地方追蹤所有訂閱與日常消費，正確算出每月、每年的實際花費。
      </p>

      <!-- KPI 卡 hero - 跟 Dashboard.vue 首列 KPI 卡同一套結構語言（icon 方塊 + 大數字 + 標籤），
           數字遮碼代表「這是你的真實數字，登入才看得到」，不是另外發明一套介紹頁專屬元件 -->
      <div
        class="mt-9 rounded-2xl border border-border bg-card p-6 text-left shadow-[var(--shadow-card)]"
      >
        <div class="flex items-start justify-between">
          <span
            class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <Wallet class="size-5" aria-hidden="true" />
          </span>
          <span
            class="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          >
            <EyeOff class="size-3" aria-hidden="true" />
            登入後解鎖
          </span>
        </div>
        <div
          class="landing-masked-amount mt-4 text-3xl font-bold tracking-tight text-foreground"
          style="font-family: var(--font-display)"
          aria-hidden="true"
        >
          NT$••,•••
        </div>
        <p class="mt-1 text-sm text-muted-foreground">本月支出（登入查看你的真實數字）</p>

        <button
          type="button"
          class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-cta-glow)] transition-colors hover:bg-primary/90"
          @click="handleGoogleLogin"
        >
          <svg class="size-4 rounded-full bg-white p-0.5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          用 Google 登入
        </button>
      </div>
    </div>

    <!-- 功能簡介 - 2x2 排列，四格同等重量，不再有一大三小的斷版 -->
    <div class="mt-16 grid gap-4 sm:grid-cols-2">
      <div
        v-for="item in features"
        :key="item.title"
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

<style scoped>
/* 遮碼數字的點號緩慢明滅，暗示「這裡有東西」但不是干擾性的閃爍 */
.landing-masked-amount {
  animation: landing-mask-breathe 2.4s ease-in-out infinite;
}

@keyframes landing-mask-breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing-masked-amount {
    animation: none;
  }
}
</style>
