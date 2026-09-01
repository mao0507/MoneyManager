<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import PageHeader from '@/components/common/PageHeader.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { isDark } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'
import { useSubscriptionData } from '@/composables/useSubscriptionData'
import { useExpenseData } from '@/composables/useExpenseData'
import { formatDate } from '@/lib/format'

defineOptions({ name: 'SettingsPage' })

// 設定狀態
const notifications = ref({
  email: true,
  push: false,
  renewal: true,
  payment: true,
})

const currency = ref('TWD')
const language = ref('zh-TW')

const currencies = [
  { value: 'TWD', label: '新台幣 (NT$)' },
  { value: 'CNY', label: '人民幣 (¥)' },
  { value: 'USD', label: '美元 ($)' },
  { value: 'EUR', label: '歐元 (€)' },
  { value: 'JPY', label: '日圓 (¥)' },
]

const languages = [
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'zh-CN', label: '簡體中文' },
  { value: 'en', label: '英文' },
  { value: 'ja', label: '日本語' },
]

const themes = [
  { value: 'dark', label: '深色模式' },
  { value: 'light', label: '淺色模式' },
]

const theme = computed({
  get: () => (isDark.value ? 'dark' : 'light'),
  set: (v: string) => {
    isDark.value = v === 'dark'
  },
})

const { user } = useAuth()
const { stats: subscriptionStats, clearAllSubscriptions } = useSubscriptionData()
const { stats: expenseStats, clearAllExpenses } = useExpenseData()

const isClearing = ref(false)

const handleClearAllData = async () => {
  isClearing.value = true
  try {
    await Promise.all([clearAllSubscriptions(), clearAllExpenses()])
    toast.success('所有資料已清除')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : '清除資料失敗，請稍後再試')
  } finally {
    isClearing.value = false
  }
}

const userProfile = computed(() => ({
  name: user.value?.name || user.value?.email || '使用者',
  email: user.value?.email ?? '—',
  memberSince: user.value?.createdAt ? formatDate(user.value.createdAt, 'YYYY年MM月') : '—',
  totalSubscriptions: subscriptionStats.value.total,
  totalSpent: `NT$${expenseStats.value.totalAmount.toLocaleString()}`,
}))
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="設定" description="管理您的帳戶設定和偏好" />

    <section class="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>個人資料</CardTitle>
          <CardDescription>帳戶基本資訊</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">姓名</span>
              <span class="font-medium">{{ userProfile.name }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">電子郵件</span>
              <span class="font-medium">{{ userProfile.email }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">會員時間</span>
              <span class="font-medium">{{ userProfile.memberSince }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">總訂閱數</span>
              <span class="font-medium">{{ userProfile.totalSubscriptions }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">總支出</span>
              <span class="font-medium">{{ userProfile.totalSpent }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
          <CardDescription>管理通知偏好</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">電子郵件通知</div>
                <div class="text-xs text-muted-foreground">接收重要更新通知</div>
              </div>
              <Switch v-model:checked="notifications.email" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">推播通知</div>
                <div class="text-xs text-muted-foreground">即時推播提醒</div>
              </div>
              <Switch v-model:checked="notifications.push" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">續費提醒</div>
                <div class="text-xs text-muted-foreground">訂閱即將到期提醒</div>
              </div>
              <Switch v-model:checked="notifications.renewal" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">付款通知</div>
                <div class="text-xs text-muted-foreground">付款成功/失敗通知</div>
              </div>
              <Switch v-model:checked="notifications.payment" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>顯示設定</CardTitle>
          <CardDescription>自訂介面偏好</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">貨幣</span>
              <Select v-model="currency">
                <SelectTrigger class="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="curr in currencies" :key="curr.value" :value="curr.value">
                    {{ curr.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">語言</span>
              <Select v-model="language">
                <SelectTrigger class="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="lang in languages" :key="lang.value" :value="lang.value">
                    {{ lang.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">主題</span>
              <Select v-model="theme">
                <SelectTrigger class="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="th in themes" :key="th.value" :value="th.value">
                    {{ th.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>資料管理</CardTitle>
          <CardDescription>匯入/匯出和備份</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <Tooltip>
              <TooltipTrigger as-child>
                <span tabindex="0" class="block">
                  <Button class="w-full" disabled> 匯入訂閱資料 </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>即將推出</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger as-child>
                <span tabindex="0" class="block">
                  <Button variant="outline" class="w-full" disabled> 匯出資料 </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>即將推出</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger as-child>
                <span tabindex="0" class="block">
                  <Button variant="outline" class="w-full" disabled> 備份設定 </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>即將推出</TooltipContent>
            </Tooltip>

            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="destructive" class="w-full" :disabled="isClearing">
                  {{ isClearing ? '清除中…' : '清除所有資料' }}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>確定要清除所有資料嗎？</AlertDialogTitle>
                  <AlertDialogDescription>
                    這會刪除所有訂閱與消費紀錄，此動作無法復原。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    class="bg-destructive text-white hover:bg-destructive/90"
                    @click="handleClearAllData"
                  >
                    確定清除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
