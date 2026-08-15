<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-5 rounded-lg border py-5 shadow-[var(--shadow-card)]',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

<style scoped>
/* 進場一次性彈入 + 錯落延遲 - 頁面第一眼統一動效，不是零散的逐一 hover 特效 */
[data-slot='card'] {
  animation: card-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}
[data-slot='card']:nth-of-type(1) {
  animation-delay: 0ms;
}
[data-slot='card']:nth-of-type(2) {
  animation-delay: 60ms;
}
[data-slot='card']:nth-of-type(3) {
  animation-delay: 120ms;
}
[data-slot='card']:nth-of-type(4) {
  animation-delay: 180ms;
}
[data-slot='card']:nth-of-type(n + 5) {
  animation-delay: 220ms;
}

@keyframes card-pop {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='card'] {
    animation: none;
  }
}
</style>
