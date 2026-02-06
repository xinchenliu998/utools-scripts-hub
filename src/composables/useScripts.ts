import { computed, ref } from "vue";
import { getDefaultExcludeFolders } from "./useSettings";
import { i18n } from "@/i18n";

export interface ScriptItem {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  keywords?: string[];
  description?: string;
  disabled?: boolean;
  /** 是否递归读取子文件夹，默认 false */
  recursive?: boolean;
  /** 排除的文件夹名称列表 */
  excludeFolders?: string[];
}

export interface RuleItem {
  id: string;
  name: string;
  pattern: string;
  app?: string;
  args?: string[];
  description?: string;
  disabled?: boolean;
}

export interface Config {
  scripts: ScriptItem[];
  rules: RuleItem[];
}

const config = ref<Config>({ scripts: [], rules: [] });

// 加载配置
export function loadConfig() {
  try {
    const data = window.services.readConfig();
    config.value = data;
  } catch (error) {
    console.error(`${i18n.global.t('ui.errors.loadConfigFailed')}:`, error);
    config.value = { scripts: [], rules: [] };
  }
}

// 保存配置
export function saveConfig() {
  try {
    window.services.saveConfig(config.value);
    return true;
  } catch (error) {
    console.error(`${i18n.global.t('ui.errors.saveConfigFailed')}:`, error);
    return false;
  }
}

// 添加脚本
export function addScript(script: ScriptItem) {
  // 检查是否已存在
  const exists = config.value.scripts.find((s) => s.path === script.path);
  if (exists) {
    return false;
  }
  config.value.scripts.push(script);
  return saveConfig();
}

// 删除脚本
export function removeScript(id: string) {
  const index = config.value.scripts.findIndex((s) => s.id === id);
  if (index !== -1) {
    config.value.scripts.splice(index, 1);
    return saveConfig();
  }
  return false;
}

// 更新脚本
export function updateScript(id: string, updates: Partial<ScriptItem>) {
  const index = config.value.scripts.findIndex((s) => s.id === id);
  if (index !== -1) {
    config.value.scripts[index] = { ...config.value.scripts[index], ...updates };
    return saveConfig();
  }
  return false;
}

// 更新脚本顺序
export function updateScriptsOrder(newOrder: ScriptItem[]) {
  // 验证新顺序中的所有 ID 都在原配置中存在
  const existingIds = new Set(config.value.scripts.map(s => s.id));
  const newOrderIds = newOrder.map(s => s.id);

  if (newOrderIds.length !== existingIds.size ||
      !newOrderIds.every(id => existingIds.has(id))) {
    console.error(i18n.global.t('ui.errors.updateScriptsOrderFailed'));
    return false;
  }

  config.value.scripts = newOrder;
  return saveConfig();
}

// 添加规则
export function addRule(rule: RuleItem) {
  config.value.rules.push(rule);
  return saveConfig();
}

// 删除规则
export function removeRule(id: string) {
  const index = config.value.rules.findIndex((r) => r.id === id);
  if (index !== -1) {
    config.value.rules.splice(index, 1);
    return saveConfig();
  }
  return false;
}

// 更新规则
export function updateRule(id: string, updates: Partial<RuleItem>) {
  const index = config.value.rules.findIndex((r) => r.id === id);
  if (index !== -1) {
    config.value.rules[index] = { ...config.value.rules[index], ...updates };
    return saveConfig();
  }
  return false;
}

// 切换规则禁用状态
export function toggleRuleDisabled(id: string) {
  const rule = config.value.rules.find((r) => r.id === id);
  if (rule) {
    rule.disabled = !rule.disabled;
    return saveConfig();
  }
  return false;
}

// 更新规则顺序
export function updateRulesOrder(newOrder: RuleItem[]) {
  // 验证新顺序中的所有 ID 都在原配置中存在
  const existingIds = new Set(config.value.rules.map(r => r.id));
  const newOrderIds = newOrder.map(r => r.id);

  if (newOrderIds.length !== existingIds.size ||
      !newOrderIds.every(id => existingIds.has(id))) {
    console.error(i18n.global.t('ui.errors.updateRulesOrderFailed'));
    return false;
  }

  config.value.rules = newOrder;
  return saveConfig();
}

// 搜索规则
export function searchRules(keyword: string) {
  const lowerKeyword = keyword.toLowerCase();
  return config.value.rules.filter((rule) => {
    if (rule.disabled) return false;
    return (
      rule.name.toLowerCase().includes(lowerKeyword) ||
      rule.pattern.toLowerCase().includes(lowerKeyword) ||
      (rule.app && rule.app.toLowerCase().includes(lowerKeyword)) ||
      (rule.description && rule.description.toLowerCase().includes(lowerKeyword))
    );
  });
}

// 搜索脚本
export function searchScripts(keyword: string) {
  const lowerKeyword = keyword.toLowerCase();
  return config.value.scripts.filter((script) => {
    if (script.disabled) return false;
    return (
      script.name.toLowerCase().includes(lowerKeyword) ||
      script.path.toLowerCase().includes(lowerKeyword) ||
      (script.description && script.description.toLowerCase().includes(lowerKeyword)) ||
      (script.keywords && script.keywords.some((k) => k.toLowerCase().includes(lowerKeyword)))
    );
  });
}

// 获取所有脚本
export function getAllScripts() {
  return config.value.scripts;
}

// 获取所有规则
export function getAllRules() {
  return config.value.rules;
}

// 查找匹配的规则
export function findMatchingRules(filename: string): RuleItem[] {
  const rules = config.value.rules;
  const sortedRules = [...rules].sort((a, b) => {
    const orderA = a.disabled ? 1 : 0;
    const orderB = b.disabled ? 1 : 0;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return 0;
  });

  return sortedRules.filter((rule) => {
    if (rule.disabled) return false;

    try {
      const regex = new RegExp(rule.pattern);
      return regex.test(filename);
    } catch {
      return false;
    }
  });
}

// 获取单个脚本
export function getScript(id: string): ScriptItem | undefined {
  return config.value.scripts.find(s => s.id === id);
}

// 获取单个规则
export function getRule(id: string): RuleItem | undefined {
  return config.value.rules.find(r => r.id === id);
}

// 切换脚本禁用状态
export function toggleScriptDisabled(id: string) {
  const script = config.value.scripts.find((s) => s.id === id);
  if (script) {
    script.disabled = !script.disabled;
    return saveConfig();
  }
  return false;
}

export function useScripts() {
  return {
    config: computed(() => config.value),
    scripts: computed(() => config.value.scripts),
    rules: computed(() => config.value.rules),
    loadConfig,
    saveConfig,
    addScript,
    removeScript,
    updateScript,
    addRule,
    removeRule,
    updateRule,
    toggleRuleDisabled,
    updateRulesOrder,
    searchRules,
    searchScripts,
    getAllScripts,
    getAllRules,
    findMatchingRules,
    getScript,
    getRule,
    toggleScriptDisabled,
    updateScriptsOrder,
  };
}
