const path = require("node:path");
const os = require("node:os");
const { spawn } = require("node:child_process");
const { createSpawnProcess } = require("./utils");
const { readConfig } = require("./configService");

// 检测操作系统
function getPlatform() {
  return os.platform();
}

// 在 Linux 下查找可用的终端模拟器
function findTerminalEmulator() {
  const terminals = [
    "gnome-terminal",
    "xterm",
    "konsole",
    "terminator",
    "xfce4-terminal",
    "mate-terminal",
    "tilix",
    "alacritty",
    "kitty",
  ];

  // 尝试查找第一个可用的终端
  for (const terminal of terminals) {
    try {
      const { execSync } = require("node:child_process");
      execSync(`which ${terminal}`, { stdio: "ignore" });
      return terminal;
    } catch (e) {
      continue;
    }
  }

  // 如果都没找到，默认使用 gnome-terminal
  return "gnome-terminal";
}

// 获取用户的默认 shell
function getUserShell() {
  // 从环境变量获取用户的默认 shell
  const userShell = process.env.SHELL || "/bin/bash";
  // 提取 shell 名称（去掉路径）
  return userShell.split("/").pop();
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

// 转义 shell 参数（用于 shell -c 内部）
function escapeShellArg(arg) {
  // 转义单引号，然后用单引号包裹（最安全的方式）
  if (arg.includes("'")) {
    // 如果包含单引号，需要特殊处理：'...'"'"'...'
    return `'${arg.replace(/'/g, "'\"'\"'")}'`;
  }
  // 不包含单引号，直接用单引号包裹
  return `'${arg}'`;
}

// 在终端中执行脚本（Linux）
function executeInTerminal(filePath, app, args = []) {
  return new Promise((resolve, reject) => {
    try {
      const terminal = findTerminalEmulator();
      const userShell = getUserShell();
      
      // 转义所有参数，包括文件路径（使用单引号转义，更安全）
      const escapedApp = escapeShellArg(app);
      const escapedArgs = args.map(escapeShellArg);
      const escapedFilePath = escapeShellArg(filePath);
      
      // 构建完整的命令：app args... filePath
      const commandParts = [escapedApp, ...escapedArgs, escapedFilePath];
      const command = commandParts.join(" ");
      
      // 获取 shell 配置文件路径
      const configFile = getShellConfigFile(userShell);
      const escapedConfigFile = escapeShellArg(configFile);
      
      // 构建完整的 shell 命令
      // 先 source 配置文件以确保环境变量（如 nvm 的 PATH）被加载
      // 然后执行用户命令，最后保持终端打开（使用 exec 替换当前 shell 进程）
      // 使用 -l 参数作为登录 shell，确保加载登录配置
      // 注意：即使使用 -c，我们显式 source 配置文件也能确保环境变量被加载
      const shellCommand = `source ${escapedConfigFile} 2>/dev/null || true; ${command}; exec ${userShell} -i -l`;

      let terminalArgs = [];

      // 根据不同终端设置参数
      // 使用 -i -l 组合让 shell 同时作为登录和交互式 shell 运行
      // 这样可以确保加载所有配置文件（包括 .zshrc 中的环境变量，如 nvm 的 PATH）
      // 使用 exec shell 保持终端窗口打开，方便查看输出
      // 注意：所有终端都应该将 shell -i -l -c 和命令分开传递，而不是合并成一个字符串
      switch (terminal) {
        case "gnome-terminal":
        case "tilix":
          // gnome-terminal 使用 -- 分隔终端参数和要执行的命令
          terminalArgs = ["--", userShell, "-i", "-l", "-c", shellCommand];
          break;
        case "xterm":
        case "konsole":
        case "alacritty":
        case "kitty":
          // 这些终端使用 -e 参数，后面跟要执行的命令
          terminalArgs = ["-e", userShell, "-i", "-l", "-c", shellCommand];
          break;
        case "terminator":
        case "xfce4-terminal":
        case "mate-terminal":
          // 这些终端也使用 -e，但可能需要特殊处理
          // 实际上它们也支持分开传递参数
          terminalArgs = ["-e", userShell, "-i", "-l", "-c", shellCommand];
          break;
        default:
          terminalArgs = ["-e", userShell, "-i", "-l", "-c", shellCommand];
      }

      // 直接使用 spawn，避免 createSpawnProcess 的转义影响
      // 终端命令通常不包含空格，所以可以直接使用 spawn
      const process = spawn(terminal, terminalArgs, {
        detached: true,
        stdio: "ignore",
      });

      process.unref();
      resolve({ success: true });
    } catch (error) {
      reject({ error: error.message });
    }
  });
}

// 使用系统默认应用打开文件
function openWithDefaultApp(filePath) {
  return new Promise((resolve, reject) => {
    try {
      // 使用 uTools 的 shell 方法打开文件
      window.utools.shellOpenPath(filePath);
      resolve({ success: true });
    } catch (error) {
      reject({ error: error.message });
    }
  });
}

// 使用指定应用打开文件
function openWithApp(filePath, app, args = []) {
  return new Promise((resolve, reject) => {
    try {
      const platform = getPlatform();

      // 在 Linux 下，如果指定了应用（如 node, python 等），使用终端执行
      if (platform === "linux" && app) {
        return executeInTerminal(filePath, app, args)
          .then(resolve)
          .catch(reject);
      }

      // 其他平台或没有指定应用时，使用原有方式
      const process = createSpawnProcess(app, [filePath, ...args], {
        detached: true,
        stdio: "ignore",
      });

      // 立即解除与父进程的关联，让应用独立运行
      process.unref();

      resolve({ success: true });
    } catch (error) {
      reject({ error: error.message });
    }
  });
}

// 根据规则匹配并使用外部应用打开文件
function openWithRule(filePath) {
  const config = readConfig();
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // 查找匹配的规则
  for (const rule of config.rules) {
    try {
      const regex = new RegExp(rule.pattern);
      if (regex.test(fileName) || regex.test(ext)) {
        // 如果规则指定了应用，使用指定的应用打开
        if (rule.app) {
          return openWithApp(filePath, rule.app, rule.args || []);
        }
      }
    } catch (e) {
      // 正则表达式错误，跳过
      continue;
    }
  }

  // 没有匹配的规则，使用系统默认应用打开
  return openWithDefaultApp(filePath);
}

module.exports = {
  openWithRule,
  openWithDefaultApp,
  openWithApp,
};
