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
  success-green: "oklch(0.6 0.15 145)"
  warning-amber: "oklch(0.75 0.15 80)"
  category-1: "oklch(0.94 0.05 64)"
  category-2: "oklch(0.94 0.05 97)"
  category-3: "oklch(0.94 0.05 130)"
  category-4: "oklch(0.94 0.05 164)"
  category-5: "oklch(0.94 0.05 197)"
  category-6: "oklch(0.94 0.05 230)"
  category-7: "oklch(0.94 0.05 264)"
  category-8: "oklch(0.94 0.05 343)"
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

MoneyManager 是純自用的個人訂閱與消費管理工具（見 PRODUCT.md），沒有對外定位或行銷需求。目前的視覺實作是 shadcn-vue「new-york」風格搭 neutral 基底色 — 黑白灰階為底，色彩只落在「有意義」的地方：主要動作、狀態、類別分類。畫面刻意不強調自己，讓數字（月/年花費、訂閱狀態）當主角。

這是「安靜帳本」的字面體現：紙一樣白的背景、灰階分層資訊優先級，色彩不是裝飾而是編碼 — 紫色代表「這是主要動作」、綠色代表「這是好事/啟用中」、琥珀色代表「注意但不緊急」、紅色代表「警示/破壞性」，類別色盤代表「這是哪一類」。每個色相只對應一個語意角色，稀有才有力道。

**Key Characteristics:**
- 中性色階（黑/白/灰）為底，強調色（Quiet Violet 紫）只落在主要動作/連結/focus；狀態與類別語意色系統化管理（見 Colors）
- 元件圓角統一走 shadcn 預設尺度（6px/8px/10px/14px），無自訂形狀語言
- 靜態內容（統計卡）維持平面 `shadow-sm`；真正互動的元素（按鈕 hover/press、可點擊卡片、浮動層）有明確的 raised/lifted 陰影層次，層次感只給「會動的東西」，不是通篇加陰影
- 無自訂字體，沿用 Tailwind 預設系統字型堆疊；尚無系統化的字級/字重階層，各頁面標題字級（`text-2xl`/`text-3xl`）為隨頁面手動指定，非統一 token

## Colors

黑白灰為主的中性階；紫色是唯一的品牌強調色，只落在主要動作角色；狀態與類別各有自己的語意色系統，彼此色相互不重疊，維持各自的辨識度。

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
- **Warning Red** (`oklch(0.577 0.245 27.325)`): 破壞性操作（刪除訂閱）與驗證錯誤。不要把紅色用在非警示/破壞性語境，否則會稀釋它的訊號強度。
- **Success Green** (`oklch(0.6 0.15 145)`，深色模式 `oklch(0.75 0.16 145)`): 正向狀態 — 訂閱「啟用」、續費「自動」、趨勢下降（支出減少視為好事）。文字/圖示直接用 `text-success`，避免跟 `--success-foreground`（設計給實心填色背景搭配的深色文字）混用，淡底色 + 飽和文字才有對比。
- **Warning Amber** (`oklch(0.75 0.15 80)`，深色模式 `oklch(0.8 0.16 80)`): 中等警示，目前只用在通知優先級（`medium`）。同樣用 `text-warning` 而非 `-foreground` 搭淡底色。

### 類別色盤（Category Colors）
訂閱與消費紀錄的分類標籤（Badge）與圖示底色共用一套 8 色盤（`--category-1` 到 `--category-8`，`src/lib/category-colors.ts`），依類別名稱字串雜湊決定顏色，同名類別（例如「其他」）跨訂閱/消費兩個領域自動拿到同一個顏色，不用手動維護對照表。8 個色相（64°/97°/130°/164°/197°/230°/264°/343°）刻意避開 Quiet Violet（300°附近）與 Warning Red（27°附近），確保類別色不會跟品牌色或警示色混淆。淡底色 + 飽和文字的 tint 模式（`L=0.94 C=0.05` 底 / `L≈0.42-0.46 C=0.16` 字，深色模式對應反轉），跟既有 Badge 的視覺重量一致。

**用法：** `getCategoryColorStyle(category)` 回傳 `{ backgroundColor, color }` inline style 物件，不是 Tailwind class — 因為 class 名稱是動態組出來的字串（`bg-category-${index}`），Tailwind 的靜態掃描器看不到，永遠不會產生對應 utility，只能用 CSS variable + inline style。套用時 Badge 用 `variant="outline"` 打底（避免跟 default/secondary variant 內建的顏色 class 打架），再用 `:style` 蓋上真正的類別色。

### Chart Colors
- `chart-1` 到 `chart-5`（`--color-chart-*`）是 Reports/Dashboard 圖表元件（Doughnut/Bar，`vue-chartjs`）實際在用的資料色盤，透過 `getChartPalette()`（`src/lib/utils.ts`）在執行期讀取 CSS 變數。跟類別色盤是兩套獨立系統：圖表色盤服務「資料序列」的視覺區分，類別色盤服務「單一類別」的標籤識別，語意不同不共用。

## Typography

**Body Font:** `ui-sans-serif, system-ui, sans-serif`（Tailwind 預設堆疊，未自訂字體）

**Character:** 純功能性字體，無風格宣言。頁面標題已收斂成統一元件（見下），其餘字級仍是各頁 Tailwind utility 手動指定。

### 階層
- **頁面標題**：`PageHeader` 元件統一輸出 `text-3xl font-bold tracking-tight`，全站 6 頁一致（原本 Dashboard/Settings 用 `text-2xl`、其他頁用 `text-3xl` 的不一致已修正）
- **卡片標題**（`CardTitle`）：`text-sm font-medium`（統計卡）或 `leading-none font-semibold`（一般卡片預設）
- **統計數字**：主要指標 `text-4xl font-bold tracking-tight`，次要指標 `text-2xl font-bold`（Dashboard 首張卡片刻意放大，做出主次層次，不是三個等重方塊，見 Components）
- **次要說明文字**：`text-sm text-muted-foreground` 或 `text-xs text-muted-foreground`

## Layout

沿用 Tailwind 預設間距尺度（無專案自訂 spacing token）。頁面容器統一 `container mx-auto px-4`，內容區塊用 `space-y-6`～`space-y-8` 做垂直節奏。統計卡片區塊多為 `grid grid-cols-2 md:grid-cols-4 gap-4`（手機 2 欄、桌面 4 欄），列表/表單區塊多為 `flex flex-col sm:flex-row` 響應式切換。無自訂斷點，使用 Tailwind 預設斷點（`sm`/`md`/`lg`）。

### Named Rules
**The Unequal Weight Rule.** 同一區塊裡最常被查看的指標（例如 Dashboard 的「本月支出」）給它比同組其他指標更大的字級/版位，不要把所有統計卡做成同尺寸、同權重的重複方塊——那是框架預設的偷懶結構，不是資訊優先級的呈現。

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
- **Internal Padding:** `py-5`（垂直）+ 子元件各自 `px-5`（Linear/Notion 密度收緊時從 `py-6`/`px-6` 調整，全站經由 Card 元件系統一次改到位）

### Badges
- **Style:** `rounded-md`，`px-2 py-0.5`，`text-xs font-medium`
- **Variants:** default（Quiet Violet 背景，只用在真正的主要動作/預設語意，不要當成「有底色的 badge」萬用選項）/ secondary（Whisper Gray）/ destructive（Warning Red）/ outline（透明背景 + 文字色邊框，類別色盤與狀態色 badge 的打底 variant）
- **狀態 Badge（啟用/自動續費等正向狀態）：** `variant="outline"` + `text-success` + `border-success/30`，不要用 `variant="default"`（那是 Quiet Violet，只保留給主要動作）
- **類別 Badge：** `variant="outline"` + `getCategoryColorStyle()` inline style，見 Colors → 類別色盤

### Inputs / Fields
- **Style:** 透明背景、1px Hairline Gray 邊框、`rounded-md`、`shadow-xs`
- **Focus:** border 轉 Focus Ring Gray + 3px 半透明 ring
- **Error:** `aria-invalid` 時邊框與 ring 轉 Warning Red

### Navigation
頂部橫向導覽列（`App.vue`）。`md`（768px）以上顯示完整文字 + Lucide icon（`size-4`）的水平連結列；`md` 以下收進漢堡選單（重用既有 `DropdownMenu`，觸發按鈕 `size-11` 符合 44px 觸控目標下限），選單內同樣圖示 + 文字，當前頁面文字轉強調色並加粗。桌面版當前頁面用 Whisper Gray 底色標示 active 狀態，無底線或其他強調樣式。

### Page Header
所有頁面標題統一走 `src/components/common/PageHeader.vue`：標題 + 可選說明文字在左，`actions` slot（按鈕/篩選器等）在右，窄螢幕自動堆疊成上下兩排（`flex-col sm:flex-row`）。新頁面一律用這個元件，不要重新手刻標題區塊。

### Subscription Service Logo
`SubscriptionCard` 服務圖示優先顯示官方品牌 logo（`simple-icons`，MIT 授權，`src/lib/brand-icons.ts`），用該品牌自己的顏色（例如 Netflix 紅、Spotify 綠），不套用系統中性色 — 這是唯一允許品牌色出現的地方，因為它代表的是「這是哪家公司的服務」這個事實，不是裝飾。目前收錄 Netflix、Spotify、YouTube、Apple、Google、GitHub、Notion、Dropbox、LINE、iCloud、Max、Alibaba Cloud、Cursor。找不到對應品牌時 fallback 到中性 Lucide icon（`Bot`/`Server`/`Smartphone`）。Amazon、Microsoft、Adobe、Disney、OpenAI 等品牌 simple-icons 已因商標考量下架，不手動補回，一律走 fallback。

### Floating Surfaces（Dialog / Dropdown / Select / Popover）
- **Dialog：** `shadow-lifted`，最外層浮動內容，配合半透明黑色遮罩（`bg-black/50`）與 fade + scale 進場動畫。
- **Dropdown Menu / Select / Popover：** `shadow-raised`，貼齊觸發元件的中量級浮動層，比 Dialog 輕但比靜態卡片明顯。

## Do's and Don'ts

### Do:
- **Do** 保持紅色（Warning Red）只用在破壞性操作與驗證錯誤，維持它的警示訊號強度。
- **Do** 讓 Quiet Violet 只落在「主要動作」語意角色（主按鈕、連結、focus ring），不擴散進狀態或類別標籤。
- **Do** 新的類別（訂閱或消費）不用手動指定顏色 — 丟進 `getCategoryColorStyle()`，色盤自動雜湊分配，同名類別跨領域自動一致。
- **Do** 正向狀態（啟用、自動續費、支出下降）用 `text-success`，跟 Warning Red 的警示語意分開，不要用中性 `secondary` 掩蓋掉「這是好事」的訊號。
- **Do** 新元件優先重用既有 `rounded-md`(8px)/`rounded-xl`(14px) 兩級圓角，不要引入第三種圓角尺度。
- **Do** 新頁面統計數字延續 `text-2xl font-bold` 的視覺重量，這是目前唯一算一致的字級用法。
- **Do** 新的互動元件（按鈕、可點卡片）用 `shadow-raised` token，浮動層（選單/彈窗）用 `shadow-raised`、Dialog 用 `shadow-lifted`，不要手刻新的陰影值。

### Don't:
- **Don't** 把 Warning Red 用在非警示/破壞性語境（例如純裝飾或當作一般強調色），會稀釋它的訊號意義。
- **Don't** 把 Quiet Violet 用在狀態或類別標籤上（例如「啟用」「自動續費」這類非主要動作的正向狀態）；它只代表「主要動作」，混用會讓使用者分不清哪個才是真正該點的按鈕。
- **Don't** 用 `-foreground` token（`--success-foreground`/`--warning-foreground`）當文字色搭配淡色/半透明背景 — 那組 token 是設計給「實心填色背景 + 深色文字」的場景，套在淡底色上對比度不夠（深色模式下幾乎看不到字，已在 Notifications 修過一次）。淡底色一律用飽和的 `text-success`/`text-warning`/`text-destructive` 本體色當文字。
- **Don't** 給靜態顯示內容（統計卡、標籤）加 hover 陰影/位移；那是在暗示不存在的可點擊行為。
- **Don't** 個別元件各自手刻陰影值追求「立體感」；一律用 `shadow-raised`/`shadow-lifted` 兩個 token。
- **Don't** 用動態組字串的方式產生 Tailwind class（`` `bg-category-${i}` ``）；Tailwind 的靜態掃描器看不到，永遠不會生成對應 utility。需要動態顏色一律走 CSS variable + inline `:style`。
