import type { UToolsApi } from 'utools-api-types'

declare global {
  interface Window {
    utools: UToolsApi
    services: {
      readFile(file: string): string
      writeTextFile(text: string): string
      writeImageFile(base64Url: string): string | undefined
      getDataPath(): string
      getConfigPath(): string
      readConfig(): { scripts: any[]; rules: any[] }
      saveConfig(config: any): void
      pathExists(filePath: string): boolean
      isDirectory(filePath: string): boolean
      readDirectory(dirPath: string): Array<{
        name: string
        path: string
        isDirectory: boolean
        size: number
      }>
      executeScript(scriptPath: string, args?: string[]): Promise<{
        stdout: string
        stderr: string
        code: number
      }>
      executeByRule(filePath: string): Promise<{
        stdout: string
        stderr: string
        code: number
      }>
      executeWithApp(filePath: string, app: string, args?: string[]): Promise<{
        stdout: string
        stderr: string
        code: number
      }>
      openWithRule(filePath: string): Promise<{ success: boolean }>
      openWithDefaultApp(filePath: string): Promise<{ success: boolean }>
      openWithApp(filePath: string, app: string, args?: string[]): Promise<{ success: boolean }>
    }
  }
}

export {}
