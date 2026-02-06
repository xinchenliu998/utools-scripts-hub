<script setup lang="ts">
import { ref, computed } from 'vue'
import { UI_SIZES } from '@/constants/ui'

const props = withDefaults(defineProps<{
  icon: string
  tooltip?: string
  variant?: 'primary' | 'danger' | 'warning' | 'success' | 'default'
  size?: number
  ariaLabel?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  borderRadius?: number | string
}>(), {
  variant: 'primary',
  size: UI_SIZES.buttonIcon,
  ariaLabel: '',
  tooltipPosition: 'bottom',
  borderRadius: UI_SIZES.borderRadius,
})

const emit = defineEmits<{
  click: []
}>()

const showTooltip = ref(false)

const buttonClass = computed(() => {
  return `icon-btn icon-btn--${props.variant}`
})

const buttonStyle = computed(() => {
  const borderRadius = typeof props.borderRadius === 'number'
    ? `${props.borderRadius}px`
    : props.borderRadius
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    borderRadius: borderRadius,
  }
})

const variantColors = {
  primary: 'var(--btn-primary)',
  danger: 'var(--btn-danger)',
  warning: 'var(--btn-warning)',
  success: 'var(--btn-success)',
  default: 'var(--btn-default)',
}

const tooltipStyle = computed(() => {
  return {
    '--btn-color': variantColors[props.variant],
  }
})

function handleClick() {
  emit('click')
}
</script>

<template>
  <div class="icon-button-wrapper" :style="tooltipStyle" @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false">
    <button :class="buttonClass" :style="buttonStyle" :aria-label="ariaLabel || tooltip || icon" @click="handleClick">
      {{ icon }}
    </button>
    <div v-if="tooltip && showTooltip" :class="['icon-tooltip', `icon-tooltip--${props.tooltipPosition}`]">
      {{ tooltip }}
    </div>
  </div>
</template>

<style scoped>
.icon-button-wrapper {
  position: relative;
  display: inline-block;
}

.icon-btn {
  padding: 0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background-color: var(--btn-color);
  color: white;
  font-size: 14px;
  line-height: 1;
  user-select: none;
}

.icon-btn:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.icon-btn--default {
  background-color: var(--btn-color);
}

.icon-tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 上方 */
.icon-tooltip--top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.icon-tooltip--top::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #333;
}

/* 下方 */
.icon-tooltip--bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.icon-tooltip--bottom::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: #333;
}

/* 左侧 */
.icon-tooltip--left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.icon-tooltip--left::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-left-color: #333;
}

/* 右侧 */
.icon-tooltip--right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.icon-tooltip--right::after {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-right-color: #333;
}

/* 左上 */
.icon-tooltip--top-left {
  bottom: calc(100% + 8px);
  right: 0;
}

.icon-tooltip--top-left::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 8px;
  border: 4px solid transparent;
  border-top-color: #333;
}

/* 右上 */
.icon-tooltip--top-right {
  bottom: calc(100% + 8px);
  left: 0;
}

.icon-tooltip--top-right::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 8px;
  border: 4px solid transparent;
  border-top-color: #333;
}

/* 左下 */
.icon-tooltip--bottom-left {
  top: calc(100% + 8px);
  right: 0;
}

.icon-tooltip--bottom-left::after {
  content: '';
  position: absolute;
  bottom: 100%;
  right: 8px;
  border: 4px solid transparent;
  border-bottom-color: #333;
}

/* 右下 */
.icon-tooltip--bottom-right {
  top: calc(100% + 8px);
  left: 0;
}

.icon-tooltip--bottom-right::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 8px;
  border: 4px solid transparent;
  border-bottom-color: #333;
}

@media (prefers-color-scheme: dark) {
  .icon-tooltip {
    background-color: #2d2d2d;
    border: 1px solid #555;
  }

  .icon-tooltip--top::after,
  .icon-tooltip--top-left::after,
  .icon-tooltip--top-right::after {
    border-top-color: #2d2d2d;
  }

  .icon-tooltip--bottom::after,
  .icon-tooltip--bottom-left::after,
  .icon-tooltip--bottom-right::after {
    border-bottom-color: #2d2d2d;
  }

  .icon-tooltip--left::after {
    border-left-color: #2d2d2d;
  }

  .icon-tooltip--right::after {
    border-right-color: #2d2d2d;
  }
}
</style>
