<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/common/PageHeader.vue'
import { useSubscriptionData } from '@/composables/useSubscriptionData'
import { useExpenseData } from '@/composables/useExpenseData'
import { toDoughnutChartData } from '@/lib/chart-data'
import { getChartPalette } from '@/lib/utils'

ChartJS.register(ArcElement, Tooltip, Legend)

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

const topVendors = [
  { name: 'Spotify', amount: 'NT$1,710', subscriptions: 1 },
  { name: 'YouTube', amount: 'NT$856', subscriptions: 1 },
  { name: 'Monica', amount: 'NT$780', subscriptions: 1 },
  { name: 'Cursor', amount: 'NT$716', subscriptions: 1 },
]

// 按類別支出：合併訂閱類別與消費紀錄類別的真實統計（比照 Reports.vue 的作法）
const { categoryStats } = useSubscriptionData()
const { categoryStats: expenseCategoryStats } = useExpenseData()

const categoryData = computed(() => [
  ...categoryStats.value.map((item) => ({ category: item.category, amount: item.amount })),
  ...expenseCategoryStats.value.map((item) => ({ category: item.category, amount: item.amount })),
])

// CSS 變數要在瀏覽器掛載後才讀得到值
const chartPalette = ref<string[]>([])
onMounted(() => {
  chartPalette.value = getChartPalette()
})

const categoryChartData = computed(() =>
  chartPalette.value.length > 0
    ? toDoughnutChartData(categoryData.value, chartPalette.value)
    : { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
)
const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 12 } } },
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="儀表板" description="訂閱費用和活動概覽" />

    <!-- 本月支出是最常被查看的數字，給它比次要指標更高的視覺重量，而不是三張等重卡片 -->
    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card class="lg:col-span-1">
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">{{ stats[0].title }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold tracking-tight">{{ stats[0].value }}</div>
          <p class="text-xs text-muted-foreground mt-1">{{ stats[0].hint }}</p>
        </CardContent>
      </Card>
      <div class="grid grid-cols-2 gap-4 sm:col-span-1 lg:col-span-2">
        <Card v-for="s in stats.slice(1)" :key="s.title">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ s.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ s.value }}</div>
            <p class="text-xs text-muted-foreground">{{ s.hint }}</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <section class="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>最近付款</CardTitle>
          <CardDescription>過去7天內付款的訂閱</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="item in recentlyPaid"
              :key="item.name"
              class="flex items-center justify-between py-1.5 border-b border-border/50 last:border-b-0"
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
          <div class="space-y-2">
            <div
              v-for="item in upcomingRenewals"
              :key="item.name"
              class="flex items-center justify-between py-1.5 border-b border-border/50 last:border-b-0"
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
          <CardDescription>類別支出佔比</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="categoryData.length > 0" class="h-64">
            <Doughnut :data="categoryChartData" :options="categoryChartOptions" />
          </div>
          <p v-else class="text-sm text-muted-foreground py-8 text-center">尚無支出資料</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>主要供應商</CardTitle>
          <CardDescription>支出最高的供應商</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="item in topVendors"
              :key="item.name"
              class="flex items-center justify-between py-1.5 border-b border-border/50 last:border-b-0"
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
