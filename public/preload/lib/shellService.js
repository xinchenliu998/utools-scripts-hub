const os = require("node:os");
const { escapeArg } = require("./utils");

/**
 * Shell 服务 - 提供 shell 相关的工具函数
 * 用于处理 shell 配置、路径和命令构建
 */

// 获取用户的默认 shell
function getUserShell() {
  // 从环境变量获取用户的默认 shell
  const userShell = process.env.SHELL || "/bin/bash";
  // 提取 shell 名称（去掉路径）
  return userShell.split("/").pop();
}

// 获取 shell 完整路径
function getUserShellPath() {
  return process.env.SHELL ||
    (os.platform() === "darwin" ? "/bin/zsh" : "/bin/bash");
}

// 获取 shell 配置文件路径
function getShellConfigFile(shellName) {
  const homeDir = os.homedir();
  if (shellName === "zsh") {
    return `${homeDir}/.zshrc`;
  } else if (shellName === "bash") {
    return `${homeDir}/.bashrc`;
  }
  // 默认返回 bashrc
  return `${homeDir}/.bashrc`;
}

// 转义 shell 参数（用于 shell -c 内部）- 使用统一的 escapeArg 函数
function escapeShellArg(arg) {
  return escapeArg(arg, "shell");
}

// 构建 shell 命令（包含 source 配置文件和执行命令）
function buildShellCommand(command, configFile) {
  const escapedConfigFile = escapeArg(configFile, "shell");
  // 先 source 配置文件以确保环境变量被加载
  // 然后执行用户命令，最后保持终端打开（使用 exec 替换当前 shell 进程）
  return `source ${escapedConfigFile} 2>/dev/null || true; ${command}; exec ${getUserShellPath()} -i -l`;
}

module.exports = {
  getUserShell,
  getUserShellPath,
  getShellConfigFile,
  escapeShellArg,
  buildShellCommand,
};
