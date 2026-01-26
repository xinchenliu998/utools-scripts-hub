<script setup lang="ts">
import { ref } from 'vue'
import { UI_ICONS, UI_TOOLTIPS } from '@/constants/ui'
import IconButton from '@/RunSetting/components/common/IconButton.vue'

defineProps<{
  content?: string
}>()

const buttonRef = ref<HTMLElement | null>(null)
const tooltipStyle = ref({ top: '0px', right: '0px' })

function handleMouseEnter() {
  if (!buttonRef.value) return
  
  const buttonRect = buttonRef.value.getBoundingClientRect()
  const spacing = 8
  
  // 计算提示框位置：按钮下方，右对齐，但离右边缘至少 20px
  const right = Math.max(20, window.innerWidth - buttonRect.right)
  const top = buttonRect.bottom + spacing
  
  tooltipStyle.value = {
    top: `${top}px`,
    right: `${right}px`,
  }
}
</script>

<template>
  <div class="help-tooltip" ref="buttonRef" @mouseenter="handleMouseEnter">
    <IconButton :icon="UI_ICONS.help" variant="default" aria-label="帮助" />
    <div class="tooltip-content" :style="tooltipStyle">
      <slot>{{ content }}</slot>
    </div>
  </div>
</template>

<style scoped>
.help-tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  max-width: 280px;
  background-color: #333;
  color: #fff;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  white-space: normal;
  width: 280px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
  box-sizing: border-box;
}

.tooltip-content :deep(code) {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.help-tooltip:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}

@media (prefers-color-scheme: dark) {
  .tooltip-content {
    background-color: #2d2d2d;
    border: 1px solid #555;
  }
}
</style>
