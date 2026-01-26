/// <reference types="utools-api-types" />

import type { Config } from "@/composables/useScripts";

// 直接使用全局声明的 UToolsApi 接口
// utools-api-types 包在 utools.api.d.ts 中全局声明了 UToolsApi 接口

export interface DirectoryItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
}

// 从 UToolsApi.showOpenDialog 提取参数类型
export type OpenDialogOptions = Parameters<UToolsApi["showOpenDialog"]>[0];

// 从 UToolsApi.onPluginEnter 的回调函数中提取 action 参数类型
type OnPluginEnterCallback = Parameters<UToolsApi["onPluginEnter"]>[0];
export type EnterAction = OnPluginEnterCallback extends
  (action: infer A) => void ? A : never;

declare global {
  interface Window {
    utools: UToolsApi;
    services: {
      readConfig(): Config;
      saveConfig(config: Config): void;
      pathExists(filePath: string): boolean;
      readDirectory(dirPath: string): DirectoryItem[];
      openWithRule(filePath: string): Promise<{ success: boolean }>;
    };
  }
}

// 导出空对象以确保这是一个模块
export {};
