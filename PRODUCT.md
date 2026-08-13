# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

單一使用者：專案擁有者本人。個人工具，非多用戶產品，不考慮註冊流程、他人帳號、公開存取等場景。透過 Google SSO（Supabase Auth）登入，資料綁定單一帳號。

## Product Purpose

MoneyManager：個人訂閱與消費管理系統。追蹤個人訂閱服務（月繳/年繳、TWD/USD 混合）與日常消費紀錄，讓使用者看到正確的每月/每年實際花費，取代原本分散、容易算錯的人工記帳方式。

## Positioning

無對外定位需求。純自用工具，不與 Bobby、Rocket Money 等市售記帳/訂閱管理 app 競爭或做差異化訴求。

## Operating Context

- 登入：Google SSO（Supabase Auth），單一帳號
- 資料儲存：Supabase（PostgreSQL + RLS，綁 `auth.uid()`）
- 訂閱資料含幣別（TWD/USD）與週期（Monthly/Yearly），需正確換算月/年等值總額
- 主要工作流程：新增/編輯/刪除訂閱、查看儀表板總覽、檢視消費紀錄與支出報表
- 介面語言：繁體中文（台灣用語）

## Capabilities and Constraints

- 已完成：訂閱管理（CRUD 接 Supabase）、Google SSO 登入、路由保護、月/年正確換算邏輯（純函式 + 單元測試）
- 進行中/尚未接資料庫：Dashboard 訂閱花費區塊、Expense Records、Reports、Notifications、Settings 頁面（目前仍為假資料/靜態內容）
- 技術棧：Vue 3.5+ (Composition API)、TypeScript、shadcn-vue、Tailwind CSS 4、Vue Router、Vite、Supabase
- 單一使用者假設貫穿整個系統：無多租戶、無邀請/分享機制、無角色權限系統

## Brand Commitments

- 產品名稱：MoneyManager（訂閱與消費管理系統）
- 介面語言固定為繁體中文（台灣用語），非多語系產品

## Evidence on Hand

無外部佐證（無 testimonial、case study、市場數據）。個人工具，資料即使用者本人的真實訂閱與消費紀錄，開發階段用測試帳號驗證。

## Product Principles

1. 計算正確性優先於功能廣度 — 月/年花費換算是核心價值，寧可少做功能也要算對
2. 個人工具的簡單假設 — 不為未來可能的多用戶場景預先設計，Google SSO 單帳號就夠
3. 雙幣別是真實需求，不是邊角案例 — TWD/USD 訂閱並存，換算與顯示要一致對待
4. 漸進遷移 — 各頁面逐步從假資料換成真實 Supabase 資料，不要求一次到位
