<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  text: 'Loading...',
  fullscreen: false,
})

defineOptions({ name: 'LoadingSpinner' })

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center gap-3',
      fullscreen ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50' : 'py-8',
    ]"
  >
    <div
      :class="[
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeClasses[size],
      ]"
    ></div>
    <p v-if="text" class="text-sm text-muted-foreground">{{ text }}</p>
  </div>
</template>
