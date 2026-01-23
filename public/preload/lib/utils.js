const { spawn } = require("node:child_process");
const os = require("node:os");

/**
 * 工具函数 - 提供进程创建、参数转义和平台判断功能
 * 用于处理子进程的创建和管理，以及平台相关的工具函数
 */

/**
 * 获取当前平台
 * @returns {string} 平台类型：'linux' | 'darwin' | 'win32'
 */
function getPlatform() {
  return os.platform();
}

/**
 * 判断是否为 Mac 平台
 * @returns {boolean}
 */
function isMac() {
  return getPlatform() === "darwin";
}

/**
 * 判断是否为 Linux 平台
 * @returns {boolean}
 */
function isLinux() {
  return getPlatform() === "linux";
}

/**
 * 判断是否为 Windows 平台
 * @returns {boolean}
 */
function isWindows() {
  return getPlatform() === "win32";
}

/**
 * 统一的参数转义函数
 * @param {string} arg - 需要转义的参数
 * @param {string} mode - 转义模式：'spawn' (双引号，用于 spawn)、'shell' (单引号，用于 shell -c) 或 'applescript' (用于 AppleScript 字符串)
 * @param {string} platform - 平台类型：'linux' | 'darwin' | 'win32'，默认自动检测
 * @returns {string} 转义后的参数
 */
function escapeArg(arg, mode = "spawn", platform = null) {
  // 自动检测平台
  if (!platform) {
    platform = os.platform();
  }

  if (mode === "applescript") {
    // AppleScript 模式：转义反斜杠、双引号、换行符和回车符
    return arg
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
  }

  if (mode === "shell") {
    // shell -c 内部使用单引号转义（更安全，适用于 Linux 和 Mac）
    if (arg.includes("'")) {
      // 如果包含单引号，需要特殊处理：'...'"'"'...'
      return `'${arg.replace(/'/g, "'\"'\"'")}'`;
    }
    // 不包含单引号，直接用单引号包裹
    return `'${arg}'`;
  }

  // spawn 模式使用双引号转义（跨平台）
  if (arg.includes(" ") || arg.includes('"') || arg.includes("'")) {
    // 转义引号并包裹
    return `"${arg.replace(/"/g, '\\"')}"`;
  }
  return arg;
}

/**
 * 创建 spawn 进程，自动处理带空格的路径
 * @param {string} command - 命令或命令路径
 * @param {string[]} commandArgs - 命令参数数组
 * @param {object} options - spawn 选项
 * @param {string} platform - 平台类型：'linux' | 'darwin' | 'win32'，默认自动检测
 * @returns {ChildProcess} spawn 进程对象
 */
function createSpawnProcess(
  command,
  commandArgs = [],
  options = {},
  platform = null,
) {
  // 自动检测平台
  if (!platform) {
    platform = os.platform();
  }

  const commandHasSpaces = command.includes(" ");
  const shell = options.shell !== undefined ? options.shell : true;

  if (commandHasSpaces) {
    // 对于带空格的命令路径，构建完整的命令字符串
    const quotedCommand = escapeArg(command, "spawn", platform);
    const quotedArgs = commandArgs.map((arg) =>
      escapeArg(arg, "spawn", platform)
    );
    const fullCommand = [quotedCommand, ...quotedArgs].join(" ");

    // 使用 shell 执行完整命令字符串
    return spawn(fullCommand, [], {
      ...options,
      shell,
    });
  } else {
    return spawn(command, commandArgs, {
      ...options,
      shell,
    });
  }
}

module.exports = {
  getPlatform,
  isMac,
  isLinux,
  isWindows,
  escapeArg,
  createSpawnProcess,
};
