# SubManager - 訂閱管理應用

一個現代化的訂閱服務管理應用，使用 Vue 3 + TypeScript + shadcn-vue 構建。

## ✨ 功能特色

- 📊 **儀表板** - 訂閱服務總覽和統計
- 📋 **訂閱管理** - 完整的訂閱服務管理功能
- 📈 **報表分析** - 詳細的支出分析和趨勢報告
- 🔔 **通知中心** - 智能通知管理
- ⚙️ **設定中心** - 個人化設定選項

## 🚀 技術棧

- **前端框架**: Vue 3.5+ (Composition API)
- **類型系統**: TypeScript 5.8+
- **UI 組件**: shadcn-vue + Tailwind CSS 4.1+
- **路由管理**: Vue Router 4.5+
- **構建工具**: Vite 7.0+
- **代碼品質**: ESLint + Prettier

## 📦 安裝與運行

### 環境要求

- Node.js >= 22.12.0
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用將在 `http://localhost:5173` 啟動

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 🏗️ 專案結構

```
src/
├── components/          # 組件目錄
│   ├── common/         # 通用組件
│   └── ui/            # shadcn-vue UI 組件
├── composables/        # Vue 組合式函數
├── lib/               # 工具函數
├── pages/             # 頁面組件
├── router/            # 路由配置
├── types/             # TypeScript 類型定義
└── style.css          # 全局樣式
```

## 🎨 設計系統

本專案使用 shadcn-vue 設計系統，提供：

- 一致的視覺設計
- 響應式佈局
- 深色/淺色主題支持
- 無障礙設計

## 📱 頁面功能

### Dashboard
- 訂閱服務總覽
- 快速統計數據
- 最近付款記錄
- 即將到期提醒

### Subscriptions
- 訂閱服務列表
- 搜尋和篩選
- 添加/編輯/刪除訂閱
- 網格/列表視圖切換

### Reports
- 支出趨勢分析
- 類別分佈圖表
- 供應商分析
- 數據匯出功能

### Notifications
- 通知設定管理
- 通知歷史記錄
- 未讀通知計數
- 通知偏好設定

### Settings
- 個人資料設定
- 應用偏好設定
- 數據管理選項
- 主題切換

## 🔧 開發指南

### 添加新頁面

1. 在 `src/pages/` 創建頁面組件
2. 在 `src/router/index.ts` 添加路由
3. 在 `src/App.vue` 添加導航項目

### 添加新組件

1. 在 `src/components/` 創建組件
2. 使用 `defineOptions` 定義組件名稱
3. 遵循 shadcn-vue 設計規範

### 類型定義

所有類型定義統一在 `src/types/index.ts` 中管理，確保類型安全。

## 🚀 性能優化

- 代碼分割和懶加載
- 組件級別的錯誤邊界
- 響應式數據管理
- 構建優化配置

## 📄 許可證

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 支持

如有問題，請提交 Issue 或聯繫開發團隊。