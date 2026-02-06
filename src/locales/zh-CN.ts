/**
 * 中文语言包
 */

// ==================== UI 常量 ====================

export const UI_MESSAGES = {
  confirmDeleteRule: '确定要删除这个规则吗？',
  confirmDeleteScript: '确定要删除这个脚本吗？',
  confirmDeleteCustomFolder: '确定要取消排除文件夹 "${name}" 吗？',
  emptyRules: '还没有添加任何规则',
  emptyRulesHint: '点击上方按钮添加规则',
  emptyScripts: '还没有添加任何脚本',
  emptyScriptsHint: '点击上方按钮添加脚本或文件夹',
  noMatchRules: '没有找到匹配的规则',
  noMatchScripts: '没有找到匹配的脚本',
  searchHint: '尝试使用其他关键词搜索',
} as const;

export const UI_TOOLTIPS = {
  addRule: '添加规则',
  addScript: '添加脚本/文件夹',
  edit: '编辑',
  editRule: '编辑规则',
  editScript: '编辑脚本',
  delete: '删除',
  enable: '启用',
  disable: '禁用',
  help: '帮助',
  close: '关闭',
  save: '保存',
  cancel: '取消',
  reset: '重置',
  run: '运行脚本 (Enter)',
  selectFile: '选择文件',
  selectFolder: '选择文件夹',
} as const;

// ==================== Tab 配置 ====================

export const TABS = {
  scripts: '脚本管理',
  rules: '规则配置',
  appearance: '外观',
  exclude: '排除',
  buttons: '按钮',
} as const;

// ==================== 按钮颜色标签 ====================

export const BUTTON_COLOR_LABELS = {
  primary: '主要',
  danger: '危险',
  warning: '警告',
  success: '成功',
  default: '默认',
} as const;

// ==================== 对话框标题 ====================

export const DIALOG_TITLES = {
  settings: '设置',
  addRuleTitle: '添加规则',
  editRuleTitle: '编辑规则',
  addScriptTitle: '添加脚本/文件夹',
  editScriptTitle: '编辑脚本',
} as const;

// 对话框选项
export const DIALOG_OPTIONS = {
  selectFile: {
    title: '选择文件',
    buttonLabel: '选择',
  },
  selectFolder: {
    title: '选择文件夹',
    buttonLabel: '选择',
  },
} as const;

// ==================== 表单标签 ====================

export const FORM_LABELS = {
  themeColor: '主题色：',
  excludeCustom: '自定义：',
  ruleName: '规则名称：',
  rulePattern: '匹配模式（正则表达式）：',
  rulePatternHint: '用于匹配文件名或后缀的正则表达式',
  ruleApp: '指定应用（可选）：',
  ruleAppHint: '留空则使用默认方式执行脚本',
  ruleArgs: '参数（可选，空格分隔）：',
  ruleDescription: '描述（可选）：',
  scriptName: '名称：',
  scriptPath: '路径：',
  scriptFolderPath: '文件夹路径',
  scriptFilePath: '脚本路径',
  scriptFolder: '文件夹',
  scriptRecursive: '嵌套',
  scriptExclude: '排除：',
  scriptDescriptionLabel: '描述：',
} as const;

// ==================== 占位符 ====================

export const PLACEHOLDERS = {
  selectFile: '选择文件',
  selectFolder: '选择文件夹',
  scriptName: '脚本名称',
  ruleName: '规则名称',
  rulePattern: '例如: \\.js$',
  ruleApp: '例如: node, python, powershell',
  ruleArgs: '例如: -ExecutionPolicy Bypass -File',
  scriptDescription: '脚本描述（可选）',
  excludeFolders: '多个用逗号分隔',
  searchRule: '搜索规则（名称、模式、应用、描述）',
  searchScript: '搜索脚本（名称、路径、描述、关键词）',
  searchScriptRun: '输入文件名或关键字搜索脚本...',
  excludeFoldersExample: '多个用逗号分隔，如: temp, logs',
} as const;

// ==================== 通知消息 ====================

export const NOTIFICATIONS = {
  saved: '设置已保存',
  reset: '已重置为默认值',
  ruleNameRequired: '请填写名称和匹配模式',
  invalidPattern: '匹配模式不是有效的正则表达式',
  ruleUpdated: '更新成功',
  ruleAdded: '添加成功',
  scriptNameRequired: '请填写名称和路径',
  pathNotExists: '路径不存在',
  scriptUpdated: '更新成功',
  scriptAdded: '添加成功',
  fileNotExists: '文件不存在: ',
  openFailed: '打开失败: ',
} as const;

// ==================== 状态标签 ====================

export const STATUS_LABELS = {
  disabled: '已禁用',
} as const

// ==================== 加载和路由 ====================

export const LOADING = {
  loading: '正在加载...',
  unknownRoute: '未知的路由: ',
} as const

// ==================== 错误消息 ====================

export const ERRORS = {
  loadConfigFailed: '加载配置失败',
  saveConfigFailed: '保存配置失败',
  updateScriptsOrderFailed: '更新脚本顺序失败: ID 不匹配',
  updateRulesOrderFailed: '更新规则顺序失败: ID 不匹配',
} as const

// ==================== 表单标签补充 ====================

export const FORM_LABELS_EXTRA = {
  quickTemplateLabel: '快速模板：',
  ruleDescriptionPlaceholder: '规则描述',
} as const

// ==================== 提示文本 ====================

export const HINTS = {
  excludeToggle: '点击标签切换是否排除',
  runHelp: '在搜索框中输入文件名或关键字快速查找脚本。使用 ↑ ↓ 键选择脚本，Enter 键或点击运行按钮执行。双击脚本项也可以直接运行。使用 "run-setting" 关键字可以管理脚本和规则。',
  ruleHelp: '规则用于根据文件后缀或文件名匹配模式，自动指定应用来运行脚本。例如：匹配 \\.js$ 的文件使用 node 运行。',
  scriptHelp: '添加脚本文件或文件夹到脚本列表，支持通过关键词搜索快速运行。可以添加单个脚本文件，也可以添加整个文件夹（会自动扫描文件夹中的所有脚本）。已禁用的脚本不会在运行界面显示。',
  noMatchScript: '没有找到匹配的脚本',
  addScriptKeyword: '使用 "run-setting" 关键字添加脚本',
} as const;

// ==================== 无障碍标签 ====================

export const A11Y_LABELS = {
  help: '帮助',
} as const;

// ==================== 规则模板 ====================

export interface RuleTemplate {
  name: string;
  label?: string;
  pattern?: string;
  app?: string;
  args?: string;
}

export const RULE_TEMPLATES: RuleTemplate[] = [
  { name: '', label: '不使用模板' },
  { name: 'JavaScript 文件', pattern: '\\.js$', app: 'node' },
  { name: 'Python 文件', pattern: '\\.py$', app: 'python' },
  { name: 'PowerShell 脚本', pattern: '\\.ps1$', app: 'powershell', args: '-ExecutionPolicy Bypass -File' },
  { name: 'Bash 脚本', pattern: '\\.sh$', app: 'bash' },
  { name: '批处理文件', pattern: '\\.(bat|cmd)$', app: '' },
] as const;
