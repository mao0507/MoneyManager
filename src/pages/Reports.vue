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
import PageHeader from '@/components/common/PageHeader.vue'
import { ref, computed, onMounted } from 'vue'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { useSubscriptionData } from '@/composables/useSubscriptionData'
import { useExpenseData } from '@/composables/useExpenseData'
import { toTrendChartData, toVendorBarChartData } from '@/lib/chart-data'
import { getChartPalette } from '@/lib/utils'
import { getCategoryColorStyle } from '@/lib/category-colors'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

defineOptions({ name: 'ReportsPage' })

// 使用共用的訂閱數據和消費紀錄數據
const { stats: subscriptionStats, categoryStats, vendorStats, monthlyData } = useSubscriptionData()
const {
  stats: expenseStats,
  categoryStats: expenseCategoryStats,
  filteredExpenses,
} = useExpenseData()

// 時間範圍選擇
const timeRange = ref('6months')
const activeTab = ref('overview')

// 計算報表統計數據（整合訂閱和消費紀錄）
const stats = computed(() => {
  // 訂閱數據
  const subscriptionTotal = monthlyData.value.reduce((sum, item) => sum + item.amount, 0)
  const subscriptionAverage = subscriptionTotal / monthlyData.value.length

  // 消費紀錄數據 - 照實際有紀錄的月份分組算平均，
  // 不能直接拿當月累計當平均值（那只是還沒過完的這個月）
  const expenseTotal = expenseStats.value.totalAmount
  const expenseByMonth = new Map<string, number>()
  filteredExpenses.value.forEach((expense) => {
    const month = expense.date.slice(0, 7)
    expenseByMonth.set(month, (expenseByMonth.get(month) ?? 0) + expense.amount)
  })
  const expenseAverage = expenseByMonth.size
    ? Array.from(expenseByMonth.values()).reduce((sum, amount) => sum + amount, 0) /
      expenseByMonth.size
    : 0

  // 總計
  const totalSpent = subscriptionTotal + expenseTotal
  const averageMonthly = subscriptionAverage + expenseAverage

  // 計算變化（基於訂閱數據）
  const lastMonth = monthlyData.value[monthlyData.value.length - 1]
  const previousMonth = monthlyData.value[monthlyData.value.length - 2]
  const monthlyChange =
    lastMonth && previousMonth
      ? ((lastMonth.amount - previousMonth.amount) / previousMonth.amount) * 100
      : 0

  return {
    totalSpent,
    averageMonthly,
    monthlyChange,
    activeSubscriptions: subscriptionStats.value.active,
    totalCategories: categoryStats.value.length + expenseCategoryStats.value.length,
    subscriptionTotal,
    expenseTotal,
  }
})

// 類別數據（整合訂閱和消費紀錄類別）- 顏色依類別名稱雜湊決定，同名類別跨訂閱/消費一致
const categoryData = computed(() => [
  ...categoryStats.value.map((item) => ({
    ...item,
    colorStyle: { backgroundColor: getCategoryColorStyle(item.category).backgroundColor },
    type: 'subscription',
  })),
  ...expenseCategoryStats.value.map((item) => ({
    ...item,
    colorStyle: { backgroundColor: getCategoryColorStyle(item.category).backgroundColor },
    type: 'expense',
  })),
])

// 匯出功能
const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
  console.log(`Exporting report as ${format}`)
  // 這裡可以實現實際的匯出邏輯
}

// 獲取變化趨勢顏色（維持既有方向，只是把顏色改走 token，不改語意）
const getTrendColor = (change: string) => {
  if (change.startsWith('+')) return 'text-success'
  if (change.startsWith('-')) return 'text-destructive'
  return 'text-muted-foreground'
}

// 獲取變化趨勢圖示
const getTrendIcon = (change: string) => {
  if (change.startsWith('+')) return '↗'
  if (change.startsWith('-')) return '↘'
  return '→'
}

// 整合供應商數據（訂閱和消費紀錄）
const allVendorStats = computed(() => {
  // 訂閱供應商數據
  const subscriptionVendors = vendorStats.value.map((vendor) => ({
    ...vendor,
    type: 'subscription',
  }))

  // 從消費紀錄中提取供應商數據
  const expenseVendors = filteredExpenses.value.reduce(
    (acc, expense) => {
      const existingVendor = acc.find((v) => v.vendor === expense.title)
      if (existingVendor) {
        existingVendor.amount += expense.amount
        existingVendor.subscriptions += 1
      } else {
        acc.push({
          vendor: expense.title,
          amount: expense.amount,
          subscriptions: 1,
          trend: '+5.2%',
          type: 'expense',
        })
      }
      return acc
    },
    [] as Array<{
      vendor: string
      amount: number
      subscriptions: number
      trend: string
      type: string
    }>,
  )

  // 合併並排序
  return [...subscriptionVendors, ...expenseVendors]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10) // 只顯示前10個
})

// CSS 變數要在瀏覽器掛載後才讀得到值
const chartPalette = ref<string[]>([])
onMounted(() => {
  chartPalette.value = getChartPalette()
})

const monthlyTrendChartData = computed(() =>
  chartPalette.value.length > 0
    ? toTrendChartData(monthlyData.value, chartPalette.value)
    : { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
)
const monthlyTrendChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}

const vendorChartData = computed(() =>
  chartPalette.value.length > 0
    ? toVendorBarChartData(allVendorStats.value, chartPalette.value)
    : { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
)
const vendorChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="支出報表" description="訂閱和消費支出的詳細分析">
      <Select v-model="timeRange">
        <SelectTrigger class="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3months">最近 3 個月</SelectItem>
          <SelectItem value="6months">最近 6 個月</SelectItem>
          <SelectItem value="1year">最近一年</SelectItem>
          <SelectItem value="all">全部時間</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" class="bg-card" @click="exportReport('pdf')">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        匯出 PDF
      </Button>
      <Button variant="outline" size="sm" class="bg-card" @click="exportReport('csv')">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
        匯出 CSV
      </Button>
    </PageHeader>

    <!-- 統計概覽 -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">總支出</CardTitle>
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
          <div class="text-2xl font-bold">NT${{ stats.totalSpent.toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground">
            <span :class="getTrendColor(monthlyData[monthlyData.length - 1]?.change || '0%')">
              {{ getTrendIcon(monthlyData[monthlyData.length - 1]?.change || '0%') }}
              {{ monthlyData[monthlyData.length - 1]?.change || '0%' }}
            </span>
較上月
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">月平均</CardTitle>
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
          <div class="text-2xl font-bold">NT${{ stats.averageMonthly.toFixed(0) }}</div>
          <p class="text-xs text-muted-foreground">每月平均</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">活躍訂閱</CardTitle>
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
          <p class="text-xs text-muted-foreground">目前活躍</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">類別</CardTitle>
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
          <p class="text-xs text-muted-foreground">支出類別</p>
        </CardContent>
      </Card>
    </div>

    <!-- 詳細報告標籤頁 -->
    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="overview">概覽</TabsTrigger>
        <TabsTrigger value="trends">趨勢</TabsTrigger>
        <TabsTrigger value="categories">類別</TabsTrigger>
        <TabsTrigger value="vendors">供應商</TabsTrigger>
      </TabsList>

      <!-- 概覽標籤頁 -->
      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>月度支出趨勢</CardTitle>
              <CardDescription>過去6個月的支出模式</CardDescription>
            </CardHeader>
            <CardContent>
              <div v-if="monthlyData.length > 0" class="h-64">
                <Bar :data="monthlyTrendChartData" :options="monthlyTrendChartOptions" />
              </div>
              <p v-else class="text-sm text-muted-foreground py-8 text-center">尚無支出資料</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>支出預測</CardTitle>
              <CardDescription>基於當前趨勢的支出預測</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-foreground">下個月</span>
                  <span class="font-medium">NT$2,200</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-foreground">下季度</span>
                  <span class="font-medium">NT$6,600</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-foreground">明年</span>
                  <span class="font-medium">NT$26,400</span>
                </div>
                <Separator />
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">預期增長</span>
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
            <CardTitle>支出趨勢分析</CardTitle>
            <CardDescription>支出模式的詳細分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-4">
                <h4 class="font-medium">增長趨勢</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm">月度增長率</span>
                    <Badge variant="default" class="text-xs">+6.1%</Badge>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm">季度增長</span>
                    <Badge variant="default" class="text-xs">+18.3%</Badge>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm">年同比</span>
                    <Badge variant="default" class="text-xs">+73.2%</Badge>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <h4 class="font-medium">支出洞察</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm">支出最高月份</span>
                    <span class="text-sm font-medium">June 2025</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm">支出最低月份</span>
                    <span class="text-sm font-medium">January 2025</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm">月平均增長</span>
                    <span class="text-sm font-medium">NT$150</span>
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
            <CardTitle>類別細分</CardTitle>
            <CardDescription>不同類別的支出分佈</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="item in categoryData" :key="item.category" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ item.category }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">NT${{ item.amount.toLocaleString() }}</span>
                    <Badge variant="secondary" class="text-xs">{{ item.percentage }}%</Badge>
                  </div>
                </div>
                <div class="w-full bg-muted rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${item.percentage}%`, ...item.colorStyle }"
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
            <CardTitle>供應商分析</CardTitle>
            <CardDescription>按服務提供商的支出細分</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="allVendorStats.length > 0" class="h-80">
              <Bar :data="vendorChartData" :options="vendorChartOptions" />
            </div>
            <p v-else class="text-sm text-muted-foreground py-8 text-center">尚無供應商資料</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
