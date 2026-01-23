#!/usr/bin/env node

// 测试 Node.js 脚本 - 显示所有参数
import { fileURLToPath } from 'node:url';

// ES module 中获取当前文件路径的方式
const __filename = fileURLToPath(import.meta.url);

console.log('=== Node.js 脚本测试 ===');
console.log('脚本路径:', __filename);
console.log('接收到的参数:');
process.argv.slice(2).forEach((arg, index) => {
  console.log(`  参数 ${index + 1}: ${arg}`);
});

if (process.argv.length <= 2) {
  console.log('没有传递任何参数');
} else {
  console.log(`总共接收到 ${process.argv.length - 2} 个参数`);
}

console.log('\n按任意键退出...');
// 等待用户输入（在终端中保持窗口打开）
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  process.exit(0);
});
