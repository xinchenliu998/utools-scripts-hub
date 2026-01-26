/**
 * UI相关常量配置
 */

export const UI_COLORS = {
  blue: "rgb(88, 164, 246)",
  orange: "#ff9800",
  green: "#4caf50",
  red: "#d32f2f",
  gray: "#999",
  darkGray: "#666",
  lightGray: "#ddd",
  white: "#fff",
  black: "#333",
} as const;

export const UI_SIZES = {
  buttonIcon: 28,
  buttonPadding: 8,
  borderRadius: 8,
  borderRadiusSmall: 4,
  gap: 12,
  gapSmall: 8,
} as const;

export const UI_MESSAGES = {
  confirmDeleteRule: "确定要删除这个规则吗？",
  confirmDeleteScript: "确定要删除这个脚本吗？",
  emptyRules: "还没有添加任何规则",
  emptyRulesHint: "点击上方按钮添加规则",
  emptyScripts: "还没有添加任何脚本",
  emptyScriptsHint: "点击上方按钮添加脚本或文件夹",
  noMatchRules: "没有找到匹配的规则",
  noMatchScripts: "没有找到匹配的脚本",
  searchHint: "尝试使用其他关键词搜索",
} as const;

export const UI_ICONS = {
  add: "+",
  edit: "✏️",
  delete: "🗑️",
  enable: "✓",
  disable: "⊘",
  help: "?",
  close: "×",
  folder: "📁",
  file: "📄",
  save: "💾",
  cancel: "↶",
  run: "▶",
  select: "📂",
} as const;

export const UI_TOOLTIPS = {
  addRule: "添加规则",
  addScript: "添加脚本/文件夹",
  edit: "编辑",
  delete: "删除",
  enable: "启用",
  disable: "禁用",
  help: "帮助",
  close: "关闭",
  save: "保存",
  cancel: "取消",
  run: "运行脚本 (Enter)",
  selectFile: "选择文件",
  selectFolder: "选择文件夹",
} as const;
