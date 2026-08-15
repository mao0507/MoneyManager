import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

const session = ref<Session | null>(null)
const user = ref<User | null>(null)
const isReady = ref(false)

supabase.auth
  .getSession()
  .then(({ data }) => {
    session.value = data.session
    user.value = data.session?.user ?? null
  })
  .catch((error) => {
    console.error('取得 session 失敗', error)
  })
  .finally(() => {
    isReady.value = true
  })

supabase.auth.onAuthStateChange((_event, newSession) => {
  session.value = newSession
  user.value = newSession?.user ?? null
})

export function useAuth() {
  return {
    session,
    user,
    isReady,
    isAuthenticated: computed(() => !!user.value),

    signInWithGoogle: (redirectPath = '/dashboard') =>
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}${redirectPath}` },
      }),

    signOut: () => supabase.auth.signOut(),
  }
}
