<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { ArrowDownRight, ArrowUpRight, Repeat, TrendingUp, Wallet } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/common/PageHeader.vue'
import { useSubscriptionData } from '@/composables/useSubscriptionData'
import { useExpenseData } from '@/composables/useExpenseData'
import { getChartPalette } from '@/lib/utils'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend)

defineOptions({ name: 'DashboardPage' })

const {
  monthlyData,
  stats: subscriptionStats,
  vendorStats,
  originalItems: subscriptionItems,
} = useSubscriptionData()
const { stats: expenseStats, originalExpenses } = useExpenseData()

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  maximumFractionDigits: 0,
})
const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

// 本月支出的月增率取自真實月度資料，跟支出報表頁同一套算法
const monthlyChange = computed(() => {
  const last = monthlyData.value[monthlyData.value.length - 1]
  const previous = monthlyData.value[monthlyData.value.length - 2]
  if (!last || !previous || previous.amount === 0) return null
  return ((last.amount - previous.amount) / previous.amount) * 100
})

// KPI 三格改吃 useSubscriptionData / useExpenseData 的真實統計，不再手動編數字
const stats = computed(() => [
  {
    title: '本月支出',
    value: currencyFormatter.format(subscriptionStats.value.monthlyTotal + expenseStats.value.monthlyTotal),
    hint: '當月消費',
    icon: Wallet,
  },
  {
    title: '年度支出',
    value: currencyFormatter.format(subscriptionStats.value.yearlyTotal + expenseStats.value.yearlyTotal),
    hint: '當年總支出',
    icon: TrendingUp,
  },
  { title: '活躍訂閱', value: String(subscriptionStats.value.active), hint: '總服務數', icon: Repeat },
])

// 最近付款 = 消費紀錄依日期排序取最新 2 筆
const recentlyPaid = computed(() =>
  [...originalExpenses.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)
    .map((expense) => ({
      name: expense.title,
      amount: currencyFormatter.format(expense.amount),
      date: new Date(expense.date),
    })),
)

// 即將續費 = 活躍訂閱依下次付款日排序，取最近 2 筆未到期的
const upcomingRenewals = computed(() => {
  const today = new Date()
  return subscriptionItems.value
    .filter((item) => item.active)
    .map((item) => {
      const nextPayment = new Date(item.nextPayment)
      const daysLeft = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { name: item.name, amount: currencyFormatter.format(item.amount), date: nextPayment, daysLeft }
    })
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 2)
})

// 近期活動 = 最近付款 + 即將續費 合併成單一時間軸表格，貼齊參考圖的事件列表版型
const recentActivity = computed(() => [
  ...recentlyPaid.value.map((item) => ({
    date: dateFormatter.format(item.date),
    name: item.name,
    type: '付款',
    amount: item.amount,
    status: 'success' as const,
    statusLabel: '已付款',
  })),
  ...upcomingRenewals.value.map((item) => ({
    date: dateFormatter.format(item.date),
    name: item.name,
    type: '續費',
    amount: item.amount,
    status: item.daysLeft <= 3 ? ('destructive' as const) : ('warning' as const),
    statusLabel: `${item.daysLeft} 天後到期`,
  })),
])

// 主要供應商 = useSubscriptionData 的 vendorStats 直接拿來用
const topVendors = computed(() =>
  [...vendorStats.value].sort((a, b) => b.amount - a.amount).slice(0, 4),
)
const maxVendorAmount = computed(() => Math.max(1, ...topVendors.value.map((v) => v.amount)))

// CSS 變數要在瀏覽器掛載後才讀得到值
const chartPalette = ref<string[]>([])
const gridColor = ref('transparent')
onMounted(() => {
  chartPalette.value = getChartPalette()
  gridColor.value = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
})

// 月度支出趨勢面積圖 - 規格書「用面積圖撫平消費尖峰」的落地，資料來自真實 monthlyData
const trendChartData = computed(() => {
  const color = chartPalette.value[0] ?? '#3D5AFE'
  return {
    labels: monthlyData.value.map((item) => item.month),
    datasets: [
      {
        label: '月支出',
        data: monthlyData.value.map((item) => item.amount),
        borderColor: color,
        backgroundColor: `${color}26`,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  }
})
const trendChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: gridColor.value }, ticks: { display: false } },
    x: { grid: { display: false } },
  },
}))
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="儀表板" description="訂閱費用和活動概覽" />

    <!-- KPI 列 - icon 方塊 + 趨勢徽章的卡片樣式，貼齊參考圖版型 -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card v-for="s in stats" :key="s.title">
        <CardContent class="pt-5">
          <div class="flex items-start justify-between">
            <span
              class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <component :is="s.icon" class="size-5" aria-hidden="true" />
            </span>
            <Badge
              v-if="s.title === '本月支出' && monthlyChange !== null"
              :variant="monthlyChange <= 0 ? 'success' : 'destructive-soft'"
              class="gap-0.5"
            >
              <ArrowDownRight v-if="monthlyChange <= 0" class="size-3" aria-hidden="true" />
              <ArrowUpRight v-else class="size-3" aria-hidden="true" />
              {{ Math.abs(monthlyChange).toFixed(1) }}%
            </Badge>
            <Badge v-else variant="secondary">{{ s.hint }}</Badge>
          </div>
          <div
            class="mt-4 text-3xl font-bold tracking-tight tabular-nums"
            style="font-family: var(--font-display)"
          >
            {{ s.value }}
          </div>
          <p class="mt-1 text-sm text-muted-foreground">{{ s.title }}</p>
        </CardContent>
      </Card>
    </section>

    <!-- 主圖表 8 欄 + 供應商用量條 4 欄 - 規格書 5. Layout Principles 的儀表板配置 -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="lg:col-span-8">
        <CardHeader class="flex-row items-center justify-between space-y-0">
          <CardTitle>月度支出趨勢</CardTitle>
          <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span class="size-2 rounded-full bg-primary" />
            月支出
          </span>
        </CardHeader>
        <CardContent>
          <div v-if="monthlyData.length > 0" class="h-72">
            <Line :data="trendChartData" :options="trendChartOptions" />
          </div>
          <p v-else class="py-8 text-center text-sm text-muted-foreground">尚無支出資料</p>
        </CardContent>
      </Card>

      <Card class="lg:col-span-4">
        <CardHeader>
          <CardTitle>主要供應商</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="item in topVendors" :key="item.vendor">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium">{{ item.vendor }}</span>
                <span
                  class="text-muted-foreground tabular-nums"
                  style="font-family: var(--font-display)"
                  >{{ currencyFormatter.format(item.amount) }}</span
                >
              </div>
              <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  class="h-full rounded-full bg-primary"
                  :style="{ width: `${(item.amount / maxVendorAmount) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- 近期活動表格 -->
    <Card>
      <CardHeader>
        <CardTitle>近期活動</CardTitle>
      </CardHeader>
      <CardContent class="px-0 pt-0">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr
                class="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground"
              >
                <th class="px-6 py-2 font-medium">日期</th>
                <th class="px-6 py-2 font-medium">項目</th>
                <th class="px-6 py-2 font-medium">類型</th>
                <th class="px-6 py-2 font-medium">狀態</th>
                <th class="px-6 py-2 text-right font-medium">金額</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in recentActivity"
                :key="`${item.name}-${i}`"
                class="border-b border-border/50 transition-colors last:border-b-0 hover:bg-muted/50"
              >
                <td class="px-6 py-3 text-muted-foreground">{{ item.date }}</td>
                <td class="px-6 py-3 font-medium">{{ item.name }}</td>
                <td class="px-6 py-3 text-muted-foreground">{{ item.type }}</td>
                <td class="px-6 py-3"><Badge :variant="item.status">{{ item.statusLabel }}</Badge></td>
                <td
                  class="px-6 py-3 text-right tabular-nums"
                  style="font-family: var(--font-display)"
                >
                  {{ item.amount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
