/**
 * 国际化配置入口 - vue-i18n 格式
 */

// 语言包
import zhCN from './zh-CN'
import enUS from './en-US'

// 语言类型
export type LocaleType = 'zh-CN' | 'en-US'

// 语言配置
export const LOCALES = {
  zhCN: 'zh-CN' as LocaleType,
  enUS: 'en-US' as LocaleType,
}

export const LOCALE_NAMES = {
  zhCN: '中文',
  enUS: 'English',
} as const

export const DEFAULT_LOCALE: LocaleType = 'zh-CN'

// vue-i18n 消息格式
export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

// 导出语言包供 vue-i18n 使用
export { zhCN, enUS }
