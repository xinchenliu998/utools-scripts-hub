const { getPlatform, isMac, isLinux, createSpawnProcess } = require("./utils");
const { executeInTerminal, executeInMacTerminal } = require(
  "./terminalService",
);

/**
 * 平台服务 - 封装所有平台相关的调用细节
 * 对外提供统一的接口，屏蔽平台差异
 * 仅做重新包装，具体实现由其他服务提供
 */

/**
 * 使用系统默认应用打开文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<{success: boolean}>}
 */
function openWithSystemApp(filePath) {
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

/**
 * 执行脚本 - 统一的脚本执行接口，自动处理平台差异
 * @param {string} filePath - 脚本文件路径
 * @param {string} app - 执行应用（如 node, python 等）
 * @param {string[]} args - 应用参数
 * @returns {Promise<{success: boolean}>}
 */
function executeScript(filePath, app, args = []) {
  return new Promise((resolve, reject) => {
    try {
      // Linux 平台：在终端中执行
      if (isLinux() && app) {
        return executeInTerminal(filePath, app, args)
          .then(resolve)
          .catch(reject);
      }

      // Mac 平台：在终端中执行
      if (isMac() && app) {
        return executeInMacTerminal(filePath, app, args)
          .then(resolve)
          .catch(reject);
      }

      // Windows 或其他平台：使用 spawn 执行
      // 参数顺序：app args... filePath（与 Linux/Mac 保持一致）
      const process = createSpawnProcess(app, [...args, filePath], {
        detached: true,
        stdio: "ignore",
      }, getPlatform());

      // 立即解除与父进程的关联，让应用独立运行
      process.unref();

      resolve({ success: true });
    } catch (error) {
      reject({ error: error.message });
    }
  });
}

/**
 * 使用指定应用打开文件
 * @param {string} filePath - 文件路径
 * @param {string} app - 应用名称或路径
 * @param {string[]} args - 应用参数
 * @returns {Promise<{success: boolean}>}
 */
function openWithApp(filePath, app, args = []) {
  // 如果有指定应用，使用执行脚本接口
  if (app) {
    return executeScript(filePath, app, args);
  }

  // 否则使用系统默认应用
  return openWithSystemApp(filePath);
}

module.exports = {
  openWithSystemApp,
  executeScript,
  openWithApp,
};
