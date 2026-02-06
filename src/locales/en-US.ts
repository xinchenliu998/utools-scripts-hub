/**
 * English language pack
 */

// ==================== UI Messages ====================

export const UI_MESSAGES = {
  confirmDeleteRule: 'Are you sure you want to delete this rule?',
  confirmDeleteScript: 'Are you sure you want to delete this script?',
  confirmDeleteCustomFolder: 'Are you sure you want to remove exclude folder "${name}"?',
  emptyRules: 'No rules added yet',
  emptyRulesHint: 'Click the button above to add a rule',
  emptyScripts: 'No scripts added yet',
  emptyScriptsHint: 'Click the button above to add a script or folder',
  noMatchRules: 'No matching rules found',
  noMatchScripts: 'No matching scripts found',
  searchHint: 'Try searching with different keywords',
} as const;

export const UI_TOOLTIPS = {
  addRule: 'Add rule',
  addScript: 'Add script/folder',
  edit: 'Edit',
  editRule: 'Edit rule',
  editScript: 'Edit script',
  delete: 'Delete',
  enable: 'Enable',
  disable: 'Disable',
  help: 'Help',
  close: 'Close',
  save: 'Save',
  cancel: 'Cancel',
  reset: 'Reset',
  run: 'Run script (Enter)',
  selectFile: 'Select file',
  selectFolder: 'Select folder',
} as const;

// ==================== Tab Configuration ====================

export const TABS = {
  scripts: 'Scripts',
  rules: 'Rules',
  appearance: 'Appearance',
  exclude: 'Exclude',
  buttons: 'Buttons',
} as const;

// ==================== Button Color Labels ====================

export const BUTTON_COLOR_LABELS = {
  primary: 'Primary',
  danger: 'Danger',
  warning: 'Warning',
  success: 'Success',
  default: 'Default',
} as const;

// ==================== Dialog Titles ====================

export const DIALOG_TITLES = {
  settings: 'Settings',
  addRuleTitle: 'Add Rule',
  editRuleTitle: 'Edit Rule',
  addScriptTitle: 'Add Script/Folder',
  editScriptTitle: 'Edit Script',
} as const;

// Dialog options
export const DIALOG_OPTIONS = {
  selectFile: {
    title: 'Select file',
    buttonLabel: 'Select',
  },
  selectFolder: {
    title: 'Select folder',
    buttonLabel: 'Select',
  },
} as const;

// ==================== Form Labels ====================

export const FORM_LABELS = {
  themeColor: 'Theme color:',
  excludeCustom: 'Custom:',
  ruleName: 'Rule name:',
  rulePattern: 'Pattern (regex):',
  rulePatternHint: 'Regex pattern to match file name or extension',
  ruleApp: 'Application (optional):',
  ruleAppHint: 'Leave empty to use default script execution',
  ruleArgs: 'Arguments (optional, space-separated):',
  ruleDescription: 'Description (optional):',
  scriptName: 'Name:',
  scriptPath: 'Path:',
  scriptFolderPath: 'Folder path',
  scriptFilePath: 'Script path',
  scriptFolder: 'Folder',
  scriptRecursive: 'Recursive',
  scriptExclude: 'Exclude:',
  scriptDescriptionLabel: 'Description:',
} as const;

// ==================== Placeholders ====================

export const PLACEHOLDERS = {
  selectFile: 'Select file',
  selectFolder: 'Select folder',
  scriptName: 'Script name',
  ruleName: 'Rule name',
  rulePattern: 'e.g.: \\.js$',
  ruleApp: 'e.g.: node, python, powershell',
  ruleArgs: 'e.g.: -ExecutionPolicy Bypass -File',
  scriptDescription: 'Script description (optional)',
  excludeFolders: 'Separate with commas',
  searchRule: 'Search rules (name, pattern, app, description)',
  searchScript: 'Search scripts (name, path, description, keywords)',
  searchScriptRun: 'Enter file name or keyword to search scripts...',
  excludeFoldersExample: 'Separate with commas, e.g.: temp, logs',
} as const;

// ==================== Notifications ====================

export const NOTIFICATIONS = {
  saved: 'Settings saved',
  reset: 'Reset to defaults',
  ruleNameRequired: 'Please enter name and pattern',
  invalidPattern: 'Pattern is not a valid regex',
  ruleUpdated: 'Rule updated',
  ruleAdded: 'Rule added',
  scriptNameRequired: 'Please enter name and path',
  pathNotExists: 'Path does not exist',
  scriptUpdated: 'Script updated',
  scriptAdded: 'Script added',
  fileNotExists: 'File not exists: ',
  openFailed: 'Open failed: ',
} as const;

// ==================== Status Labels ====================

export const STATUS_LABELS = {
  disabled: 'Disabled',
} as const

// ==================== Loading & Routing ====================

export const LOADING = {
  loading: 'Loading...',
  unknownRoute: 'Unknown route: ',
} as const

// ==================== Error Messages ====================

export const ERRORS = {
  loadConfigFailed: 'Failed to load config',
  saveConfigFailed: 'Failed to save config',
  updateScriptsOrderFailed: 'Failed to update scripts order: ID mismatch',
  updateRulesOrderFailed: 'Failed to update rules order: ID mismatch',
} as const

// ==================== Form Labels Extra ====================

export const FORM_LABELS_EXTRA = {
  quickTemplateLabel: 'Quick template:',
  ruleDescriptionPlaceholder: 'Rule description',
} as const

// ==================== Hints ====================

export const HINTS = {
  excludeToggle: 'Click label to toggle exclusion',
  runHelp: 'Enter file name or keyword in search box to quickly find scripts. Use ↑ ↓ keys to select, Enter to run. Double-click to run directly. Use "run-setting" to manage scripts and rules.',
  ruleHelp: 'Rules automatically specify applications to run scripts based on file extension or name pattern matching. E.g.: Match \\.js$ files to run with node.',
  scriptHelp: 'Add script files or folders to the script list for quick running via keyword search. Add individual scripts or entire folders (automatically scans all scripts). Disabled scripts are not shown in the run interface.',
  noMatchScript: 'No matching scripts found',
  addScriptKeyword: 'Use "run-setting" to add scripts',
} as const;

// ==================== Accessibility Labels ====================

export const A11Y_LABELS = {
  help: 'Help',
} as const;

// ==================== Rule Templates ====================

export interface RuleTemplate {
  name: string;
  label?: string;
  pattern?: string;
  app?: string;
  args?: string;
}

export const RULE_TEMPLATES: RuleTemplate[] = [
  { name: '', label: 'No template' },
  { name: 'JavaScript File', pattern: '\\.js$', app: 'node' },
  { name: 'Python File', pattern: '\\.py$', app: 'python' },
  { name: 'PowerShell Script', pattern: '\\.ps1$', app: 'powershell', args: '-ExecutionPolicy Bypass -File' },
  { name: 'Bash Script', pattern: '\\.sh$', app: 'bash' },
  { name: 'Batch File', pattern: '\\.(bat|cmd)$', app: '' },
] as const;
