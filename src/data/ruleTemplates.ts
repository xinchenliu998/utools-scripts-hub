/**
 * 规则模板数据
 */

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
]

export const RULE_TEMPLATES_EN: RuleTemplate[] = [
  { name: '', label: 'No template' },
  { name: 'JavaScript File', pattern: '\\.js$', app: 'node' },
  { name: 'Python File', pattern: '\\.py$', app: 'python' },
  { name: 'PowerShell Script', pattern: '\\.ps1$', app: 'powershell', args: '-ExecutionPolicy Bypass -File' },
  { name: 'Bash Script', pattern: '\\.sh$', app: 'bash' },
  { name: 'Batch File', pattern: '\\.(bat|cmd)$', app: '' },
]
