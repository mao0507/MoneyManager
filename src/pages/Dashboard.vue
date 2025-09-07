<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineOptions({ name: 'DashboardPage' })

const stats = [
  { title: 'Monthly Spending', value: '¥57.23', hint: 'Current month expenses' },
  { title: 'Yearly Spending', value: '¥2,087.33', hint: 'Current year total expenses' },
  { title: 'Active Subscriptions', value: '6', hint: 'Total services' },
]

const recentlyPaid = [
  { name: 'YouTube Premium', amount: '¥57.23', date: '2025年7月8日' },
  { name: 'VPS-HK', amount: '¥28.00', date: '2025年7月5日' },
]

const upcomingRenewals = [
  { name: 'Spotify Family', amount: '¥143.27', date: '2025年7月15日', daysLeft: 2 },
  { name: 'VPS-HK', amount: '¥28.00', date: '2025年7月26日', daysLeft: 13 },
]

const spendingByCategory = [
  { category: '音樂串流', amount: '¥1,710.20', percentage: 45 },
  { category: '影片串流', amount: '¥856.10', percentage: 22 },
  { category: '生產力工具', amount: '¥780.00', percentage: 20 },
  { category: 'VPS服務', amount: '¥336.00', percentage: 9 },
  { category: '其他', amount: '¥150.00', percentage: 4 },
]

const topVendors = [
  { name: 'Spotify', amount: '¥1,710.20', subscriptions: 1 },
  { name: 'YouTube', amount: '¥856.10', subscriptions: 1 },
  { name: 'Monica', amount: '¥780.00', subscriptions: 1 },
  { name: 'Cursor', amount: '¥716.33', subscriptions: 1 },
]
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Overview of your subscription expenses and activity
      </p>
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
          <CardTitle>Recently Paid</CardTitle>
          <CardDescription>Subscriptions paid in the last 7 days</CardDescription>
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
          <CardTitle>Upcoming Renewals</CardTitle>
          <CardDescription>Subscriptions renewing in the next 7 days</CardDescription>
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
                <Badge variant="destructive" class="text-xs">{{ item.daysLeft }} days</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Annual breakdown by category</CardDescription>
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
          <CardTitle>Top Vendors</CardTitle>
          <CardDescription>Highest spending vendors</CardDescription>
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
                <div class="text-xs text-muted-foreground">
                  {{ item.subscriptions }} subscription
                </div>
              </div>
              <span class="font-medium">{{ item.amount }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
