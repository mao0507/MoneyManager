<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { AlarmClock, CreditCard, Megaphone, PartyPopper, XCircle } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import { ref, computed } from 'vue'

defineOptions({ name: 'NotificationsPage' })

// 通知設定狀態
const notificationSettings = ref({
  email: {
    enabled: true,
    renewal: true,
    payment: true,
    newSubscription: true,
    cancellation: true,
  },
  push: {
    enabled: false,
    renewal: true,
    payment: false,
    newSubscription: true,
    cancellation: true,
  },
  sms: {
    enabled: false,
    renewal: false,
    payment: true,
    newSubscription: false,
    cancellation: false,
  },
})

// 通知歷史記錄
const notifications = ref([
  {
    id: 1,
    type: 'renewal',
    title: 'Spotify Family 即將到期',
    message: '您的 Spotify Family 訂閱將於 2025年7月15日 到期',
    timestamp: '2025-01-08 10:30',
    read: false,
    priority: 'high',
  },
  {
    id: 2,
    type: 'payment',
    title: '付款成功',
    message: 'YouTube Premium 月費 NT$57 已成功扣款',
    timestamp: '2025-01-08 09:15',
    read: true,
    priority: 'medium',
  },
  {
    id: 3,
    type: 'new',
    title: '歡迎使用 SubManager',
    message: '感謝您註冊 SubManager！開始管理您的訂閱服務吧。',
    timestamp: '2025-01-07 14:20',
    read: true,
    priority: 'low',
  },
  {
    id: 4,
    type: 'cancellation',
    title: 'Netflix 已取消',
    message: '您的 Netflix Standard 訂閱已成功取消',
    timestamp: '2025-01-06 16:45',
    read: true,
    priority: 'medium',
  },
  {
    id: 5,
    type: 'renewal',
    title: 'VPS-HK 即將到期',
    message: '您的 VPS-HK 訂閱將於 2025年7月26日 到期',
    timestamp: '2025-01-05 11:30',
    read: false,
    priority: 'high',
  },
])

// 計算未讀通知數量
const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

// 標記所有通知為已讀
const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.read = true
  })
}

// 刪除通知
const deleteNotification = (id: number) => {
  const index = notifications.value.findIndex((n) => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// 獲取通知類型圖示
const getNotificationIcon = (type: string) => {
  const icons: Record<string, typeof Megaphone> = {
    renewal: AlarmClock,
    payment: CreditCard,
    new: PartyPopper,
    cancellation: XCircle,
  }
  return icons[type] || Megaphone
}

// 獲取優先級顏色 - high 用既有 destructive 語意色，medium 用 warning，
// low 刻意不上色（維持 muted），三階已經有紅/橙/灰的區分，不用再多開一個色相
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    high: 'bg-destructive/10 text-destructive',
    medium: 'bg-warning/15 text-warning',
  }
  return colors[priority] || 'bg-muted text-muted-foreground'
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="通知設定" description="管理通知偏好設定並查看最近的提醒">
      <Badge v-if="unreadCount > 0" variant="destructive" class="text-sm">
        {{ unreadCount }} 未讀
      </Badge>
      <Button v-if="unreadCount > 0" variant="outline" size="sm" @click="markAllAsRead">
        全部標為已讀
      </Button>
    </PageHeader>

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- 通知設定 -->
      <div class="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>通知設定</CardTitle>
            <CardDescription>配置接收通知的方式</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Email 通知 -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium">電子郵件通知</h4>
                  <p class="text-sm text-muted-foreground">透過電子郵件接收通知</p>
                </div>
                <Switch v-model:checked="notificationSettings.email.enabled" />
              </div>
              <div v-if="notificationSettings.email.enabled" class="ml-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm">續費提醒</span>
                  <Switch v-model:checked="notificationSettings.email.renewal" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">付款確認</span>
                  <Switch v-model:checked="notificationSettings.email.payment" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">新訂閱</span>
                  <Switch v-model:checked="notificationSettings.email.newSubscription" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">取消訂閱</span>
                  <Switch v-model:checked="notificationSettings.email.cancellation" />
                </div>
              </div>
            </div>

            <Separator />

            <!-- Push 通知 -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium">推播通知</h4>
                  <p class="text-sm text-muted-foreground">接收瀏覽器通知</p>
                </div>
                <Switch v-model:checked="notificationSettings.push.enabled" />
              </div>
              <div v-if="notificationSettings.push.enabled" class="ml-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm">續費提醒</span>
                  <Switch v-model:checked="notificationSettings.push.renewal" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">付款確認</span>
                  <Switch v-model:checked="notificationSettings.push.payment" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">新訂閱</span>
                  <Switch v-model:checked="notificationSettings.push.newSubscription" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">取消訂閱</span>
                  <Switch v-model:checked="notificationSettings.push.cancellation" />
                </div>
              </div>
            </div>

            <Separator />

            <!-- SMS 通知 -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium">簡訊通知</h4>
                  <p class="text-sm text-muted-foreground">接收簡訊提醒</p>
                </div>
                <Switch v-model:checked="notificationSettings.sms.enabled" />
              </div>
              <div v-if="notificationSettings.sms.enabled" class="ml-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm">續費提醒</span>
                  <Switch v-model:checked="notificationSettings.sms.renewal" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">付款確認</span>
                  <Switch v-model:checked="notificationSettings.sms.payment" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">新訂閱</span>
                  <Switch v-model:checked="notificationSettings.sms.newSubscription" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">取消訂閱</span>
                  <Switch v-model:checked="notificationSettings.sms.cancellation" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 通知歷史 -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>最近通知</CardTitle>
            <CardDescription>您最近的通知歷史</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="notifications.length > 0" class="space-y-4">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50"
                :class="{ 'bg-muted/30': !notification.read }"
              >
                <!-- 通知圖示 -->
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
                >
                  <component :is="getNotificationIcon(notification.type)" class="size-5" aria-hidden="true" />
                </div>

                <!-- 通知內容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h4 class="font-medium text-foreground">{{ notification.title }}</h4>
                        <Badge
                          :class="getPriorityColor(notification.priority)"
                          variant="secondary"
                          class="text-xs"
                        >
                          {{ notification.priority }}
                        </Badge>
                        <div
                          v-if="!notification.read"
                          class="h-2 w-2 rounded-full bg-primary"
                        ></div>
                      </div>
                      <p class="text-sm text-muted-foreground mb-2">{{ notification.message }}</p>
                      <p class="text-xs text-muted-foreground">{{ notification.timestamp }}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="deleteNotification(notification.id)"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空狀態 -->
            <div v-else class="text-center py-12">
              <svg
                class="mx-auto h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 3h5l-5-5v5z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-foreground">No notifications</h3>
              <p class="mt-1 text-sm text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
