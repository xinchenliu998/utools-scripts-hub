<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BaseDialog from './common/BaseDialog.vue'
import FormItem from './common/FormItem.vue'
import FormInput from './common/FormInput.vue'
import IconButton from './common/IconButton.vue'
import { UI_ICONS } from '@/constants/ui'
import { useSettings, loadSettings, ButtonColors, DEFAULT_BUTTON_COLORS, OPTIONAL_EXCLUDE_FOLDERS } from '@/composables/useSettings'
import { zhCN, enUS, LOCALES, LOCALE_NAMES, type LocaleType } from '@/locales'

type SettingsTab = 'appearance' | 'exclude' | 'buttons'

const emit = defineEmits<{
  close: []
}>()

const {
  settings,
  updateDefaultExcludeFolders,
  updateThemeColor,
  updateButtonColor,
  resetSettings,
  setLocale
} = useSettings()

// 语言选项
const localeOptions = computed(() => [
  { value: LOCALES.zhCN, label: LOCALE_NAMES.zhCN },
  { value: LOCALES.enUS, label: LOCALE_NAMES.enUS },
])

// 获取当前语言的翻译
function t() {
  return settings.value.locale === 'en-US' ? enUS : zhCN
}

const activeTab = ref<SettingsTab>('appearance')
const themeColor = ref('')
const buttonColors = ref<ButtonColors>({ ...DEFAULT_BUTTON_COLORS })

// 可选的排除文件夹列表
const optionalExcludeFolders = [...OPTIONAL_EXCLUDE_FOLDERS]

// 自定义排除文件夹
const customExcludeInput = ref('')
const selectedExcludeFolders = ref<Set<string>>(new Set())

// 自定义文件夹列表（用于显示）
const customExcludeFolders = ref<string[]>([])

// 检查文件夹是否被选中
function isFolderExcluded(key: string): boolean {
  return selectedExcludeFolders.value.has(key)
}

// 切换文件夹选中状态
function toggleFolder(key: string) {
  if (selectedExcludeFolders.value.has(key)) {
    selectedExcludeFolders.value.delete(key)
  } else {
    selectedExcludeFolders.value.add(key)
  }
}

// 获取最终排除文件夹
function getFinalExcludeFolders(): string[] {
  const result = [...selectedExcludeFolders.value]
  return [...new Set([...result, ...customExcludeFolders.value])]
}

// 回车添加自定义文件夹
function handleAddCustomFolders() {
  if (!customExcludeInput.value.trim()) return

  const newFolders = customExcludeInput.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  // 添加到自定义文件夹列表
  const existing = new Set(customExcludeFolders.value)
  for (const folder of newFolders) {
    if (!existing.has(folder) && !optionalExcludeFolders.find(o => o.key === folder)) {
      customExcludeFolders.value.push(folder)
    }
  }

  // 清空输入框
  customExcludeInput.value = ''
}

// 删除自定义文件夹（需确认）
function handleDeleteCustomFolder(folder: string) {
  if (window.confirm(t().UI_MESSAGES.confirmDeleteCustomFolder.replace('${name}', folder))) {
    customExcludeFolders.value = customExcludeFolders.value.filter(f => f !== folder)
  }
}

onMounted(() => {
  loadSettings()
  themeColor.value = settings.value.themeColor
  buttonColors.value = { ...settings.value.buttonColors }

  // 初始化选中的排除文件夹
  selectedExcludeFolders.value = new Set(
    settings.value.defaultExcludeFolders.filter(
      folder => optionalExcludeFolders.find(o => o.key === folder)
    )
  )

  // 自定义排除（从配置加载已保存的）
  customExcludeFolders.value = settings.value.defaultExcludeFolders.filter(
    folder => !optionalExcludeFolders.find(o => o.key === folder)
  )
  customExcludeInput.value = ''
})

function handleSave() {
  updateThemeColor(themeColor.value)
  updateDefaultExcludeFolders(getFinalExcludeFolders())

  for (const [key, value] of Object.entries(buttonColors.value)) {
    updateButtonColor(key as keyof ButtonColors, value)
  }

  window.utools.showNotification(t().NOTIFICATIONS.saved)
  emit('close')
}

function handleCancel() {
  emit('close')
}

function handleReset() {
  resetSettings()
  themeColor.value = settings.value.themeColor
  buttonColors.value = { ...DEFAULT_BUTTON_COLORS }
  selectedExcludeFolders.value = new Set(
    OPTIONAL_EXCLUDE_FOLDERS.map(f => f.key)
  )
  customExcludeInput.value = ''
  window.utools.showNotification(t().NOTIFICATIONS.reset)
}

const colorLabels = computed(() => ({
  primary: t().BUTTON_COLOR_LABELS.primary,
  danger: t().BUTTON_COLOR_LABELS.danger,
  warning: t().BUTTON_COLOR_LABELS.warning,
  success: t().BUTTON_COLOR_LABELS.success,
  default: t().BUTTON_COLOR_LABELS.default,
}))

const tabs = computed(() => [
  { key: 'appearance' as const, label: t().TABS.appearance, icon: '🎨' },
  { key: 'exclude' as const, label: t().TABS.exclude, icon: '📁' },
  { key: 'buttons' as const, label: t().TABS.buttons, icon: '🔘' },
])
</script>

<template>
  <BaseDialog :title="t().DIALOG_TITLES.settings" @close="handleCancel">
    <!-- Tab 导航 - 放在 header slot -->
    <template #header>
      <div class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
    </template>

    <!-- Tab 内容 -->
    <template #default>
      <div class="tab-content">
        <!-- 外观 Tab -->
        <div v-show="activeTab === 'appearance'" class="tab-panel">
          <!-- 语言选择 -->
          <FormItem label="Language / 语言:">
            <select :value="settings.locale" @change="(e) => setLocale((e.target as HTMLSelectElement).value as LocaleType)" class="locale-select">
              <option v-for="opt in localeOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </FormItem>
          <FormItem :label="t().FORM_LABELS.themeColor">
            <div class="color-row">
              <input type="color" v-model="themeColor" class="color-picker" />
              <FormInput v-model="themeColor" placeholder="#58a4f6" class="color-input" />
              <span class="color-preview" :style="{ background: themeColor }"></span>
            </div>
          </FormItem>
        </div>

        <!-- 排除 Tab -->
        <div v-show="activeTab === 'exclude'" class="tab-panel">
          <p class="hint-text">{{ t().HINTS.excludeToggle }}</p>
          <div class="folder-grid">
            <!-- 可选文件夹：点击切换选中状态 -->
            <button
              v-for="folder in optionalExcludeFolders"
              :key="folder.key"
              :class="['folder-tag', { active: isFolderExcluded(folder.key) }]"
              @click="toggleFolder(folder.key)"
            >
              {{ folder.label }}
            </button>
            <!-- 自定义文件夹：点击删除 -->
            <button
              v-for="folder in customExcludeFolders"
              :key="folder"
              class="folder-tag custom active"
              @click="handleDeleteCustomFolder(folder)"
            >
              {{ folder }}
            </button>
          </div>
          <FormItem :label="t().FORM_LABELS.excludeCustom">
            <FormInput
              v-model="customExcludeInput"
              :placeholder="t().PLACEHOLDERS.excludeFoldersExample"
              @keydown.enter.prevent="handleAddCustomFolders"
            />
          </FormItem>
        </div>

        <!-- 按钮 Tab -->
        <div v-show="activeTab === 'buttons'" class="tab-panel">
          <div class="color-grid">
            <div v-for="(_, key) in buttonColors" :key="key" class="color-item">
              <span class="color-label">{{ colorLabels[key as keyof typeof colorLabels] }}</span>
              <div class="color-row compact">
                <input
                  type="color"
                  v-model="buttonColors[key as keyof ButtonColors]"
                  class="color-picker small"
                />
                <FormInput
                  v-model="buttonColors[key as keyof ButtonColors]"
                  :placeholder="DEFAULT_BUTTON_COLORS[key as keyof typeof DEFAULT_BUTTON_COLORS]"
                  class="color-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 底部按钮 -->
    <template #footer>
      <IconButton :icon="UI_ICONS.reset" :tooltip="t().UI_TOOLTIPS.reset" variant="default" @click="handleReset" />
      <IconButton :icon="UI_ICONS.cancel" :tooltip="t().UI_TOOLTIPS.cancel" variant="default" @click="handleCancel" />
      <IconButton :icon="UI_ICONS.save" :tooltip="t().UI_TOOLTIPS.save" variant="primary" @click="handleSave" />
    </template>
  </BaseDialog>
</template>

<style scoped>
/* Tab 导航 */
.tab-nav {
  display: flex;
  gap: 4px;
  padding: 12px 20px 0;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--btn-primary, #58a4f6);
}

.tab-btn.active {
  color: var(--btn-primary, #58a4f6);
  border-bottom-color: var(--btn-primary, #58a4f6);
}

.tab-icon {
  font-size: 14px;
}

/* 内容区域 */
.tab-content {
  padding: 20px;
}

.tab-panel {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.hint-text {
  font-size: 12px;
  color: #999;
  margin: 0 0 12px;
}

/* 颜色相关 */
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

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* 语言选择 */
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

/* 排除文件夹 */
.folder-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.folder-tag {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #333;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.folder-tag:hover {
  border-color: var(--btn-primary, #58a4f6);
  background: #f0f7ff;
}

.folder-tag.active {
  background: var(--btn-primary, #58a4f6);
  color: white;
  border-color: var(--btn-primary, #58a4f6);
}

/* 按钮颜色 */
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

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .tab-nav {
    border-bottom-color: #444;
  }

  .tab-btn {
    color: #bbb;
  }

  .color-picker {
    border-color: #555;
  }

  .color-preview {
    border-color: #555;
  }

  .folder-tag {
    background: #333;
    border-color: #555;
    color: #bbb;
  }

  .folder-tag.active {
    background: var(--btn-primary, #58a4f6);
    color: white;
  }

  .color-label {
    color: #bbb;
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

@media (max-width: 480px) {
  .color-grid {
    grid-template-columns: 1fr;
  }
}
</style>
