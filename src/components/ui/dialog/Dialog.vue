<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Teleport, Transition } from 'vue'

interface Props {
  open?: boolean
}

withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

defineOptions({ name: 'DialogComponent' })

const handleOverlayClick = () => {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click="handleOverlayClick"
      >
        <!-- 背景模糊層（淡入動畫） -->
        <div
          class="absolute inset-0 backdrop-blur-sm transform transition-opacity duration-300 ease-out"
          :style="{
            opacity: open ? 1 : 0,
          }"
        ></div>

        <!-- 遮罩層（透明度動畫） -->
        <div
          class="absolute inset-0 bg-black/50 transform transition-all duration-300 ease-out"
          :style="{
            opacity: open ? 1 : 0,
          }"
        ></div>

        <!-- 對話框內容 -->
        <div
          class="relative z-10 max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-background shadow-lg transform transition-all duration-300 ease-out delay-150"
          :class="open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
