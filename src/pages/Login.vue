<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/composables/useAuth'

defineOptions({ name: 'LoginPage' })

const route = useRoute()
const { signInWithGoogle } = useAuth()

const handleGoogleLogin = async () => {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  await signInWithGoogle(redirect)
}
</script>

<template>
  <div class="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-center">登入 MoneyManager</CardTitle>
      </CardHeader>
      <CardContent>
        <Button class="w-full" @click="handleGoogleLogin">用 Google 登入</Button>
      </CardContent>
    </Card>
  </div>
</template>
