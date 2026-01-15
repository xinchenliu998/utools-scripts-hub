import type { UToolsApi } from 'utools-api-types'

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

export {}
