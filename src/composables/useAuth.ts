import { computed } from 'vue'
import { authClient } from '@/lib/auth-client'

const session = authClient.useSession()

export function useAuth() {
  return {
    session: computed(() => session.value.data?.session ?? null),
    user: computed(() => session.value.data?.user ?? null),
    isReady: computed(() => !session.value.isPending),
    isAuthenticated: computed(() => !!session.value.data?.user),

    signInWithGoogle: (redirectPath = '/dashboard') =>
      authClient.signIn.social({ provider: 'google', callbackURL: redirectPath }),

    signOut: () => authClient.signOut(),
  }
}
