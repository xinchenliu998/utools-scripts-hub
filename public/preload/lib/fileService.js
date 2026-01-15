const fs = require("node:fs");
const path = require("node:path");

// 检查路径是否存在
function pathExists(filePath) {
  return fs.existsSync(filePath);
}

// 读取目录内容
function readDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    return items.map((item) => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      return {
        name: item,
        path: fullPath,
        isDirectory: stat.isDirectory(),
        size: stat.size,
      };
    });
  } catch (e) {
    return [];
  }
}

module.exports = {
  pathExists,
  readDirectory,
};
