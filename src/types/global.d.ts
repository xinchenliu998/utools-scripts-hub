/// <reference types="utools-api-types" />

// 直接使用全局声明的 UToolsApi 接口
// utools-api-types 包在 utools.api.d.ts 中全局声明了 UToolsApi 接口

declare global {
  interface Window {
    utools: UToolsApi
    services: {
      readConfig(): { scripts: any[]; rules: any[] }
      saveConfig(config: any): void
      pathExists(filePath: string): boolean
      readDirectory(dirPath: string): Array<{
        name: string
        path: string
        isDirectory: boolean
        size: number
      }>
      openWithRule(filePath: string): Promise<{ success: boolean }>
    }
  }
}

// 导出空对象以确保这是一个模块
export {}
