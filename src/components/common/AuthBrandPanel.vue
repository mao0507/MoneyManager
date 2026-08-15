<script setup lang="ts">
defineOptions({ name: 'AuthBrandPanel' })
</script>

<template>
  <div
    class="relative hidden overflow-hidden md:flex md:flex-col md:justify-between p-10 lg:p-14"
    style="background: linear-gradient(160deg, #1e8c86, #2ba8a2 65%)"
  >
    <!-- 裝飾用飄浮卡片 - 抽象化呼應 Flip7 卡牌起源，不是字面重現規格書裡的緞帶 Logo -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        class="absolute -left-10 top-16 h-40 w-28 rounded-2xl opacity-70"
        style="background: var(--primary); transform: rotate(-18deg)"
      />
      <div
        class="absolute left-24 top-4 h-40 w-28 rounded-2xl opacity-60"
        style="background: var(--destructive); transform: rotate(8deg)"
      />
      <div
        class="absolute right-[-2rem] top-1/3 h-44 w-32 rounded-2xl opacity-50"
        style="background: #5dade2; transform: rotate(14deg)"
      />
      <div
        class="absolute bottom-16 left-10 h-36 w-24 rounded-2xl opacity-40"
        style="background: #3cc4bd; transform: rotate(-10deg)"
      />
    </div>

    <RouterLink
      to="/"
      class="relative z-10 text-2xl font-extrabold tracking-wide text-white"
      style="font-family: var(--font-display)"
    >
      MoneyManager
    </RouterLink>

    <p class="relative z-10 max-w-xs text-sm leading-relaxed text-white/80">
      <slot>把訂閱與消費看得清清楚楚，一個地方追蹤所有花費。</slot>
    </p>
  </div>
</template>
