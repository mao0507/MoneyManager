---
name: MoneyManager
description: 個人訂閱與消費管理系統
colors:
  primary-teal: "#2BA8A2"
  primary-light: "#3CC4BD"
  primary-dark: "#1E8C86"
  primary-bg: "#E8F6F5"
  accent-gold: "#FFD23F"
  accent-light: "#FFE47A"
  coral: "#EF6C4A"
  cream: "#FFF8E7"
  sky-blue: "#5DADE2"
  surface-base: "#EFF8F7"
  surface-card: "#FFFFFF"
  success: "#27AE60"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "normal"
    letterSpacing: "normal"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: "1.2"
    letterSpacing: "0.02em"
  display:
    fontFamily: "'Baloo 2', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: "1.2"
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.accent-gold}"
    textColor: "#1A1400"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.primary-bg}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-destructive:
    backgroundColor: "{colors.coral}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.lg}"
    padding: "20px"
  badge-default:
    backgroundColor: "{colors.accent-gold}"
    textColor: "#1A1400"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  input:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
---

# Design System: MoneyManager

## Overview

**World: Flip7**（teal-coral-gold，retro-playful）

於 2026-08 從原本的「安靜帳本」（黑白灰極簡）換世界，改採使用者指定的 Flip7 設計系統 — 一套為卡牌遊戲小程式打造的復古趣味風格。這是品牌換裝，不是產品邏輯換裝：計算正確性、資料結構、功能範圍全部不變，只換視覺語言。

**2026-08 第二輪「加碼」**：Flip7 色彩體系不動，補上換裝當時沒做滿的個性——品牌字（Baloo 2）、頁面大標題字重與 text-shadow、按鈕金色 CTA 的 gloss 高光層、卡片進場彈入 + 錯落延遲動畫、頁面底色的 teal/gold 光暈網格。一樣只動設計系統層（`style.css` + `PageHeader`/`Card`/`Button`/`App.vue` 品牌字），不逐頁重排版面結構。

**這次換裝的取捨（刻意的範圍決定，不是遺漏）：**
- Flip7 原規格書大量描述特定遊戲機制的元件（BOOM 按鈕、Flip7 加成按鈕、獲勝排行榜/領獎台、五彩紙屑動畫、皇冠彈跳動畫、復古緞帶 Logo）。這些在記帳工具裡沒有對應概念，直接跳過，不勉強嫁接。
- 保留並轉譯的是可通用的系統層：色彩角色、字級階層、圓角尺度、glow 陰影系統、按鈕/卡片/輸入框的形狀語言、彈跳過場曲線。
- 規格書用 `rpx`（WeChat 小程式單位），本專案是一般網頁（Vite + Tailwind），已依比例換算成 `rem`（8rpx 基準 ≈ 0.25rem）。
- 類別標籤色盤（8 色雜湊系統，`src/lib/category-colors.ts`）尚未重新調色配合 Flip7 主題，目前還是舊世界遺留的色相分佈。功能正常、對比度仍過關，只是視覺上還沒跟新色系融合，算已知落差。
- Dashboard/Subscriptions/Reports 等頁面本身尚未逐一走查套用新裝，這次換裝改的是設計系統層（`style.css` 的 CSS variable + shadcn 共用元件 Button/Badge/Card/Input），全站頁面透過共用 token 跟共用元件自動繼承新視覺，但個別頁面裡手刻的排版細節未來若要進一步貼合 Flip7 質感（例如卡片左側色條、玻璃感等），需要逐頁另外處理。

**Key Characteristics:**
- Teal（結構/資訊）+ Gold（主要動作/CTA）+ Coral（警示/破壞性）三色分工，不再是黑白灰配單一強調色
- 全面 pill 形狀（`rounded-full`）：按鈕、Badge 都是藥丸狀，只有 Ghost/Link 兩個非實體按鈕變體例外維持原本形狀
- Colored glow 陰影系統取代純黑陰影 — 每種互動元件的陰影都帶對應色相（CTA 按鈕金色 glow、危險操作珊瑚色 glow、卡片 teal 淡 glow）
- 字體堆疊改用系統字型 + 繁中字型 fallback（PingFang SC / Microsoft YaHei），標題走 extra-bold(800) + 字距加寬
- 按鈕統一用彈跳曲線 `cubic-bezier(0.34, 1.56, 0.64, 1)` + `active:scale-95`，是這次換裝唯一的「一個動作」——不是到處加動畫，是這套系統本身的簽名手感

## Colors

三色分工：Teal 是結構色（背景、標題文字、連結、focus ring），Gold 是行動色（CTA 按鈕、Badge 預設、中等警示），Coral 是破壞色（刪除、錯誤、高優先級）。三者不互相取代彼此角色。

### Primary — Accent Gold (#FFD23F)
驅動 shadcn 的 `--primary`：Button 預設/CTA 變體、Badge 預設變體。金色亮度高，文字一律用近黑暖色墨（`#1A1400`），不要用白字（對比不夠）。Hover 用 `--shadow-cta-glow`（`rgba(255,210,63,0.4)` 光暈），不是位移陰影。

### 結構色 — Primary Teal (#2BA8A2)
- `--foreground`/`--card-foreground` 用 Primary Dark (`#1E8C86`)：規格書明講這色是給「淺色底文字」用的，內文、標題都吃這個角色
- `--ring`（focus ring）與 `--sidebar-primary` 用 Primary Teal 本體：結構性回饋用結構色，不用金色，CTA 的訊號才不會被稀釋
- `--secondary`/`--muted` 用 Primary BG (`#E8F6F5`) 淡底 + Primary Dark 文字：次要按鈕、次要 Badge

### 語意色
- **Coral** (`#EF6C4A`)：`--destructive`，刪除、驗證錯誤、高優先級通知。白字（既有專案慣例，對比偏緊但跟 destructive 一貫維持一致）。Hover 用 `--shadow-destructive-glow`。
- **Success** (`#27AE60`)：正向狀態（啟用、自動續費、支出下降），沿用既有 `text-success` 模式（淡底 + 本體飽和色文字，不用 `-foreground` 配淡底，見舊版 Do/Don't 教訓）。
- **Warning**：沿用 Accent Gold 本體色，跟 CTA 共色但走淡底 + `text-warning` 文字模式，視覺角色不同（一個是按鈕填色，一個是淡底文字），不會混淆。

### 中性與表面
- `--background`：Surface Base (`#EFF8F7`)，全站底色是淡 teal 調，不是純白
- `--card`/`--popover`：Surface Card (`#FFFFFF`)，卡片維持純白跟底色區隔
- `--cream` (`#FFF8E7`)：Input 專用表面色，`bg-cream` class，不跟卡片共用純白
- `--border`/`--input`：淡 teal 灰（`#D7ECEA`），不是純中性灰

### Chart Colors
`chart-1` 到 `chart-5` 改用規格書調色盤重新分配：teal、gold、coral、sky-blue、teal-dark，五色都出自 Flip7 色板，涵蓋足夠的色相跨度做資料序列區分。

### 已知落差：類別色盤未跟進
`--category-1` 到 `--category-8`（訂閱/消費類別標籤色）維持舊世界的 OKLCH 色相分佈，沒有重新調色配合 Flip7 主題。功能正常（對比度、雜湊分配邏輯都沒問題），純粹是視覺基調還沒融合，留給下次處理。

## Typography

**Body Font:** `-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', ui-sans-serif, system-ui, sans-serif` — 規格書指定，加了正體中文字型 fallback，比原本純英文字堆疊更適合這個全繁中介面。

**Display Font:** `'Baloo 2', ` + body 字型堆疊（Google Fonts，圓潤有個性，字重 500-800）。這是加碼輪新增，用在品牌字（`App.vue` 的「MoneyManager」）跟 `PageHeader` 頁面大標題。**只影響 Latin/數字字符** — 中文字沒有對應字符，會自動 fallback 回 body 字型堆疊，視覺上不變。這是刻意的取捨：全繁中介面裡，一顆「有個性」的展示字體對中文標題本身沒有實質差異，真正吃到這顆字的地方是品牌名跟未來會出現的英文/數字內容。

**Character:** 標題 extra-bold(800) + 字距加寬 + 品牌字，比原本「安靜帳本」世界的克制字重更有存在感 — 這是換裝後的新個性，標題現在允許自己被看見。

### 階層
- **頁面標題**（`PageHeader`）：`text-3xl font-extrabold tracking-tight` + `--font-display` + 一層極淡 `text-shadow`（`--title-glow`，呼應規格書「7」數字的多層描邊效果，但收斂成一條低調陰影，不是漫畫式描邊）
- **品牌字**（`App.vue`）：`--font-display` + `font-extrabold` + `tracking-wide`，"Money" 中性色 / "Manager" teal 強調色雙色切分
- **Landing 頁大標**：`text-4xl font-bold`，尚未套用 `--font-display`（Landing.vue 是個別頁面檔案，這輪只動共用元件層，見 Overview 的範圍決定）
- **卡片標題**：不變，`text-sm font-medium`（統計卡）/ `leading-none font-semibold`（一般卡片）——`CardTitle` 這輪沒有套用 display font，保持跟內文一致的克制層級，展示字體只留給頁面級大標題
- **次要說明文字**：不變，`text-sm text-muted-foreground`

## Shapes

圓角改用固定 rem 尺度（不再從單一 `--radius` 用 calc 推導）：`sm`(4px) / `md`(8px) / `lg`(12px) / `xl`(16px)，加上 Tailwind 內建的 `rounded-full` 做 pill。

- **按鈕、Badge**：`rounded-full`（pill），規格書明講「Pill shape... bounce transition curve」
- **Card**：`rounded-lg`（12px），對應規格書「Feature cards, panels」尺度
- **Input**：`rounded-md`（8px）+ Cream 底色

## Elevation — Colored Glow System

取代原本「安靜帳本」的中性黑陰影，陰影本身帶對應元件的色相。

- `--shadow-cta-glow`：`0 6px 28px rgba(255,210,63,0.5), 0 2px 8px rgba(255,210,63,0.3)`，CTA 按鈕 hover 專用，加碼輪加大了 blur/spread，光暈更明顯
- `--shadow-destructive-glow`：`0 6px 28px rgba(239,108,74,0.42), 0 2px 8px rgba(239,108,74,0.25)`，危險操作按鈕 hover 專用
- `--shadow-card`：`0 4px 20px rgba(43,168,162,0.1)`，卡片預設陰影，teal 淡光暈取代純黑 `shadow-sm`
- `--elevation-raised`/`--elevation-lifted`：一般互動元件（次要按鈕、下拉選單）與浮動層（Dialog）維持 teal 調陰影，不是純黑
- `--title-glow`：`0 2px 0 rgba(30,60,58,0.1)`，`PageHeader` 標題專用的極淡 text-shadow，不是 box-shadow

**Do** 用這幾個 token，**Don't** 手刻新的純黑陰影值——規格書原文：「Don't use plain black shadows on interactive elements」。

## Components

### Buttons
- **Shape:** `rounded-full`（pill），Ghost/Link 兩個非填色變體例外維持 `rounded-md`/無圓角（純文字/hover 態，pill 形狀對它們沒有視覺意義）
- **Default（CTA）：** Accent Gold 背景 + 近黑暖色文字，hover 轉 `shadow-cta-glow`，`active:scale-95`，上半部疊一層白色漸層 gloss（`::before`，規格書原文「Gradient gold background, gloss overlay via ::before」的直接落地）
- **Destructive：** Coral 背景 + 白字，hover 轉 `shadow-destructive-glow`，`active:scale-95`
- **Secondary：** Primary BG 淡 teal 背景 + Primary Dark 文字
- **Outline/Ghost：** 不變（中性 hover 態）
- **過場曲線：** 全部按鈕統一 `cubic-bezier(0.34, 1.56, 0.64, 1)`（彈跳感），這是規格書「bounce transition curve」的直接落地，是這次換裝唯一刻意保留的「有點誇張」動效，其餘地方不加類似動畫

### Cards
- **Shape:** `rounded-lg`（12px）
- **Shadow:** `--shadow-card`（teal 淡光暈）取代純黑 `shadow-sm`
- **進場動畫：** 掛載時彈入（`card-pop` keyframe，`cubic-bezier(0.34,1.56,0.64,1)`，跟按鈕同一條彈跳曲線），同層級的卡片用 `:nth-of-type` 錯落延遲（0/60/120/180/220ms）。這是這輪加碼唯一的「頁面第一眼」動效——一次到位的進場，不是逐一 hover 才觸發的散落特效。`prefers-reduced-motion: reduce` 會關掉。
- 規格書原本的「6rpx 彩色左邊條」樣式（依狀態變色）尚未套用到 `SubscriptionCard`/`ExpenseCard`，這次只換了基礎 Card 元件的形狀跟陰影，個別卡片元件的細節裝飾留待下次

### Background Atmosphere
`body` 底色疊兩層極淡的 radial-gradient 光暈網格（左上 teal、右上 gold，10%/8% 不透明度，`background-attachment: fixed`），取代死板純色底，呼應規格書「retro warmth」的質地。深色模式下加大不透明度維持可見度。

### Inputs
- **Shape:** `rounded-md`（8px）
- **Background:** Cream (`#FFF8E7`)，不是透明或卡片白

### Badges
- **Shape:** `rounded-full`（pill）
- 其餘顏色角色邏輯不變（沿用「安靜帳本」時期建立的 category/success/warning 慣例，只是底層 token 換了值）

### Auth Split Panel（`AuthBrandPanel.vue`）
2026-08 第三輪新增，Landing/Login 兩頁共用的左側品牌面板：`md` 以上兩欄分割（左品牌／右內容），`md` 以下整個面板隱藏、單欄堆疊。左面板是 teal 漸層（`#1E8C86 → #2BA8A2`）+ 4 張抽象化「飄浮卡片」裝飾（旋轉的圓角矩形，用 primary/destructive 等既有 token 上色）——這是刻意抽象化呼應 Flip7 卡牌起源的手法，不是重現規格書裡字面的緞帶 Logo 或扇形疊卡（那些已在第一輪換裝時明確排除）。兩頁的內容區塊（右側）都用 `rounded-3xl` 容器 + `--shadow-lifted`，比原本「置中單欄」的版面現代。

## Do's and Don'ts

### Do:
- Do 用 colored glow shadow token（`--shadow-cta-glow`/`--shadow-destructive-glow`/`--shadow-card`）做互動元件的陰影，不要手刻純黑陰影。
- Do 讓 Gold 只落在「主要動作」角色（CTA 按鈕、Badge 預設），Teal 是結構色不是行動色，兩者不要混用角色。
- Do 新元件統一走 `rounded-full`（按鈕/Badge）或既有的 `sm/md/lg/xl` 四級圓角，不要引入第三種圓角尺度。
- Do 正向狀態用 `text-success`、警示用 `text-warning`／`text-destructive`，淡底配本體飽和色文字，不要用 `-foreground` token 配淡底背景（對比不夠，深色模式下尤其會看不到字）。
- Do Cream (`#FFF8E7`) 只用在 Input 表面，不要跟 Card 的純白背景混用。

### Don't:
- Don't 在互動元件用純黑陰影——glow 陰影系統是這套世界的核心識別特徵之一。
- Don't 把遊戲專屬機制（BOOM 狀態、獲勝慶祝、五彩紙屑、皇冠動畫、復古緞帶 Logo）硬套進記帳工具的 UI，這些沒有對應的產品概念，換裝時已刻意跳過。
- Don't 在非 CTA 的地方使用彈跳曲線動畫——這是按鈕的簽名手感，不是通用動效，用在別處會稀釋它的識別度。
- Don't 假設類別色盤（`category-1..8`）已經跟新色系融合——它還沒有，是已知的下一步。
