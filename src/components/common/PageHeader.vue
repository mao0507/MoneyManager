<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
defineOptions({ name: 'PageHeader' })
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1
        class="text-3xl font-extrabold tracking-tight"
        style="font-family: var(--font-display); text-shadow: var(--title-glow)"
      >
        {{ title }}
      </h1>
      <p v-if="description" class="text-muted-foreground mt-1">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>
