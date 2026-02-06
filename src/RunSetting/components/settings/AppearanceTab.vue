<script setup lang="ts">
import { computed } from 'vue'
import FormItem from '../common/FormItem.vue'
import FormInput from '../common/FormInput.vue'
import { LOCALES, LOCALE_NAMES, type LocaleType } from '@/locales'
import { useI18n } from '@/utils/i18n'
import { useSettings } from '@/composables/useSettings'

const { settings, setLocale } = useSettings()
const { t } = useI18n()

// 语言选项
const localeOptions = computed(() => [
  { value: LOCALES.zhCN, label: LOCALE_NAMES.zhCN },
  { value: LOCALES.enUS, label: LOCALE_NAMES.enUS },
])

function handleLocaleChange(e: Event) {
  const target = e.target as HTMLSelectElement
  setLocale(target.value as LocaleType)
}
</script>

<template>
  <div class="appearance-tab">
    <FormItem label="Language / 语言:">
      <select :value="settings.locale" @change="handleLocaleChange" class="locale-select">
        <option v-for="opt in localeOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </FormItem>
    <FormItem :label="t('ui.formLabels.themeColor')">
      <div class="color-row">
        <input type="color" v-model="settings.themeColor" class="color-picker" />
        <FormInput
          v-model="settings.themeColor"
          placeholder="#58a4f6"
          class="color-input"
        />
        <span class="color-preview" :style="{ background: settings.themeColor }"></span>
      </div>
    </FormItem>
  </div>
</template>

<style scoped>
.appearance-tab {
  animation: fadeIn 0.2s ease;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
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

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.locale-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  cursor: pointer;
}

.locale-select:focus {
  outline: none;
  border-color: var(--btn-primary, #58a4f6);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-color-scheme: dark) {
  .color-picker {
    border-color: #555;
  }

  .color-preview {
    border-color: #555;
  }

  .locale-select {
    background-color: #333;
    border-color: #555;
    color: #fff;
  }

  .locale-select:focus {
    border-color: var(--btn-primary, #58a4f6);
  }
}
</style>
