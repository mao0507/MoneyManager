<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ref, computed } from 'vue'
import { useSubscriptionData } from '@/composables/useSubscriptionData'

defineOptions({ name: 'ReportsPage' })

// 使用共用的訂閱數據
const { stats: subscriptionStats, categoryStats, vendorStats, monthlyData } = useSubscriptionData()

// 時間範圍選擇
const timeRange = ref('6months')
const activeTab = ref('overview')

// 計算報表統計數據
const stats = computed(() => {
  const totalSpent = monthlyData.value.reduce((sum, item) => sum + item.amount, 0)
  const averageMonthly = totalSpent / monthlyData.value.length
  const lastMonth = monthlyData.value[monthlyData.value.length - 1]
  const previousMonth = monthlyData.value[monthlyData.value.length - 2]
  const monthlyChange = ((lastMonth.amount - previousMonth.amount) / previousMonth.amount) * 100

  return {
    totalSpent,
    averageMonthly,
    monthlyChange,
    activeSubscriptions: subscriptionStats.value.active,
    totalCategories: categoryStats.value.length,
  }
})

// 類別數據（添加顏色）
const categoryData = computed(() => {
  const colors = ['bg-green-500', 'bg-red-500', 'bg-blue-500', 'bg-purple-500', 'bg-gray-500']
  return categoryStats.value.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }))
})

// 匯出功能
const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
  console.log(`Exporting report as ${format}`)
  // 這裡可以實現實際的匯出邏輯
}

// 獲取變化趨勢顏色
const getTrendColor = (change: string) => {
  if (change.startsWith('+')) return 'text-green-600 dark:text-green-400'
  if (change.startsWith('-')) return 'text-red-600 dark:text-red-400'
  return 'text-muted-foreground'
}

// 獲取變化趨勢圖示
const getTrendIcon = (change: string) => {
  if (change.startsWith('+')) return '↗'
  if (change.startsWith('-')) return '↘'
  return '→'
}
</script>

<template>
  <div class="space-y-6">
    <!-- 頁面標題和操作 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Expense Reports</h1>
        <p class="text-muted-foreground">Detailed analysis of your subscription spending</p>
      </div>
      <div class="flex items-center gap-2">
        <Select v-model="timeRange">
          <SelectTrigger class="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" @click="exportReport('pdf')">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export PDF
        </Button>
        <Button variant="outline" size="sm" @click="exportReport('csv')">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          Export CSV
        </Button>
      </div>
    </div>

    <!-- 統計概覽 -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Spent</CardTitle>
          <svg
            class="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">¥{{ stats.totalSpent.toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground">
            <span :class="getTrendColor(monthlyData[monthlyData.length - 1]?.change || '0%')">
              {{ getTrendIcon(monthlyData[monthlyData.length - 1]?.change || '0%') }}
              {{ monthlyData[monthlyData.length - 1]?.change || '0%' }}
            </span>
            from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Average Monthly</CardTitle>
          <svg
            class="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">¥{{ stats.averageMonthly.toFixed(2) }}</div>
          <p class="text-xs text-muted-foreground">per month average</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Subscriptions</CardTitle>
          <svg
            class="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.activeSubscriptions }}</div>
          <p class="text-xs text-muted-foreground">currently active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Categories</CardTitle>
          <svg
            class="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.totalCategories }}</div>
          <p class="text-xs text-muted-foreground">spending categories</p>
        </CardContent>
      </Card>
    </div>

    <!-- 詳細報告標籤頁 -->
    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="vendors">Vendors</TabsTrigger>
      </TabsList>

      <!-- 概覽標籤頁 -->
      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>Your spending pattern over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="item in monthlyData"
                  :key="item.month"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-primary"></div>
                    <span class="text-sm font-medium">{{ item.month }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">¥{{ item.amount.toLocaleString() }}</span>
                    <Badge :class="getTrendColor(item.change)" variant="secondary" class="text-xs">
                      {{ item.change }}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending Forecast</CardTitle>
              <CardDescription>Predicted spending based on current trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-foreground">Next month</span>
                  <span class="font-medium">¥2,200.00</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-foreground">Next quarter</span>
                  <span class="font-medium">¥6,600.00</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-foreground">Next year</span>
                  <span class="font-medium">¥26,400.00</span>
                </div>
                <Separator />
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">Projected increase</span>
                  <Badge variant="destructive" class="text-xs">+23.5%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- 趨勢標籤頁 -->
      <TabsContent value="trends" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trends Analysis</CardTitle>
            <CardDescription>Detailed analysis of your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <h4 class="font-medium">Growth Trends</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm">Monthly growth rate</span>
                    <Badge variant="default" class="text-xs">+6.1%</Badge>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm">Quarterly growth</span>
                    <Badge variant="default" class="text-xs">+18.3%</Badge>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm">Year-over-year</span>
                    <Badge variant="default" class="text-xs">+73.2%</Badge>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <h4 class="font-medium">Spending Insights</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm">Highest spending month</span>
                    <span class="text-sm font-medium">June 2025</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm">Lowest spending month</span>
                    <span class="text-sm font-medium">January 2025</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm">Average monthly increase</span>
                    <span class="text-sm font-medium">¥150.00</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 類別標籤頁 -->
      <TabsContent value="categories" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Spending distribution across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="item in categoryData" :key="item.category" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ item.category }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">¥{{ item.amount.toLocaleString() }}</span>
                    <Badge variant="secondary" class="text-xs">{{ item.percentage }}%</Badge>
                  </div>
                </div>
                <div class="w-full bg-muted rounded-full h-2">
                  <div
                    :class="item.color"
                    class="h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${item.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 供應商標籤頁 -->
      <TabsContent value="vendors" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Analysis</CardTitle>
            <CardDescription>Spending breakdown by service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="vendor in vendorStats"
                :key="vendor.vendor"
                class="flex items-center justify-between p-4 border rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <span class="text-lg">{{ vendor.vendor.charAt(0) }}</span>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ vendor.vendor }}</h4>
                    <p class="text-sm text-muted-foreground">
                      {{ vendor.subscriptions }} subscription
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium">¥{{ vendor.amount.toLocaleString() }}</div>
                  <Badge :class="getTrendColor(vendor.trend)" variant="secondary" class="text-xs">
                    {{ vendor.trend }}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
