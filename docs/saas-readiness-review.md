# SaaS Readiness Review — MonthlyTracker

日期：2026-08-15
範圍：整個專案架構，從「未來要能多人使用」的角度審視現況落差。
方法：不做決策，只列發現與建議；分級供之後排優先序，實際動手交給後續 spec/tickets。

## 現況定位

專案目前明確是單人自用工具，`PRODUCT.md` 白紙黑字寫「非多用戶產品，不考慮註冊流程、他人帳號」，且 Product Principle #2 明講「不為未來可能的多用戶場景預先設計」。

這份文件的定調本身就是本次審視最大的落差來源——不是因為文件寫錯，而是因為專案方向變了（見下方「與 PRODUCT.md 的衝突」）。以下發現都是站在「以後要開放多人」這個新方向去檢查現有架構卡在哪。

## 分級標準

- **P0** — 之後要走多人一定會撞到的架構死結，或現階段就存在的信任/資安問題。越晚處理，改動範圍越大。
- **P1** — 不是這階段必須做，但成本會隨時間累積，建議儘早排入。
- **P2** — 現階段（單人自用）不影響任何人，等真的要做多租戶那天再處理即可。

---

## 發現

### 1. 路由未做認證閘（P0，已修復）

`src/router/index.ts` 只有 `/subscriptions` 設了 `meta.requiresAuth: true`，Dashboard、Reports、通知、消費紀錄、設定五個頁面都沒有。未登入使用者可以直接開啟這些頁面。

進一步查證：`useSubscriptionData`（真的接 Supabase 的部分）未登入時 `originalItems` 保持空陣列，沒有真正的資料外洩；但 `useExpenseData.ts` 是寫死的假消費紀錄（午餐、Uber 車費等），未登入也照樣渲染，畫面上完全看不出是假資料，使用者會誤以為那是自己的真實紀錄。

**性質：UX/信任問題，不是資料庫層外洩。** 已在本次一併修復（commit `8afc412`），五個頁面補上 `requiresAuth: true`。

### 2. 狀態架構是 module-level singleton，不是 per-user（P0）

`useAuth.ts`、`useSubscriptionData.ts`、`useExpenseData.ts` 的核心 ref（`session`/`user`/`originalItems`/`originalExpenses` 等）都宣告在 `export function useXxx()` **外面**，是模組層級的單例，不是每次呼叫都拿到獨立實例。

單人自用下完全沒問題（本來就只有一個帳號在用）。但這是往多人走時最根本的結構性障礙——現在的寫法假設「這個 JS runtime 裡只會有一個使用者」，之後要支援多人時，這批 composable 需要重新設計成 per-session 或搭配某種 store/context 隔離，不是加幾個 if 就能解決。

**建議**：不用現在改。但之後真的要做多人時，這是第一個要重寫的層，先在心裡（或 ADR）記下來，避免之後又在這個模式上疊代更多功能，讓改動範圍越滾越大。

### 3. 資料層完整度不一——只有訂閱是真的（P0/P1）

只有 `subscriptions` 一張表接了 Supabase，且 RLS 完整（`auth.uid() = user_id`）。Expense Records、Dashboard 的部分區塊、Reports、Notifications、Settings 全部是寫死的假資料或靜態內容，`PRODUCT.md` 自己也承認（「進行中/尚未接資料庫」）。

**為何是 P0/P1 而非單純 P2**：這不只是「功能沒做完」，而是假資料完全沒有使用者隔離的概念——如果之後直接在假資料上疊加多人邏輯，會把「單人假設」焊死得更深。晚一天處理，遷移成本晚一天疊加。

**建議**：Expense Records 若要繼續往下做，直接比照 `subscriptions` 的模式（Supabase 表 + RLS + composable 依 `user_id` 撈資料），不要在假資料上加功能。

### 4. 完全沒有 CI（P1）

repo 沒有 `.github/workflows` 或任何 CI 設定。目前靠人工跑 `vue-tsc`/`vitest`。單人自用下影響有限，但既然目標是「以後要對外」，CI 是最低成本、最快能補的一項——一個 push 後自動跑 typecheck + test 的 workflow，成本幾乎為零。

### 5. 測試覆蓋集中在少數幾個模組（P1/P2）

現有 5 個 vitest spec 檔（`useAuth`、`useSubscriptionData`、`chart-data`、`subscription-calc`、`utils`），涵蓋計算邏輯與訂閱資料流。**`useExpenseData.ts` 完全沒有測試**，元件層（`.vue` 檔）也沒有任何測試。單人自用下這是可接受的取捨；但若第 3 點（補齊 Expense 資料層）動工，應該同步補測試，不要重演訂閱模組「先做完、code review 才抓出 8 個 bug」的路。

### 6. 沒有集中式錯誤處理/監控（P1）

`src/components/common/ErrorBoundary.vue` 已經寫好但**零使用**，沒有掛在任何地方。錯誤處理是每頁各自土法煉鋼的 `error.value`/`submitError` pattern（例如 `Subscriptions.vue`、`ExpenseRecords.vue`）。沒有任何形式的前端錯誤上報（Sentry 之類）或 `window.onerror` 兜底。

單人自用時「壞了自己會發現」還撐得住；一旦有其他使用者，壞掉沒人知道就是真正的產品問題。建議至少把已經寫好的 `ErrorBoundary.vue` 掛到 `App.vue` 頂層，這是現成的、成本極低的第一步。

### 7. Auth 模型沒有角色/團隊概念，也沒有防濫用機制（P2）

只有 Google SSO 單一登入方式，沒有 role/admin/team/organization 概念，沒有 rate limiting。這階段（單人自用，最終形態未定）刻意不決定角色權限模型是合理的——過早設計角色系統，形態一變就要重打。列為 P2，等真的要做多租戶、且決定好是公開註冊還是邀請制之後，再一併設計。

### 8. 沒有計費/方案概念（P2）

程式碼裡完全沒有 pricing tier、feature flag、usage limit 的痕跡（`SubscriptionItem.plan` 是使用者自己追蹤的訂閱方案名稱，例如「Netflix Premium」，跟 app 本身的計費無關，不要混淆）。這階段不需要，等多人形態底定、且真的要商業化時再處理。

### 9. `PRODUCT.md` 與新方向直接衝突（P0，本次一併重寫）

現行 `PRODUCT.md` 明確寫「非多用戶產品」「不為未來可能的多用戶場景預先設計」。既然方向已定調為「現在單人、未來要能多人」，這份文件需要反映新方向，否則之後任何人（包含之後的我）依這份文件做決策都會往錯的方向走。已在本次一併重寫，見下方新版草稿。

---

## 優先順序總覽

| # | 發現 | 分級 | 狀態 |
|---|---|---|---|
| 1 | 路由未做認證閘 | P0 | 已修復（commit `8afc412`） |
| 9 | PRODUCT.md 定調衝突 | P0 | 已重寫（見下方草稿） |
| 2 | Module-level singleton 狀態 | P0 | 待未來多人動工時處理，先記錄不動 |
| 3 | Expense 資料層仍是假資料 | P0/P1 | 待排 spec |
| 4 | 無 CI | P1 | 待排 spec，成本低優先做 |
| 6 | 無集中式錯誤處理 | P1 | 待排 spec，掛 ErrorBoundary 成本低優先做 |
| 5 | 測試覆蓋不均 | P1/P2 | 跟第 3 點綁在一起做 |
| 7 | Auth 角色/防濫用 | P2 | 多租戶形態底定後再做 |
| 8 | 計費/方案 | P2 | 商業化階段再做 |

---

## 下一步

這份報告的發現會拆成 spec（`/mattpocock-skills:to-spec`），優先處理 P0/P1 裡成本低、價值高的項目（CI、ErrorBoundary 掛載、Expense 資料層 + 測試補齊）。Module-level singleton 重構（#2）跟角色/計費（#7、#8）暫不進 spec，等多人形態真的要動工時再回頭處理。
