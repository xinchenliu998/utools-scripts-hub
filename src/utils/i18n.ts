/**
 * i18n 工具函数
 * 封装 vue-i18n 的 useI18n，提供统一的翻译函数
 */

import { useI18n as vueI18n } from 'vue-i18n'

/**
 * 使用翻译函数的 composable
 * 在模板中使用 t.xxx 或 t('key') 语法
 *
 * 键名使用点号分隔的嵌套路径：
 * - ui.messages.confirmDeleteRule
 * - ui.tooltips.edit
 * - ui.tabs.scripts
 */
export function useI18n() {
  const { t, locale } = vueI18n()

  // 返回包装后的 t 函数和 locale
  return {
    t,
    locale,
  }
}
