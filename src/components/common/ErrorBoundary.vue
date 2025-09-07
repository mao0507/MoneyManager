<script setup lang="ts">
import { ref, onErrorCaptured, type Component } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  fallback?: Component
  onError?: (error: Error, instance: any, info: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: undefined,
  onError: undefined,
})

const hasError = ref(false)
const error = ref<Error | null>(null)

onErrorCaptured((err: Error, instance: any, info: string) => {
  hasError.value = true
  error.value = err

  // 調用自定義錯誤處理函數
  if (props.onError) {
    props.onError(err, instance, info)
  }

  // 阻止錯誤繼續傳播
  return false
})

const resetError = () => {
  hasError.value = false
  error.value = null
}
</script>

<template>
  <div>
    <div v-if="hasError" class="min-h-[400px] flex items-center justify-center p-4">
      <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <div
            class="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <CardTitle class="text-destructive">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try refreshing the page or contact support if the
            problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="error" class="p-3 bg-muted rounded-md">
            <p class="text-sm font-mono text-muted-foreground">
              {{ error.message }}
            </p>
          </div>
          <div class="flex gap-2 justify-center">
            <Button @click="resetError" variant="outline"> Try Again </Button>
            <Button @click="() => window.location.reload()"> Refresh Page </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>
