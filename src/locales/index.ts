/**
 * 国际化配置入口
 */

// 语言包
import * as zhCN from './zh-CN';
import * as enUS from './en-US';

// 语言类型
export type LocaleType = 'zh-CN' | 'en-US';

// 语言配置
export const LOCALES = {
  zhCN: 'zh-CN' as LocaleType,
  enUS: 'en-US' as LocaleType,
};

export const LOCALE_NAMES = {
  zhCN: '中文',
  enUS: 'English',
} as const;

export const DEFAULT_LOCALE: LocaleType = 'zh-CN';

// 语言包映射
const localeMap: Record<LocaleType, Record<string, any>> = {
  'zh-CN': zhCN as unknown as Record<string, any>,
  'en-US': enUS as unknown as Record<string, any>,
};

// 当前语言
let currentLocale: LocaleType = DEFAULT_LOCALE;

// 获取当前语言消息
export function getLocaleMessages() {
  return localeMap[currentLocale];
}

// 切换语言
export function setLocale(locale: LocaleType) {
  currentLocale = locale;
}

// ==================== 默认语言导出（中文）====================
// 这些导出会随语言切换而改变
export const UI_MESSAGES: typeof zhCN.UI_MESSAGES & { confirmDeleteCustomFolder?: string } = {
  ...zhCN.UI_MESSAGES,
  confirmDeleteCustomFolder: zhCN.UI_MESSAGES.confirmDeleteCustomFolder || zhCN.UI_MESSAGES.confirmDeleteRule,
};
export const UI_TOOLTIPS: typeof zhCN.UI_TOOLTIPS = zhCN.UI_TOOLTIPS;
export const TABS: typeof zhCN.TABS = zhCN.TABS;
export const BUTTON_COLOR_LABELS: typeof zhCN.BUTTON_COLOR_LABELS = zhCN.BUTTON_COLOR_LABELS;
export const DIALOG_TITLES: typeof zhCN.DIALOG_TITLES = zhCN.DIALOG_TITLES;
export const DIALOG_OPTIONS: typeof zhCN.DIALOG_OPTIONS = zhCN.DIALOG_OPTIONS;
export const FORM_LABELS: typeof zhCN.FORM_LABELS = zhCN.FORM_LABELS;
export const PLACEHOLDERS: typeof zhCN.PLACEHOLDERS = zhCN.PLACEHOLDERS;
export const NOTIFICATIONS: typeof zhCN.NOTIFICATIONS = zhCN.NOTIFICATIONS;
export const STATUS_LABELS: typeof zhCN.STATUS_LABELS = zhCN.STATUS_LABELS;
export const LOADING: typeof zhCN.LOADING = zhCN.LOADING;
export const ERRORS: typeof zhCN.ERRORS = zhCN.ERRORS;
export const FORM_LABELS_EXTRA: typeof zhCN.FORM_LABELS_EXTRA = zhCN.FORM_LABELS_EXTRA;
export const HINTS: typeof zhCN.HINTS = zhCN.HINTS;
export const A11Y_LABELS: typeof zhCN.A11Y_LABELS = zhCN.A11Y_LABELS;
export const RULE_TEMPLATES: typeof zhCN.RULE_TEMPLATES = zhCN.RULE_TEMPLATES;

// ==================== 语言包导出（带前缀）====================
export { zhCN, enUS };
