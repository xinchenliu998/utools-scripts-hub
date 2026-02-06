import { computed, ref } from "vue";
import { getDefaultExcludeFolders } from "./useSettings";
import { ERRORS } from "@/locales";

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
    console.error(`${ERRORS.loadConfigFailed}:`, error);
    config.value = { scripts: [], rules: [] };
  }
}

// 保存配置
export function saveConfig() {
  try {
    window.services.saveConfig(config.value);
    return true;
  } catch (error) {
    console.error(`${ERRORS.saveConfigFailed}:`, error);
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
  const script = config.value.scripts.find((s) => s.id === id);
  if (script) {
    Object.assign(script, updates);
    return saveConfig();
  }
  return false;
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

// 更新脚本顺序
export function updateScriptsOrder(newOrder: ScriptItem[]) {
  // 验证新顺序中的所有 ID 都在原配置中存在
  const existingIds = new Set(config.value.scripts.map(s => s.id));
  const newOrderIds = newOrder.map(s => s.id);
  
  if (newOrderIds.length !== existingIds.size ||
      !newOrderIds.every(id => existingIds.has(id))) {
    console.error(ERRORS.updateScriptsOrderFailed);
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
  const rule = config.value.rules.find((r) => r.id === id);
  if (rule) {
    Object.assign(rule, updates);
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
    console.error(ERRORS.updateRulesOrderFailed);
    return false;
  }
  
  config.value.rules = newOrder;
  return saveConfig();
}

// 搜索规则
export function searchRules(keyword: string) {
  if (!keyword) return config.value.rules;

  const lowerKeyword = keyword.toLowerCase();

  return config.value.rules.filter((rule) => {
    const nameMatch = rule.name.toLowerCase().includes(lowerKeyword);
    const patternMatch = rule.pattern.toLowerCase().includes(lowerKeyword);
    const appMatch = rule.app?.toLowerCase().includes(lowerKeyword);
    const descMatch = rule.description?.toLowerCase().includes(lowerKeyword);

    return nameMatch || patternMatch || appMatch || descMatch;
  });
}

// 搜索脚本（支持文件名匹配）
export function searchScripts(keyword: string) {
  if (!keyword) return getAllScripts();

  const lowerKeyword = keyword.toLowerCase();
  const allScripts = getAllScripts();

  return allScripts.filter((script) => {
    const nameMatch = script.name.toLowerCase().includes(lowerKeyword);
    const fileNameMatch = script.name.toLowerCase() === lowerKeyword; // 精确文件名匹配
    const pathMatch = script.path.toLowerCase().includes(lowerKeyword);
    const descMatch = script.description?.toLowerCase().includes(lowerKeyword);

    // 优先匹配文件名
    return fileNameMatch || nameMatch || pathMatch || descMatch;
  });
}

// 检查是否应该排除文件夹
function shouldExcludeFolder(folderName: string, excludePatterns?: string[]): boolean {
  const defaultExclude = getDefaultExcludeFolders();
  const excludeList = [...defaultExclude, ...(excludePatterns || [])];
  return excludeList.includes(folderName);
}

// 获取所有脚本（扁平化，包括文件夹中的脚本）
export function getAllScripts(): ScriptItem[] {
  const result: ScriptItem[] = [];

  // 创建路径到已禁用脚本的映射，用于检查文件夹内的文件是否被禁用
  const disabledPaths = new Set<string>();
  for (const script of config.value.scripts) {
    if (script.disabled) {
      disabledPaths.add(script.path);
    }
  }

  function traverse(items: ScriptItem[]) {
    for (const item of items) {
      // 跳过已禁用的脚本
      if (item.disabled) {
        continue;
      }

      if (item.isDirectory) {
        // 如果是目录，尝试读取目录内容
        try {
          const dirItems = window.services.readDirectory(item.path);
          for (const dirItem of dirItems) {
            // 检查是否应该排除
            const excludePatterns = item.excludeFolders || [];
            if (shouldExcludeFolder(dirItem.name, excludePatterns)) {
              continue;
            }

            if (dirItem.isDirectory) {
              // 检查是否支持递归
              if (item.recursive) {
                // 递归处理子目录
                const subDir: ScriptItem = {
                  id: `${item.id}-${dirItem.name}`,
                  name: dirItem.name,
                  path: dirItem.path,
                  isDirectory: true,
                  keywords: item.keywords,
                  description: item.description,
                  disabled: item.disabled,
                  recursive: true, // 子目录继承递归选项
                  excludeFolders: item.excludeFolders,
                };
                traverse([subDir]);
              }
              // 如果不支持递归，跳过子目录
            } else {
              // 检查文件是否在已禁用列表中
              if (disabledPaths.has(dirItem.path)) {
                continue;
              }

              // 添加文件
              const script: ScriptItem = {
                id: `${item.id}-${dirItem.name}`,
                name: dirItem.name,
                path: dirItem.path,
                isDirectory: false,
                keywords: item.keywords,
                description: item.description,
                disabled: false,
              };
              result.push(script);
            }
          }
        } catch (e) {
          // 忽略错误
        }
      } else {
        result.push(item);
      }
    }
  }

  traverse(config.value.scripts);
  return result;
}

// 导出响应式配置
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
    toggleScriptDisabled,
    updateScriptsOrder,
    addRule,
    removeRule,
    updateRule,
    toggleRuleDisabled,
    updateRulesOrder,
    searchScripts,
    searchRules,
    getAllScripts,
  };
}

// 初始化时加载配置（延迟执行，确保 services 已准备好）
if (typeof window !== "undefined") {
  // 使用 setTimeout 确保 services 已经注入
  setTimeout(() => {
    if (window.services) {
      loadConfig();
    }
  }, 100);
}
