import { ref, computed } from 'vue';
import { DEFAULT_LOCALE, LOCALES, type LocaleType } from '@/locales';
import { i18n } from '@/i18n';

export interface ButtonColors {
  primary: string;
  danger: string;
  warning: string;
  success: string;
  default: string;
}

export interface Settings {
  /** 语言 */
  locale: LocaleType;
  /** 默认排除的文件夹列表 */
  defaultExcludeFolders: string[];
  /** 主题色 */
  themeColor: string;
  /** 按钮颜色配置 */
  buttonColors: ButtonColors;
}

// 切换语言（同时更新 vue-i18n）
export function setLocaleExported(locale: LocaleType) {
  (i18n.global.locale as any).value = locale;
  settings.value.locale = locale;
  saveSettings();
}

export const DEFAULT_BUTTON_COLORS: ButtonColors = {
  primary: '#58a4f6',
  danger: '#d32f2f',
  warning: '#ff9800',
  success: '#4caf50',
  default: '#999999',
};

// 可选的排除文件夹列表
export const OPTIONAL_EXCLUDE_FOLDERS = [
  { key: '.git', label: '.git' },
  { key: 'node_modules', label: 'node_modules' },
  { key: '__pycache__', label: '__pycache__' },
  { key: '.venv', label: '.venv' },
  { key: 'venv', label: 'venv' },
  { key: 'dist', label: 'dist' },
  { key: 'build', label: 'build' },
  { key: '.idea', label: '.idea' },
  { key: '.vscode', label: '.vscode' },
  { key: 'target', label: 'target' },
  { key: '.gradle', label: '.gradle' },
] as const;

const DEFAULT_SETTINGS: Settings = {
  locale: DEFAULT_LOCALE,
  defaultExcludeFolders: OPTIONAL_EXCLUDE_FOLDERS.map(f => f.key),
  themeColor: '#58a4f6',
  buttonColors: { ...DEFAULT_BUTTON_COLORS },
};

const settings = ref<Settings>({ ...DEFAULT_SETTINGS });

// 加载设置（从 config 中读取）
export function loadSettings() {
  try {
    const config = window.services.readConfig() as any;
    if (config && config.settings) {
      settings.value = { ...DEFAULT_SETTINGS, ...config.settings };
      // 确保 buttonColors 完整
      if (!settings.value.buttonColors) {
        settings.value.buttonColors = { ...DEFAULT_BUTTON_COLORS };
      }
    }
    applyColors();
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
}

// 应用颜色到 CSS 变量
export function applyColors() {
  const colors = settings.value.buttonColors;
  document.documentElement.style.setProperty('--btn-primary', colors.primary);
  document.documentElement.style.setProperty('--btn-danger', colors.danger);
  document.documentElement.style.setProperty('--btn-warning', colors.warning);
  document.documentElement.style.setProperty('--btn-success', colors.success);
  document.documentElement.style.setProperty('--btn-default', colors.default);
  document.documentElement.style.setProperty('--blue', settings.value.themeColor);
}

// 保存设置（合并到 config 中）
export function saveSettings() {
  try {
    let config = window.services.readConfig() as any;
    if (!config) {
      config = {};
    }
    config.settings = settings.value;
    window.services.saveConfig(config);
    applyColors();
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
}

// 重置设置
export function resetSettings() {
  settings.value = { ...DEFAULT_SETTINGS };
  return saveSettings();
}

// 更新默认排除文件夹
export function updateDefaultExcludeFolders(folders: string[]) {
  settings.value.defaultExcludeFolders = folders;
  return saveSettings();
}

// 更新主题色
export function updateThemeColor(color: string) {
  settings.value.themeColor = color;
  return saveSettings();
}

// 更新按钮颜色
export function updateButtonColor(variant: keyof ButtonColors, color: string) {
  settings.value.buttonColors[variant] = color;
  return saveSettings();
}

// 获取默认排除文件夹
export function getDefaultExcludeFolders(): string[] {
  return settings.value.defaultExcludeFolders;
}

// 获取按钮颜色
export function getButtonColors(): ButtonColors {
  return settings.value.buttonColors;
}

// 导出设置
export function useSettings() {
  return {
    settings: computed(() => settings.value),
    loadSettings,
    saveSettings,
    resetSettings,
    updateDefaultExcludeFolders,
    updateThemeColor,
    updateButtonColor,
    getDefaultExcludeFolders,
    getButtonColors,
    DEFAULT_BUTTON_COLORS,
    setLocale: setLocaleExported,
    LOCALES,
  };
}

// 初始化时加载设置（延迟执行，确保 services 已准备好）
function tryLoadSettings() {
  if (typeof window !== 'undefined' && window.services) {
    loadSettings();
    applyColors();
  }
}

// 初始尝试加载
tryLoadSettings();

// 监听 services 准备就绪
if (typeof window !== 'undefined') {
  const checkServices = setInterval(() => {
    if (window.services) {
      clearInterval(checkServices);
      loadSettings();
      applyColors();
    }
  }, 50);

  // 1秒后停止检查
  setTimeout(() => {
    clearInterval(checkServices);
  }, 1000);
}
