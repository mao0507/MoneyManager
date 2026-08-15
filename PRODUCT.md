# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

現階段：專案擁有者本人單人使用，透過 Google SSO（Supabase Auth）登入，資料綁定單一帳號。

未來方向：目標是能開放多人使用，但公開註冊/邀請制等具體形態尚未決定，等真的要動工時再定案。現階段的原則是「架構上不要寫死成單人」，不急著做完整多租戶功能。

## Product Purpose

MoneyManager：訂閱與消費管理系統。追蹤訂閱服務（月繳/年繳、TWD/USD 混合）與日常消費紀錄，讓使用者看到正確的每月/每年實際花費，取代原本分散、容易算錯的人工記帳方式。

## Positioning

無對外定位需求。現階段不與 Bobby、Rocket Money 等市售記帳/訂閱管理 app 競爭或做差異化訴求；若未來走向多人開放，屆時再重新評估定位。

## Operating Context

- 登入：Google SSO（Supabase Auth）
- 資料儲存：Supabase（PostgreSQL + RLS，綁 `auth.uid()`）——現有 RLS 設計本身是每個使用者資料互相隔離的，理論上對多人友善，真正的障礙在前端 composable 層（見 Capabilities and Constraints）
- 訂閱資料含幣別（TWD/USD）與週期（Monthly/Yearly），需正確換算月/年等值總額
- 主要工作流程：新增/編輯/刪除訂閱、查看儀表板總覽、檢視消費紀錄與支出報表
- 介面語言：繁體中文（台灣用語）

## Capabilities and Constraints

- 已完成：訂閱管理（CRUD 接 Supabase）、Google SSO 登入、全頁面路由保護、月/年正確換算邏輯（純函式 + 單元測試）
- 進行中/尚未接資料庫：Dashboard 訂閱花費區塊、Expense Records、Reports、Notifications、Settings 頁面（目前仍為假資料/靜態內容）
- 技術棧：Vue 3.5+ (Composition API)、TypeScript、shadcn-vue、Tailwind CSS 4、Vue Router、Vite、Supabase
- **已知的多人化障礙**：`useAuth`/`useSubscriptionData`/`useExpenseData` 目前是 module-level singleton 狀態（ref 宣告在 composable 函式外面），假設 runtime 裡只有一個使用者。這是刻意的技術債，不是疏漏——單人自用階段沒有理由為此增加複雜度，但之後要做多人時，這一層需要重新設計為 per-session 隔離。詳見 `docs/saas-readiness-review.md`。
- CI、集中式錯誤處理（`ErrorBoundary.vue` 已存在但未掛載）等工程基礎設施尚未補齊，見 `docs/saas-readiness-review.md`。

## Brand Commitments

- 產品名稱：MoneyManager（訂閱與消費管理系統）
- 介面語言固定為繁體中文（台灣用語），非多語系產品

## Evidence on Hand

無外部佐證（無 testimonial、case study、市場數據）。現階段資料即使用者本人的真實訂閱與消費紀錄，開發階段用測試帳號驗證。

## Product Principles

1. 計算正確性優先於功能廣度 — 月/年花費換算是核心價值，寧可少做功能也要算對
2. 架構不寫死成單人，但也不預先做完整多租戶 — 現階段服務一個使用者，寫程式時避免把「只有我」焊死進資料結構或狀態設計，但也不為了假設中的未來需求過度設計；真正要開放多人時再依當時定案的形態動工
3. 雙幣別是真實需求，不是邊角案例 — TWD/USD 訂閱並存，換算與顯示要一致對待
4. 漸進遷移 — 各頁面逐步從假資料換成真實 Supabase 資料，不要求一次到位；補資料層時同步補測試覆蓋
