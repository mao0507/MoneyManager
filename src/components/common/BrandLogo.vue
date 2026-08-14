<script setup lang="ts">
import type { BrandIcon } from '@/lib/brand-icons'

defineProps<{ icon: BrandIcon }>()
defineOptions({ name: 'BrandLogo' })
</script>

<template>
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true" :fill="`#${icon.hex}`">
    <title>{{ icon.title }}</title>
    <path :d="icon.path" />
  </svg>
</template>
