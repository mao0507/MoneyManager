<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineOptions({ name: 'DashboardPage' })

const stats = [
  { title: '本月支出', value: 'NT$57', hint: '當月消費' },
  { title: '年度支出', value: 'NT$2,087', hint: '當年總支出' },
  { title: '活躍訂閱', value: '6', hint: '總服務數' },
]

const recentlyPaid = [
  { name: 'YouTube Premium', amount: 'NT$57', date: '2025年7月8日' },
  { name: 'VPS-HK', amount: 'NT$28', date: '2025年7月5日' },
]

const upcomingRenewals = [
  { name: 'Spotify Family', amount: 'NT$143', date: '2025年7月15日', daysLeft: 2 },
  { name: 'VPS-HK', amount: 'NT$28', date: '2025年7月26日', daysLeft: 13 },
]

const spendingByCategory = [
  { category: '音樂串流', amount: 'NT$1,710', percentage: 45 },
  { category: '影片串流', amount: 'NT$856', percentage: 22 },
  { category: '生產力工具', amount: 'NT$780', percentage: 20 },
  { category: 'VPS服務', amount: 'NT$336', percentage: 9 },
  { category: '其他', amount: 'NT$150', percentage: 4 },
]

const topVendors = [
  { name: 'Spotify', amount: 'NT$1,710', subscriptions: 1 },
  { name: 'YouTube', amount: 'NT$856', subscriptions: 1 },
  { name: 'Monica', amount: 'NT$780', subscriptions: 1 },
  { name: 'Cursor', amount: 'NT$716', subscriptions: 1 },
]
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold">儀表板</h1>
      <p class="text-sm text-muted-foreground mt-1">訂閱費用和活動概覽</p>
    </div>

    <section class="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mt-6">
      <Card v-for="(s, i) in stats" :key="i">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ s.title }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ s.value }}</div>
          <p class="text-xs text-muted-foreground">{{ s.hint }}</p>
        </CardContent>
      </Card>
    </section>

    <section class="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>最近付款</CardTitle>
          <CardDescription>過去7天內付款的訂閱</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="item in recentlyPaid"
              :key="item.name"
              class="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0"
            >
              <div>
                <div class="text-sm font-medium">{{ item.name }}</div>
                <div class="text-xs text-muted-foreground">{{ item.date }}</div>
              </div>
              <span class="font-medium">{{ item.amount }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>即將續費</CardTitle>
          <CardDescription>未來7天內續費的訂閱</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="item in upcomingRenewals"
              :key="item.name"
              class="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0"
            >
              <div>
                <div class="text-sm font-medium">{{ item.name }}</div>
                <div class="text-xs text-muted-foreground">{{ item.date }}</div>
              </div>
              <div class="text-right">
                <div class="font-medium">{{ item.amount }}</div>
                <Badge variant="destructive" class="text-xs">{{ item.daysLeft }} 天</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>按類別支出</CardTitle>
          <CardDescription>年度類別細分</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="item in spendingByCategory"
              :key="item.category"
              class="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ item.category }}</span>
                <Badge variant="secondary" class="text-xs">{{ item.percentage }}%</Badge>
              </div>
              <span class="font-medium">{{ item.amount }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>主要供應商</CardTitle>
          <CardDescription>支出最高的供應商</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="item in topVendors"
              :key="item.name"
              class="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0"
            >
              <div>
                <div class="text-sm font-medium">{{ item.name }}</div>
                <div class="text-xs text-muted-foreground">{{ item.subscriptions }} 個訂閱</div>
              </div>
              <span class="font-medium">{{ item.amount }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
