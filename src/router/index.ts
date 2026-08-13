import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { supabase } from '@/lib/supabase'

// 擴展路由元數據類型
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description?: string
    icon?: string
    requiresAuth?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: {
      title: '儀表板',
      description: '訂閱費用和活動概覽',
      icon: '📊',
    },
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: () => import('@/pages/Subscriptions.vue'),
    meta: {
      title: '訂閱管理',
      description: '管理所有訂閱服務',
      icon: '📋',
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
    meta: {
      title: '登入',
    },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/pages/Reports.vue'),
    meta: {
      title: '支出報表',
      description: '訂閱支出的詳細分析',
      icon: '📈',
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/Notifications.vue'),
    meta: {
      title: '通知設定',
      description: '管理通知偏好設定',
      icon: '🔔',
    },
  },
  {
    path: '/expense-records',
    name: 'expense-records',
    component: () => import('@/pages/ExpenseRecords.vue'),
    meta: {
      title: '消費紀錄',
      description: '管理日常消費紀錄和支出分析',
      icon: '💰',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/Settings.vue'),
    meta: {
      title: '設定',
      description: '配置應用程式偏好設定',
      icon: '⚙️',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
