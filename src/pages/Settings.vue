<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ref } from 'vue'

defineOptions({ name: 'SettingsPage' })

// 設定狀態
const notifications = ref({
  email: true,
  push: false,
  renewal: true,
  payment: true,
})

const currency = ref('CNY')
const language = ref('zh-TW')
const theme = ref('light')

const currencies = [
  { value: 'CNY', label: '人民幣 (¥)' },
  { value: 'USD', label: '美元 ($)' },
  { value: 'EUR', label: '歐元 (€)' },
  { value: 'JPY', label: '日圓 (¥)' },
]

const languages = [
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'zh-CN', label: '簡體中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

const themes = [
  { value: 'light', label: '淺色模式' },
  { value: 'dark', label: '深色模式' },
  { value: 'auto', label: '自動' },
]

const userProfile = {
  name: '使用者',
  email: 'user@example.com',
  memberSince: '2025年1月',
  totalSubscriptions: 6,
  totalSpent: '¥2,087.33',
}
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold">Settings</h1>
      <p class="text-sm text-muted-foreground mt-1">管理您的帳戶設定和偏好</p>
    </div>

    <section class="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mt-6">
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
            <Button class="w-full"> 匯入訂閱資料 </Button>
            <Button variant="outline" class="w-full"> 匯出資料 </Button>
            <Button variant="outline" class="w-full"> 備份設定 </Button>
            <Button variant="destructive" class="w-full"> 清除所有資料 </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
