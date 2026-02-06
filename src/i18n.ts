/**
 * vue-i18n 配置
 */

import { createI18n } from 'vue-i18n'
import { messages, DEFAULT_LOCALE } from '@/locales'

// 创建 i18n 实例
export const i18n = createI18n({
  legacy: false, // 必须设置为 false 以使用 Composition API
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})

export default i18n
