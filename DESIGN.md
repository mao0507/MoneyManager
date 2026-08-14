---
name: MoneyManager
description: 個人訂閱與消費管理系統
colors:
  quiet-violet: "oklch(0.5 0.18 300)"
  quiet-violet-ring: "oklch(0.6 0.16 300)"
  ink-black: "oklch(0.205 0 0)"
  paper-white-on-ink: "oklch(0.985 0 0)"
  paper-white: "oklch(1 0 0)"
  near-black-text: "oklch(0.145 0 0)"
  whisper-gray: "oklch(0.97 0 0)"
  slate-gray: "oklch(0.556 0 0)"
  hairline-gray: "oklch(0.922 0 0)"
  focus-ring-gray: "oklch(0.708 0 0)"
  warning-red: "oklch(0.577 0.245 27.325)"
typography:
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "normal"
    letterSpacing: "normal"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1"
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
components:
  button-primary:
    backgroundColor: "{colors.quiet-violet}"
    textColor: "{colors.paper-white-on-ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.whisper-gray}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.near-black-text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-destructive:
    backgroundColor: "{colors.warning-red}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.near-black-text}"
    rounded: "{rounded.xl}"
    padding: "24px"
  badge-default:
    backgroundColor: "{colors.quiet-violet}"
    textColor: "{colors.paper-white-on-ink}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.near-black-text}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
---

# Design System: MoneyManager

## Overview

**Creative North Star: "The Quiet Ledger"（安靜帳本）**

MoneyManager 是純自用的個人訂閱與消費管理工具（見 PRODUCT.md），沒有對外定位或行銷需求。目前的視覺實作是 shadcn-vue「new-york」風格搭 neutral 基底色 — 純黑白灰階，紅色只用於警示與刪除等破壞性操作。畫面刻意不強調自己，讓數字（月/年花費、訂閱狀態）當主角。

這是「安靜帳本」的字面體現：紙一樣白的背景、灰階分層資訊優先級，只有一個紫色落在「主要動作」這個語意角色上，稀有才有力道 — 不裝飾、不擴散。

**Key Characteristics:**
- 中性色階（黑/白/灰）為主，強調色（Quiet Violet 紫）只落在主要動作/連結/focus，語意色（紅=警示/刪除）維持獨立
- 元件圓角統一走 shadcn 預設尺度（6px/8px/10px/14px），無自訂形狀語言
- 靜態內容（統計卡）維持平面 `shadow-sm`；真正互動的元素（按鈕 hover/press、可點擊卡片、浮動層）有明確的 raised/lifted 陰影層次，層次感只給「會動的東西」，不是通篇加陰影
- 無自訂字體，沿用 Tailwind 預設系統字型堆疊；尚無系統化的字級/字重階層，各頁面標題字級（`text-2xl`/`text-3xl`）為隨頁面手動指定，非統一 token

## Colors

黑白灰為主的中性階，強調色（紫）只落在主要動作角色，紅色是獨立的語意色（警示/刪除）。

### Primary
- **Quiet Violet** (`oklch(0.5 0.18 300)`): 主要按鈕背景、預設 Badge 背景、連結文字、focus ring（`quiet-violet-ring`，`oklch(0.6 0.16 300)`，較淺一階讓 ring 不搶戲）。系統唯一的品牌強調色，中低彩度，避免壓過內容。
- **Paper White on Ink** (`oklch(0.985 0 0)`): Primary 元件上的文字/圖示顏色。

### Neutral
- **Paper White** (`oklch(1 0 0)`): 全站背景、卡片背景、Outline 按鈕背景。
- **Near-Black Text** (`oklch(0.145 0 0)`): 內文與標題文字色。
- **Ink Black** (`oklch(0.205 0 0)`): Secondary/Accent 元件上的文字色（Whisper Gray 背景上的文字），中性階最深的一階。
- **Whisper Gray** (`oklch(0.97 0 0)`): Secondary/Muted/Accent 背景（次要按鈕、hover 狀態底色）。
- **Slate Gray** (`oklch(0.556 0 0)`): 次要文字（`text-muted-foreground`），用於說明文字、次要標籤。
- **Hairline Gray** (`oklch(0.922 0 0)`): 邊框、輸入框邊線、分隔線。
- **Focus Ring Gray** (`oklch(0.708 0 0)`): focus 狀態的 ring 顏色（無色相中性灰，非品牌色）。

### 語意色
- **Warning Red** (`oklch(0.577 0.245 27.325)`): 破壞性操作（刪除訂閱）與驗證錯誤。系統中唯一有明顯色相的顏色，因此天生具有警示效果 — 不要把紅色用在非警示/破壞性語境，否則會稀釋它的訊號強度。

### 保留但目前未使用
- `chart-1` 到 `chart-5`（`--color-chart-*`）已定義多色相圖表色盤，但目前頁面（Reports、Dashboard 的分類/供應商分佈）都是文字列表呈現，尚未接上真正的圖表元件。實作圖表時才會用到，記錄於此避免重複定義。

## Typography

**Body Font:** `ui-sans-serif, system-ui, sans-serif`（Tailwind 預設堆疊，未自訂字體）

**Character:** 純功能性字體，無風格宣言。目前沒有跨頁面統一的字級 token，标题/內文字級是各頁面用 Tailwind utility（`text-2xl`、`text-3xl`、`text-sm`）手動指定，同語意角色（例如「頁面標題」）在不同頁面可能用不同字級。

### 已觀察到的用法（非正式階層，供參考）
- **頁面標題**：`text-2xl font-bold`（Dashboard）或 `text-3xl font-bold tracking-tight`（Subscriptions）— 兩頁不一致
- **卡片標題**（`CardTitle`）：`text-sm font-medium`（統計卡）或 `leading-none font-semibold`（一般卡片預設）
- **統計數字**：`text-2xl font-bold`
- **次要說明文字**：`text-sm text-muted-foreground` 或 `text-xs text-muted-foreground`

### 待定方向
若要往「安靜帳本」的方向做，建議下一步是把上述隨頁字級收斂成統一的 display/title/body/label 階層，而不是每頁各自決定。

## Layout

沿用 Tailwind 預設間距尺度（無專案自訂 spacing token）。頁面容器統一 `container mx-auto px-4`，內容區塊用 `space-y-6` 做垂直節奏。統計卡片區塊為 `grid grid-cols-2 md:grid-cols-4 gap-4`（手機 2 欄、桌面 4 欄），列表/表單區塊多為 `flex flex-col sm:flex-row` 響應式切換。無自訂斷點，使用 Tailwind 預設斷點（`sm`/`md`/`lg`）。

## Elevation & Depth

雙層系統：靜態內容維持平面極淡陰影（暗示邊界），互動/浮動元素有明確的抬升陰影（`raised`/`lifted` 兩級，帶真實 offset + blur，非零位移色暈）。層次感是「動作的回饋」，不是裝飾。

### Shadow Vocabulary
- **靜態邊界陰影**（Tailwind `shadow-sm`/`shadow-xs`）：統計卡、Input 靜止狀態，卡片與背景的極淡區隔，非強調用途。
- **Raised**（`--elevation-raised`，`0 4px 12px -2px oklch(0.205 0 0 / 0.12), 0 2px 4px -2px oklch(0.205 0 0 / 0.08)`，深色模式加大不透明度至 0.36/0.24）：hover 時的抬升層。用於 Primary/Destructive/Secondary 按鈕 hover、可點擊訂閱卡片 hover（同時搭配 `-translate-y-0.5` 位移，做出真的「浮起來」而非只換陰影）、Dropdown/Select/Popover 這些貼齊觸發元件的浮動選單。
- **Lifted**（`--elevation-lifted`，`0 12px 32px -8px oklch(0.205 0 0 / 0.18), 0 4px 8px -4px oklch(0.205 0 0 / 0.1)`，深色模式加大至 0.5/0.3）：Dialog/Modal 這種浮在畫面最上層、有遮罩襯底的內容，陰影範圍更大更柔，強調「離畫面最遠」。
- **按鈕 active 按下回饋**：hover 的位移與陰影在 `:active` 時收回（`translate-y-0` + `shadow-xs`），模擬按下去的觸感，放開回到 hover 狀態。

### Named Rules
**The Earned Depth Rule.** 陰影層次只給使用者會操作、會浮動的東西（按鈕、可點卡片、選單、對話框）。統計卡、標籤這類純顯示內容維持平面 — 陰影是互動回饋，不是裝飾，靜態內容有陰影等於在暗示一個不存在的可點擊行為。

## Shapes

圓角走 shadcn 預設尺度：`--radius: 0.625rem`（10px）為基準，衍生 `sm`(6px)/`md`(8px)/`lg`(10px)/`xl`(14px)。按鈕、輸入框、Badge、Dropdown 用 `rounded-md`（8px），卡片用 `rounded-xl`（14px，最大圓角留給最大的容器）。無自訂邊框/裁切語言，邊框一律 `1px solid` Hairline Gray。

## Components

### Buttons
- **Shape:** `rounded-md`（8px）
- **Primary:** Quiet Violet 背景 + Paper White 文字，靜止 `shadow-xs`，hover 轉 `bg-primary/90` + `shadow-raised` + 上移 1px，active 按下回到 `shadow-xs` 原位
- **Secondary:** Whisper Gray 背景 + Ink Black 文字，hover 轉 `shadow-raised`（無位移，較克制）
- **Outline:** Paper White 背景 + 1px Hairline Gray 邊框，hover 轉 Whisper Gray（無陰影變化）
- **Ghost:** 無背景，hover 轉 Whisper Gray（無陰影變化）
- **Destructive:** Warning Red 背景 + 白字，hover/active 行為同 Primary（`shadow-raised` + 位移 + 按下回饋），用於刪除等破壞性操作
- **Link:** 純文字 + 底線（hover 顯示），文字色為 Ink Black
- **Sizes:** `sm`(h-8) / `default`(h-9) / `lg`(h-10) / `icon`(size-9 方形)

### Cards / Containers
- **Corner Style:** `rounded-xl`（14px）
- **Background:** Paper White
- **Shadow Strategy:** 靜態卡（統計卡）維持 `shadow-sm`；可點擊卡（`SubscriptionCard`）hover 轉 `shadow-raised` + 上移 0.5（`-translate-y-0.5`），見 Elevation & Depth
- **Border:** 無（僅陰影區隔）
- **Internal Padding:** `py-6`（垂直）+ 子元件各自 `px-6`

### Badges
- **Style:** `rounded-md`，`px-2 py-0.5`，`text-xs font-medium`
- **Variants:** default（Quiet Violet 背景）/ secondary（Whisper Gray）/ destructive（Warning Red）/ outline（透明背景 + 文字色邊框）

### Inputs / Fields
- **Style:** 透明背景、1px Hairline Gray 邊框、`rounded-md`、`shadow-xs`
- **Focus:** border 轉 Focus Ring Gray + 3px 半透明 ring
- **Error:** `aria-invalid` 時邊框與 ring 轉 Warning Red

### Navigation
頂部橫向導覽列（`App.vue`），文字 + Lucide icon（`size-4`，與專案其餘元件同一套圖示庫），當前頁面用 Whisper Gray 底色標示 active 狀態，無底線或其他強調樣式。

### Floating Surfaces（Dialog / Dropdown / Select / Popover）
- **Dialog：** `shadow-lifted`，最外層浮動內容，配合半透明黑色遮罩（`bg-black/50`）與 fade + scale 進場動畫。
- **Dropdown Menu / Select / Popover：** `shadow-raised`，貼齊觸發元件的中量級浮動層，比 Dialog 輕但比靜態卡片明顯。

## Do's and Don'ts

### Do:
- **Do** 保持紅色（Warning Red）只用在破壞性操作與驗證錯誤，維持它的警示訊號強度。
- **Do** 讓 Quiet Violet 只落在「主要動作」語意角色（主按鈕、連結、focus ring、預設 Badge），不擴散進中性表面。
- **Do** 新元件優先重用既有 `rounded-md`(8px)/`rounded-xl`(14px) 兩級圓角，不要引入第三種圓角尺度。
- **Do** 新頁面統計數字延續 `text-2xl font-bold` 的視覺重量，這是目前唯一算一致的字級用法。
- **Do** 新的互動元件（按鈕、可點卡片）用 `shadow-raised` token，浮動層（選單/彈窗）用 `shadow-raised`、Dialog 用 `shadow-lifted`，不要手刻新的陰影值。

### Don't:
- **Don't** 把 Warning Red 用在非警示/破壞性語境（例如純裝飾或當作一般強調色），會稀釋它的訊號意義。
- **Don't** 把 Quiet Violet 也用在中性表面（次要背景、邊框）上裝飾，會稀釋它作為「主要動作」訊號的力道。
- **Don't** 給靜態顯示內容（統計卡、標籤）加 hover 陰影/位移；那是在暗示不存在的可點擊行為。
- **Don't** 個別元件各自手刻陰影值追求「立體感」；一律用 `shadow-raised`/`shadow-lifted` 兩個 token。
