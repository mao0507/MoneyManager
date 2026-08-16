import { createApp } from 'vue'
import './style.css'
import 'vue-sonner/style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

// 動態設置頁面標題
router.afterEach((to) => {
  const title = to.meta?.title as string
  if (title) {
    document.title = `${title} - MoneyManager`
  } else {
    document.title = 'MoneyManager - 訂閱與消費管理系統'
  }
})

app.mount('#app')
