/**
 * i18n 工具函数
 * 提供统一的翻译函数，避免在各组件中重复定义
 */

import { reactive, watch } from 'vue'
import { zhCN, enUS, type LocaleType } from '@/locales'
import { useSettings } from '@/composables/useSettings'

// 语言映射
const LOCALE_MAP: Record<LocaleType, Record<string, any>> = {
  'zh-CN': zhCN as unknown as Record<string, any>,
  'en-US': enUS as unknown as Record<string, any>,
}

/**
 * 使用翻译函数的 composable
 * 返回当前语言的消息对象，可在模板和脚本中直接使用 t.xxx
 */
export function useI18n() {
  const { settings } = useSettings()

  // 使用 reactive 确保响应式更新
  const t = reactive(LOCALE_MAP[settings.value.locale])

  // 监听设置变化，更新翻译对象
  watch(() => settings.value.locale, (newLocale) => {
    Object.assign(t, LOCALE_MAP[newLocale])
  })

  return {
    t,
  }
}
