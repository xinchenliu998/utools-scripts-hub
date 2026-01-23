const path = require("node:path");
const fs = require("node:fs");
const { execSync } = require("node:child_process");
const os = require("node:os");
const { createSpawnProcess, escapeArg } = require("./utils");
const {
  getUserShell,
  getUserShellPath,
  getShellConfigFile,
  buildShellCommand,
} = require("./shellService");

/**
 * 终端服务 - 用于模拟平台终端
 * 提供 Linux 和 Mac 平台的终端执行功能
 * 不包含平台判断，由外部调用时根据平台选择对应方法
 */

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
      execSync(`which ${terminal}`, { stdio: "ignore" });
      return terminal;
    } catch (e) {
      continue;
    }
  }

  // 如果都没找到，默认使用 gnome-terminal
  return "gnome-terminal";
}

// 在 Mac 下查找可用的终端模拟器
function findMacTerminalEmulator() {
  // 按优先级检测终端应用
  const terminals = [
    {
      name: "iTerm2",
      check: () => {
        try {
          execSync("osascript -e 'tell application \"iTerm\" to get version'", {
            stdio: "ignore",
          });
          return "iTerm2";
        } catch (e) {
          return null;
        }
      },
    },
    {
      name: "Terminal",
      check: () => {
        try {
          execSync(
            "osascript -e 'tell application \"Terminal\" to get version'",
            {
              stdio: "ignore",
            },
          );
          return "Terminal";
        } catch (e) {
          return null;
        }
      },
    },
    {
      name: "Alacritty",
      check: () => {
        try {
          execSync("which alacritty", { stdio: "ignore" });
          return "Alacritty";
        } catch (e) {
          return null;
        }
      },
    },
    {
      name: "Hyper",
      check: () => {
        try {
          execSync("osascript -e 'tell application \"Hyper\" to get version'", {
            stdio: "ignore",
          });
          return "Hyper";
        } catch (e) {
          return null;
        }
      },
    },
  ];

  // 尝试查找第一个可用的终端
  for (const terminal of terminals) {
    const result = terminal.check();
    if (result) {
      return result;
    }
  }

  // 如果都没找到，默认使用 Terminal.app
  return "Terminal";
}

// 在终端中执行脚本（Linux）
function executeInTerminal(filePath, app, args = []) {
  return new Promise((resolve, reject) => {
    try {
      const terminal = findTerminalEmulator();
      const userShell = getUserShell();
      const userShellPath = getUserShellPath();

      // 转义所有参数，包括文件路径（使用 shell 模式）
      const escapedApp = escapeArg(app, "shell", "linux");
      const escapedArgs = args.map((arg) => escapeArg(arg, "shell", "linux"));
      const escapedFilePath = escapeArg(filePath, "shell", "linux");

      // 构建完整的命令：app args... filePath
      const commandParts = [escapedApp, ...escapedArgs, escapedFilePath];
      const command = commandParts.join(" ");

      // 获取 shell 配置文件路径
      const configFile = getShellConfigFile(userShell);
      const shellCommand = buildShellCommand(command, configFile);

      let terminalArgs = [];

      // 根据不同终端设置参数
      switch (terminal) {
        case "gnome-terminal":
        case "tilix":
          // gnome-terminal 使用 -- 分隔终端参数和要执行的命令
          terminalArgs = ["--", userShellPath, "-i", "-l", "-c", shellCommand];
          break;
        case "xterm":
        case "konsole":
        case "alacritty":
        case "kitty":
        case "terminator":
        case "xfce4-terminal":
        case "mate-terminal":
          // 这些终端使用 -e 参数，后面跟要执行的命令
          terminalArgs = ["-e", userShellPath, "-i", "-l", "-c", shellCommand];
          break;
        default:
          terminalArgs = ["-e", userShellPath, "-i", "-l", "-c", shellCommand];
      }

      // 使用 createSpawnProcess 创建进程
      const process = createSpawnProcess(terminal, terminalArgs, {
        detached: true,
        stdio: "ignore",
        shell: false,
      }, "linux");

      process.unref();
      resolve({ success: true });
    } catch (error) {
      reject({ error: error.message });
    }
  });
}

// 在终端中执行脚本（Mac）
function executeInMacTerminal(filePath, app, args = []) {
  return new Promise((resolve, reject) => {
    try {
      const terminal = findMacTerminalEmulator();
      const userShellPath = getUserShellPath();

      // 转义所有参数，包括文件路径（使用 shell 模式）
      const escapedApp = escapeArg(app, "shell", "darwin");
      const escapedArgs = args.map((arg) => escapeArg(arg, "shell", "darwin"));
      const escapedFilePath = escapeArg(filePath, "shell", "darwin");

      // 构建完整的命令：app args... filePath
      const commandParts = [escapedApp, ...escapedArgs, escapedFilePath];
      const command = commandParts.join(" ");

      // 获取 shell 配置文件路径
      const shellName = getUserShell();
      const configFile = getShellConfigFile(shellName);
      const shellCommand = buildShellCommand(command, configFile);

      // Alacritty 使用命令行方式
      if (terminal === "Alacritty") {
        const process = createSpawnProcess("alacritty", [
          "-e",
          userShellPath,
          "-i",
          "-l",
          "-c",
          shellCommand,
        ], {
          detached: true,
          stdio: "ignore",
          shell: false,
        }, "darwin");
        process.unref();
        resolve({ success: true });
        return;
      }

      // 转义 shell 命令用于 AppleScript
      const escapedCommand = escapeArg(shellCommand, "applescript", "darwin");
      let appleScript = "";

      // 根据不同终端生成 AppleScript
      if (terminal === "iTerm2") {
        // iTerm2 使用特定的 AppleScript 语法
        appleScript = `tell application "iTerm"
  activate
  set newWindow to (create window with default profile)
  tell current session of newWindow
    write text "${escapedCommand}"
  end tell
end tell`;
      } else {
        // Terminal.app 使用标准 AppleScript（默认）
        appleScript = `tell application "Terminal"
  activate
  do script "${escapedCommand}"
end tell`;
      }

      // 使用临时文件执行 AppleScript，避免转义问题
      const tmpDir = os.tmpdir();
      const tmpFile = path.join(tmpDir, `utools-script-${Date.now()}.scpt`);

      try {
        // 将 AppleScript 写入临时文件
        fs.writeFileSync(tmpFile, appleScript, "utf8");

        // 执行 AppleScript 文件
        execSync(`osascript "${tmpFile}"`, {
          stdio: "ignore",
        });

        // 清理临时文件
        fs.unlinkSync(tmpFile);
      } catch (e) {
        // 如果临时文件方式失败，尝试直接执行（可能因为权限问题）
        try {
          if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
          }
        } catch (cleanupError) {
          // 忽略清理错误
        }
        // 回退到直接执行方式
        execSync(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, {
          stdio: "ignore",
        });
      }

      resolve({ success: true });
    } catch (error) {
      reject({ error: error.message });
    }
  });
}

module.exports = {
  executeInTerminal,
  executeInMacTerminal,
};
