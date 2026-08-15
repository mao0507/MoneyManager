<script setup lang="ts">
import SubscriptionCard from '@/components/common/SubscriptionCard.vue'
import AddSubscriptionDialog from '@/components/common/AddSubscriptionDialog.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/common/PageHeader.vue'
import { ref, computed } from 'vue'
import { useSubscriptionData } from '@/composables/useSubscriptionData'
import type { FilterStatus, NewSubscriptionInput, SubscriptionItem } from '@/types'

const filterStatusOptions: { label: string; value: FilterStatus }[] = [
  { label: '全部', value: 'All' },
  { label: '活躍', value: 'Active' },
  { label: '試用', value: 'Trial' },
  { label: '已取消', value: 'Cancelled' },
]

defineOptions({ name: 'SubscriptionsPage' })

// 使用共用的訂閱數據
const {
  originalItems,
  filteredItems,
  stats,
  searchQuery,
  filterStatus,
  fetchError,
  addSubscription,
  updateSubscription,
  removeSubscription,
} = useSubscriptionData()

// 本地狀態
const sortBy = ref<'name' | 'price' | 'nextPayment'>('name')
const viewMode = ref<'grid' | 'list'>('grid')
const isAddDialogOpen = ref(false)
const editingItem = ref<SubscriptionItem | null>(null)
const submitError = ref<string | null>(null)

// 排序後的資料
const sortedItems = computed(() => {
  const items = [...filteredItems.value]

  items.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price':
        return a.amount - b.amount
      case 'nextPayment':
        return new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime()
      default:
        return 0
    }
  })

  return items
})

// 處理新增/編輯訂閱表單送出 - 失敗時 dialog 留著不關，讓使用者看到錯誤並可重試
const handleSubmit = async (data: NewSubscriptionInput) => {
  submitError.value = null
  try {
    if (editingItem.value) {
      await updateSubscription(editingItem.value.id, data)
    } else {
      await addSubscription(data)
    }
    editingItem.value = null
    isAddDialogOpen.value = false
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : '儲存訂閱失敗，請稍後再試'
  }
}

// 打開新增訂閱彈出視窗
const openAddDialog = () => {
  editingItem.value = null
  submitError.value = null
  isAddDialogOpen.value = true
}

// 打開編輯訂閱彈出視窗
const openEditDialog = (item: SubscriptionItem) => {
  editingItem.value = item
  submitError.value = null
  isAddDialogOpen.value = true
}

// dialog 關閉（含取消）時清掉編輯目標，避免下次點編輯同一筆時 watch 拿到同一個物件參照
const handleDialogOpenChange = (open: boolean) => {
  isAddDialogOpen.value = open
  if (!open) {
    editingItem.value = null
    submitError.value = null
  }
}

// 刪除訂閱
const pageError = ref<string | null>(null)
const handleDelete = async (item: SubscriptionItem) => {
  pageError.value = null
  try {
    await removeSubscription(item.id)
  } catch (error) {
    pageError.value = error instanceof Error ? error.message : '刪除訂閱失敗，請稍後再試'
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="訂閱管理" description="管理所有訂閱服務">
      <Button variant="outline" size="icon" title="Refresh">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </Button>
      <Button variant="outline" size="icon" title="Settings">
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
      v-if="pageError || fetchError"
      class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive"
    >
      {{ pageError || fetchError }}
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">總計</CardTitle>
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
          <div class="text-2xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-muted-foreground">subscriptions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">活躍</CardTitle>
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
          <div class="text-2xl font-bold">{{ stats.active }}</div>
          <p class="text-xs text-muted-foreground">active subscriptions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">月度</CardTitle>
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
          <div class="text-2xl font-bold">NT${{ stats.monthlyTotal.toFixed(0) }}</div>
          <p class="text-xs text-muted-foreground">per month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">年度</CardTitle>
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
          <div class="text-2xl font-bold">NT${{ stats.yearlyTotal.toFixed(0) }}</div>
          <p class="text-xs text-muted-foreground">per year</p>
        </CardContent>
      </Card>
    </div>

    <!-- 搜尋和篩選 -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- 搜尋框 -->
      <div class="relative flex-1 max-w-sm">
        <Input v-model="searchQuery" type="text" placeholder="搜尋訂閱..." class="pl-10" />
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
          v-for="status in filterStatusOptions"
          :key="status.value"
          @click="filterStatus = status.value"
          :variant="filterStatus === status.value ? 'default' : 'outline'"
          size="sm"
        >
          {{ status.label }}
        </Button>
      </div>

      <!-- 排序和視圖控制 -->
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          @click="
            sortBy = sortBy === 'name' ? 'price' : sortBy === 'price' ? 'nextPayment' : 'name'
          "
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          排序：{{ sortBy === 'name' ? '名稱' : sortBy === 'price' ? '價格' : '日期' }}
        </Button>

        <div class="flex border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            :class="viewMode === 'grid' ? 'bg-muted' : ''"
            @click="viewMode = 'grid'"
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
          <Button
            variant="ghost"
            size="sm"
            :class="viewMode === 'list' ? 'bg-muted' : ''"
            @click="viewMode = 'list'"
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
        </div>
      </div>
    </div>

    <!-- 主要操作按鈕 -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Showing {{ sortedItems.length }} of {{ originalItems.length }} subscriptions</span>
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
          新增訂閱
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

    <!-- 訂閱列表 -->
    <div
      v-if="sortedItems.length > 0"
      :class="
        viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'
      "
    >
      <SubscriptionCard
        v-for="item in sortedItems"
        :key="item.id"
        :name="item.name"
        :plan="item.plan"
        :amount="item.amount"
        :currency="item.currency"
        :cycle="item.cycle"
        :active="item.active"
        :next-payment="item.nextPayment"
        :payment-method="item.paymentMethod"
        :renewal="item.renewal"
        :category="item.category"
        @edit="openEditDialog(item)"
        @delete="handleDelete(item)"
      />
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
      <h3 class="mt-2 text-sm font-medium text-foreground">No subscriptions found</h3>
      <p class="mt-1 text-sm text-muted-foreground">
        {{
          searchQuery
            ? 'Try adjusting your search or filter criteria.'
            : 'Get started by adding your first subscription.'
        }}
      </p>
      <div class="mt-6">
        <Button>
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          新增訂閱
        </Button>
      </div>
    </div>
  </div>

  <!-- 新增/編輯訂閱彈出視窗 -->
  <AddSubscriptionDialog
    :is-open="isAddDialogOpen"
    :edit-item="editingItem"
    :error="submitError"
    @update:is-open="handleDialogOpenChange"
    @submit="handleSubmit"
  />
</template>
