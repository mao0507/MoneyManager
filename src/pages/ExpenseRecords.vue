<script setup lang="ts">
import { ref } from 'vue'
import ExpenseCard from '@/components/common/ExpenseCard.vue'
import MonthSelector from '@/components/common/MonthSelector.vue'
import AddExpenseDialog from '@/components/common/AddExpenseDialog.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/common/PageHeader.vue'
import { useExpenseData } from '@/composables/useExpenseData'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseFilter, ExpenseRecord } from '@/types'

defineOptions({ name: 'ExpenseRecordsPage' })

const filterOptions: { label: string; value: ExpenseFilter }[] = [
  { label: '全部', value: 'All' },
  { label: '本月', value: 'This Month' },
  { label: '今年', value: 'This Year' },
  { label: '過去30天', value: 'Last 30 Days' },
]

// 使用消費數據
const {
  sortedExpenses,
  expenseCategories,
  stats,
  categoryStats,
  searchQuery,
  filterStatus,
  sortBy,
  viewMode,
  selectedMonth,
  fetchError,
  addExpense,
} = useExpenseData()

// 本地狀態
const activeTab = ref('records')
const isAddDialogOpen = ref(false)
const submitError = ref<string | null>(null)

const handleExpenseSubmit = async (data: Omit<ExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  submitError.value = null
  try {
    await addExpense(data)
    isAddDialogOpen.value = false
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : '新增消費紀錄失敗，請稍後再試'
  }
}

const openAddDialog = () => {
  submitError.value = null
  isAddDialogOpen.value = true
}

const handleDialogOpenChange = (open: boolean) => {
  isAddDialogOpen.value = open
  if (!open) submitError.value = null
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="消費紀錄" description="管理您的日常消費記錄和支出分析">
      <Button variant="outline" size="icon" title="重新整理">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </Button>
      <Button variant="outline" size="icon" title="設定">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </Button>
    </PageHeader>

    <!-- 錯誤訊息 -->
    <div
      v-if="fetchError"
      class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive"
    >
      {{ fetchError }}
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ selectedMonth ? '選中月份消費' : '總消費' }}
          </CardTitle>
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
          <div class="text-2xl font-bold">{{ formatCurrency(stats.totalAmount) }}</div>
          <p class="text-xs text-muted-foreground">
            {{ selectedMonth ? '該月份' : '總計' }} {{ stats.recordCount }} 筆紀錄
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ selectedMonth ? '選中月份' : '本月' }}消費
          </CardTitle>
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(stats.monthlyTotal) }}</div>
          <p class="text-xs text-muted-foreground">{{ selectedMonth ? '該月份' : '本月' }}支出</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ selectedMonth ? '選中月份' : '平均' }}消費
          </CardTitle>
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
          <div class="text-2xl font-bold">{{ formatCurrency(stats.averageAmount) }}</div>
          <p class="text-xs text-muted-foreground">{{ selectedMonth ? '該月份' : '平均' }}每筆</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ selectedMonth ? '選中月份' : '消費' }}類別
          </CardTitle>
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
          <div class="text-2xl font-bold">{{ stats.categoryCount }}</div>
          <p class="text-xs text-muted-foreground">{{ selectedMonth ? '該月份' : '個' }}類別</p>
        </CardContent>
      </Card>
    </div>

    <!-- 標籤頁導航 -->
    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="records">消費紀錄</TabsTrigger>
        <TabsTrigger value="analysis">支出分析</TabsTrigger>
      </TabsList>

      <!-- 消費紀錄標籤頁 -->
      <TabsContent value="records" class="space-y-4">
        <!-- 搜尋和篩選 -->
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- 月份選擇器 -->
          <div class="w-full max-w-xs">
            <MonthSelector v-model="selectedMonth" placeholder="選擇月份" />
          </div>

          <!-- 搜尋框 -->
          <div class="relative flex-1 max-w-sm">
            <Input v-model="searchQuery" type="text" placeholder="搜尋消費紀錄..." class="pl-10" />
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- 篩選按鈕 -->
          <div class="flex gap-2">
            <Button
              v-for="filter in filterOptions"
              :key="filter.value"
              @click="filterStatus = filter.value"
              :variant="filterStatus === filter.value ? 'default' : 'outline'"
              size="sm"
            >
              {{ filter.label }}
            </Button>
          </div>

          <!-- 排序和視圖控制 -->
          <div class="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              @click="
                sortBy = sortBy === 'date' ? 'amount' : sortBy === 'amount' ? 'category' : 'date'
              "
              class="h-9"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              排序: {{ sortBy === 'date' ? '日期' : sortBy === 'amount' ? '金額' : '類別' }}
            </Button>

            <div class="flex border rounded-md h-9">
              <Button
                variant="ghost"
                size="sm"
                :class="viewMode === 'list' ? 'bg-muted' : ''"
                @click="viewMode = 'list'"
                class="h-9 px-3"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="viewMode === 'grid' ? 'bg-muted' : ''"
                @click="viewMode = 'grid'"
                class="h-9 px-3"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <!-- 主要操作按鈕 -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span>顯示 {{ sortedExpenses.length }} 筆消費紀錄</span>
          </div>
          <div class="flex gap-2">
            <Button size="sm" @click="openAddDialog">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              新增消費
            </Button>
            <Button variant="outline" size="sm">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              匯入
            </Button>
            <Button variant="outline" size="sm">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              匯出
            </Button>
          </div>
        </div>

        <!-- 消費紀錄列表 -->
        <div
          v-if="sortedExpenses.length > 0"
          :class="
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          "
        >
          <ExpenseCard v-for="expense in sortedExpenses" :key="expense.id" :expense="expense" />
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-foreground">找不到消費紀錄</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ searchQuery ? '嘗試調整搜尋或篩選條件。' : '開始記錄您的第一筆消費。' }}
          </p>
          <div class="mt-6">
            <Button @click="openAddDialog">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              新增消費
            </Button>
          </div>
        </div>
      </TabsContent>

      <!-- 支出分析標籤頁 -->
      <TabsContent value="analysis" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>類別分佈</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div v-for="item in categoryStats" :key="item.category" class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">{{ item.category }}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium">{{ formatCurrency(item.amount) }}</span>
                      <Badge variant="secondary" class="text-xs">{{ item.percentage }}%</Badge>
                    </div>
                  </div>
                  <div class="w-full bg-muted rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300 bg-primary"
                      :style="{ width: `${item.percentage}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>消費類別</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="category in expenseCategories"
                  :key="category.id"
                  class="flex items-center gap-2 p-2 rounded-lg border"
                >
                  <component
                    :is="category.icon"
                    class="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-medium">{{ category.name }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ categoryStats.find((s) => s.category === category.name)?.count || 0 }} 筆
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>

    <AddExpenseDialog
      :is-open="isAddDialogOpen"
      @update:is-open="handleDialogOpenChange"
      :categories="expenseCategories"
      :error="submitError"
      @submit="handleExpenseSubmit"
    />
  </div>
</template>
