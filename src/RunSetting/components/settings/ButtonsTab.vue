<script setup lang="ts">
import { computed } from 'vue'
import FormItem from '../common/FormItem.vue'
import FormInput from '../common/FormInput.vue'
import { useSettings, ButtonColors, DEFAULT_BUTTON_COLORS } from '@/composables/useSettings'
import { useI18n } from '@/utils/i18n'

const { settings, updateButtonColor } = useSettings()
const { t } = useI18n()

const colorLabels = computed(() => ({
  primary: t.BUTTON_COLOR_LABELS.primary,
  danger: t.BUTTON_COLOR_LABELS.danger,
  warning: t.BUTTON_COLOR_LABELS.warning,
  success: t.BUTTON_COLOR_LABELS.success,
  default: t.BUTTON_COLOR_LABELS.default,
}))
</script>

<template>
  <div class="buttons-tab">
    <div class="color-grid">
      <div
        v-for="(_, key) in settings.buttonColors"
        :key="key"
        class="color-item"
      >
        <span class="color-label">{{ colorLabels[key as keyof typeof colorLabels] }}</span>
        <div class="color-row compact">
          <input
            type="color"
            v-model="settings.buttonColors[key as keyof ButtonColors]"
            class="color-picker small"
          />
          <FormInput
            v-model="settings.buttonColors[key as keyof ButtonColors]"
            :placeholder="DEFAULT_BUTTON_COLORS[key as keyof typeof DEFAULT_BUTTON_COLORS]"
            class="color-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buttons-tab {
  animation: fadeIn 0.2s ease;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-label {
  font-size: 13px;
  color: #666;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-row.compact {
  gap: 8px;
}

.color-input {
  flex: 1;
}

.color-picker {
  width: 40px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
}

.color-picker.small {
  width: 32px;
  height: 28px;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-color-scheme: dark) {
  .color-picker {
    border-color: #555;
  }

  .color-label {
    color: #bbb;
  }
}

@media (max-width: 480px) {
  .color-grid {
    grid-template-columns: 1fr;
  }
}
</style>
