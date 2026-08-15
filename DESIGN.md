---
name: MoneyManager
description: 個人訂閱與消費管理系統
colors:
  light:
    background: "#F1F4F9"
    card: "#FFFFFF"
    foreground: "#111827"
    primary: "#3D5AFE"
    destructive: "#DC2626"
    success: "#16A34A"
    warning: "#D97706"
    border: "#E5E7EB"
    muted-foreground: "#6B7280"
  dark:
    background: "#0F1117"
    card: "#171923"
    foreground: "#F3F4F6"
    primary: "#5B7FFF"
    destructive: "#F87171"
    success: "#34D399"
    warning: "#FBBF24"
    border: "#262B3B"
    muted-foreground: "#9CA3AF"
typography:
  body:
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "normal"
  display:
    fontFamily: "'JetBrains Mono', {typography.body.fontFamily}"
    fontWeight: 700
    note: "KPI 數字、金額欄位專用等寬字，不是標題字"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "20px"
  pill: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.light.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.xl}"
  card:
    backgroundColor: "{colors.light.card}"
    textColor: "{colors.light.foreground}"
    rounded: "{rounded.lg}"
    padding: "20px"
  sidebar-nav-active:
    backgroundColor: "#EEF1FF"
    textColor: "{colors.light.primary}"
    rounded: "{rounded.xl}"
  badge-destructive:
    backgroundColor: "{colors.light.destructive}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
  badge-success-soft:
    backgroundColor: "rgba(22, 163, 74, 0.15)"
    textColor: "{colors.light.success}"
    rounded: "{rounded.pill}"
---

# Design System: MoneyManager

## Overview

**World: WattVision（藍色側邊欄版）** — light-first、側邊欄導覽、靛藍強調色

於 2026-08 第三輪換裝，使用者提供一張現成的參考截圖（沿用 WattVision 品牌名，但視覺語言跟先前的「深色 cyan 頂部導覽」規格書截然不同：淺色底、靛藍強調色、左側固定側邊欄）。使用者明講「整個系統換成圖片這樣」，因此這次是**全站佈局層級**的換裝，不只是色票替換：

- **導覽結構改變**：頂部橫向導覽 → 左側固定側邊欄（含品牌 icon、垂直選單、登出），md 以下退回漢堡選單
- **新增頂欄**：搜尋列（目前純視覺，未接功能）、通知/說明捷徑圖示、深淺色切換
- **強調色改變**：cyan（`#00E5FF`）→ 靛藍（`#3D5AFE`），淺色模式變成主打（`useTheme` 預設值從 `dark` 改 `light`），深色模式維持同一套靛藍語意做為可選替代
- **Dashboard 圖表改變**：類別佔比 Doughnut → 月度支出趨勢面積圖（`Line` + `fill: true`，資料來自真實 `monthlyData`），右側新增供應商用量長條（progress bar list），底部新增近期活動表格（合併「最近付款」與「即將續費」成單一時間軸）

**沒有換的：** 計算邏輯、資料結構、Supabase 認證流程、各頁面既有的業務元件（`SubscriptionCard`/`ExpenseCard` 等）不動，只動 `App.vue` 外殼、`style.css` token、`Dashboard.vue`。

## Colors

單一強調色（靛藍）分工，警示才切到獨立紅/黃/綠語意色，延續前一版 WattVision 的分工邏輯，只是色相從冷青換成靛藍。

### Primary — Indigo Blue
2026-08 audit：`#3D5AFE` 配白字對比比 ≈5.14:1，過 WCAG AA normal text（4.5:1）跟 large text 門檻，按鈕/badge 上的白字不用調。
驅動 `--primary`：側邊欄品牌 icon 底色、選單啟用態文字、KPI icon 底色、圖表主線、CTA 按鈕、focus ring。
- 淺色（預設）：`#3D5AFE`，白字
- 深色：`#5B7FFF`（提亮以維持深底可讀性），近黑文字 `#0B1020`

### 語意色（trend / status 徽章）
- **Success**（`#16A34A` 淺 / `#34D399` 深）：正向趨勢、已完成狀態。KPI 趨勢徽章走「淡底 15% 透明度 + 本體色文字」的軟性樣式（`Badge` 的 `success` variant），不是實心填色——實心填色留給更強的警示語境
- **Destructive-soft**（同色相的軟性版本，`Badge` 的 `destructive-soft` variant）：負向趨勢徽章跟表格裡的高急迫度狀態，一樣淡底 12% + 本體色文字
- **Destructive/Warning 實心**：續費倒數等真正需要搶眼的警示，維持前一版建立的「左框卡片 + 淡底」與「實心 Badge」兩種強度

### 中性與表面
- `--background`：淺色 `#F1F4F9`（帶一點藍灰，不是純白，維持面板感）／深色 `#0F1117`
- `--card`/`--sidebar`：淺色純白 `#FFFFFF`，跟背景拉開一階；深色 `#171923`
- `--border`：淺色 `#E5E7EB`，非常淡，卡片陰影（`--shadow-card`）改用極輕的 `0 1px 3px` 雙層陰影取代前一版較重的 colored glow，貼近參考圖「乾淨資料面板」而非「發光科技感」的質地

### Chart Colors
`chart-1..5`：靛藍主線 + 綠色成功 + 紅色警示 + 天藍/灰輔助，色相跟 KPI 語意色一致，深淺模式分開調亮度維持對比。

### 已知落差：類別色盤未跟進
`--category-1` 到 `--category-8` 仍是舊世界的 OKLCH 色相分佈，沒有重新調色配合靛藍主題。功能正常，純視覺基調尚未融合，是持續的已知落差（三輪換裝都沒處理，優先度一直排在後面）。

## Typography

**Body Font:** `'Inter'` + 繁中 fallback，不變。

**Display/KPI Font:** `'JetBrains Mono'`，不變——KPI 數字、金額欄位（含 Dashboard 表格的金額欄）都吃這顆字，標題文字用中文，等寬字對中文字型自動 fallback 回 Inter，視覺上無感知。

## Shapes

- **Card 圓角**：`16px`
- **側邊欄選單項/按鈕**：`20px`（`rounded-xl`），比前一版更圓潤，貼近參考圖選單 pill 的視覺重量
- **搜尋列/Input**：`20px` 圓角 + 淡底（`bg-muted/50`），focus 時轉卡片白底 + `ring` 色邊框

## Layout

### 側邊欄殼層（`App.vue`）
- 已登入頁面：`flex` 佈局，左側 `<aside>` 固定寬度 `16rem`（`w-64`），`sticky top-0 h-dvh` 讓側邊欄不隨內容捲動，`md` 以下隱藏改用頂欄漢堡選單（沿用既有 `DropdownMenu` 元件）
- 頂欄（`sticky top-0`，`backdrop-blur`）：左側手機版漢堡 + 搜尋列（`sm` 以上顯示），右側深淺色切換／通知捷徑／說明捷徑
- 未登入頁面（`route.meta.publicOnly`）：維持簡化版本，不套側邊欄，只有極簡品牌列

### Dashboard 網格
- 首列：3 張 KPI 卡（`sm:grid-cols-3`），每張卡是「icon 方塊（左上）+ 趨勢或狀態徽章（右上）+ 大數字 + 標籤」的結構，是這輪新增的卡片語言，跟前一版純文字統計卡不同
- 次列：`lg:grid-cols-12`，左 8 欄是月度支出趨勢面積圖（真實資料），右 4 欄是供應商用量長條列表（progress bar，寬度依最大供應商金額正規化）
- 末列：近期活動表格（日期/項目/類型/狀態/金額五欄），合併原本分開的「最近付款」與「即將續費」兩張卡片

### Google 登入按鈕
延續前兩版的例外：白底 + Google 官方四色 G 圖示，不套用系統強調色。

## Do's and Don'ts

### Do:
- Do KPI 卡統一走「icon 方塊 + 徽章 + 大數字」結構，不要退回純文字統計卡。
- Do 趨勢/狀態徽章用軟性淡底樣式（`success`/`destructive-soft` variant），實心填色只留給真正需要搶眼的警示（例如續費倒數 ≤3 天）。
- Do 金額/KPI 數字一律用 `--font-display`（JetBrains Mono）。
- Do 側邊欄用 `sticky h-dvh`，不要讓它隨頁面內容一起捲動消失。
- Do 新增圖表優先接真實資料（`useSubscriptionData`/`useExpenseData` 既有的 computed），不要為了視覺相似度另外編一組假資料。

### Don't:
- Don't 假設類別色盤跟靛藍主題完全脫節——2026-08 audit 已把 `category-1..8` chroma 微調（light 0.05→0.06、`category-7` 靛藍色相拉到 0.09 呼應 primary），跟系統整體的低飽和調性對齊；8 色仍刻意保留 hue 分散以維持可辨識度，不是缺陷。
- Don't 把搜尋列當成純視覺元件——已接上真實搜尋（`App.vue` 的 `searchedSubscriptions`/`searchedExpenses`），輸入會即時查 `useSubscriptionData`/`useExpenseData` 已載入的資料並顯示下拉結果，點擊或 Enter 會把 query 同步進目標頁自己的 `searchQuery` state 再導頁。
- Don't 回頭套用前一版 WattVision（cyan、深色主打、頂部導覽、colored glow 陰影）的視覺——已隨這輪換裝汰換。
- Don't 另外建一套 spacing/typography token 疊在 Tailwind 預設之上——Tailwind v4 內建的 4px 基準間距階與 `text-xs`~`text-5xl` 字級階已經是完整量表，系統只客製 `font-sans`/`font-display` 兩個字族 token，故意不重造輪子。

## Component Reference（molecules，`src/components/common/`）

| 元件 | Props | Emits | 備註 |
|---|---|---|---|
| `SubscriptionCard` | `name, plan, amount, currency: 'TWD'\|'USD', cycle: 'Monthly'\|'Yearly', active?, nextPayment?, paymentMethod?, renewal: 'Automatic'\|'Manual', category?` | `edit`, `delete` | 品牌 icon 找不到時走 fallback icon 對照表 |
| `ExpenseCard` | `expense: ExpenseRecord` | — | 類別圖示/顏色內部對照表 |
| `AddSubscriptionDialog` | `isOpen, editItem?: SubscriptionItem \| null, error?: string \| null` | `update:isOpen`, `submit` | 新增/編輯共用同一顆 dialog |
| `AddExpenseDialog` | `isOpen, categories: ExpenseCategory[], error?: string \| null` | `update:isOpen`, `submit` | |
| `MonthSelector` | `modelValue?: Date, placeholder?` | `update:modelValue` | 預設 placeholder「選擇月份」 |
| `PageHeader` | `title, description?` | — | 純展示 |
| `LoadingSpinner` | `size?: 'sm'\|'md'\|'lg', text?, fullscreen?` | — | 預設 `md` / `Loading...` |
| `ErrorBoundary` | `fallback?: Component, onError?: (error, instance, info) => void` | — | 包 `RouterView`，`onErrorCaptured` |
| `BrandLogo` | `icon: BrandIcon` | — | simple-icons SVG 渲染 |
