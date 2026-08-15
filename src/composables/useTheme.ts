import { useDark, useToggle } from '@vueuse/core'

// 模組層級單例 - 避免多處呼叫 useDark() 各開一份 class 監聽互相打架
export const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  storageKey: 'wattvision-theme',
  initialValue: 'light', // 參考圖是淺色版側邊欄面板，這是現在的主打模式，深色為替代方案
})

export const toggleDark = useToggle(isDark)
