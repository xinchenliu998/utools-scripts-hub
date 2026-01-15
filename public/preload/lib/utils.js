const { spawn } = require("node:child_process");

// 转义函数：如果参数包含空格或特殊字符，用引号包裹
function escapeArg(arg) {
  if (arg.includes(" ") || arg.includes('"') || arg.includes("'")) {
    // 转义引号并包裹
    return `"${arg.replace(/"/g, '\\"')}"`;
  }
  return arg;
}

// 创建 spawn 进程，自动处理带空格的路径
function createSpawnProcess(command, commandArgs, options = {}) {
  const commandHasSpaces = command.includes(" ");

  if (commandHasSpaces) {
    // 对于带空格的命令路径，构建完整的命令字符串
    const quotedCommand = escapeArg(command);
    const quotedArgs = commandArgs.map(escapeArg);
    const fullCommand = [quotedCommand, ...quotedArgs].join(" ");

    // 使用 shell 执行完整命令字符串
    return spawn(fullCommand, [], {
      ...options,
      shell: true,
    });
  } else {
    return spawn(command, commandArgs, {
      ...options,
      shell: true,
    });
  }
}

module.exports = {
  escapeArg,
  createSpawnProcess,
};
