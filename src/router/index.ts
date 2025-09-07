import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { RouteMeta } from '@/types'

// 擴展路由元數據類型
declare module 'vue-router' {
  interface RouteMeta extends RouteMeta {}
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      description: 'Overview of your subscription management',
      icon: '📊',
    },
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: () => import('@/pages/Subscriptions.vue'),
    meta: {
      title: 'Subscriptions',
      description: 'Manage all your subscription services',
      icon: '📋',
    },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/pages/Reports.vue'),
    meta: {
      title: 'Reports',
      description: 'Detailed analysis of your subscription spending',
      icon: '📈',
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/Notifications.vue'),
    meta: {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: '🔔',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/Settings.vue'),
    meta: {
      title: 'Settings',
      description: 'Configure your application preferences',
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

export default router
