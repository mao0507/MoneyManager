import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authClient } from '@/lib/auth-client'

// 擴展路由元數據類型
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description?: string
    requiresAuth?: boolean
    // 公開頁面（介紹頁、登入頁）- 已登入的使用者不該停留在這裡，導去 dashboard
    publicOnly?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/pages/Landing.vue'),
    meta: {
      title: 'MoneyManager',
      description: '訂閱與消費管理系統',
      publicOnly: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: {
      title: '儀表板',
      description: '訂閱費用和活動概覽',
      requiresAuth: true,
    },
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: () => import('@/pages/Subscriptions.vue'),
    meta: {
      title: '訂閱管理',
      description: '管理所有訂閱服務',
      requiresAuth: true,
    },
  },
  {
    // Landing 頁已經合併登入功能，/login 留重導向給舊書籤/連結用
    path: '/login',
    redirect: (to) => ({ path: '/', query: to.query }),
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/pages/Reports.vue'),
    meta: {
      title: '支出報表',
      description: '訂閱支出的詳細分析',
      requiresAuth: true,
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/Notifications.vue'),
    meta: {
      title: '通知設定',
      description: '管理通知偏好設定',
      requiresAuth: true,
    },
  },
  {
    path: '/expense-records',
    name: 'expense-records',
    component: () => import('@/pages/ExpenseRecords.vue'),
    meta: {
      title: '消費紀錄',
      description: '管理日常消費紀錄和支出分析',
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/Settings.vue'),
    meta: {
      title: '設定',
      description: '配置應用程式偏好設定',
      requiresAuth: true,
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
  if (!to.meta.requiresAuth && !to.meta.publicOnly) return true

  const { data: session } = await authClient.getSession()

  if (to.meta.requiresAuth && !session) {
    return { name: 'landing', query: { redirect: to.fullPath } }
  }

  // 已登入的使用者不該停留在介紹頁/登入頁，直接進 dashboard
  if (to.meta.publicOnly && session) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
