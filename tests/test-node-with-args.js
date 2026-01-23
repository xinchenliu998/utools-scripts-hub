#!/usr/bin/env node

// 测试 Node.js 脚本 - 带参数测试
// 这个脚本应该通过规则配置，使用 node 命令并传递参数运行
import { fileURLToPath } from 'node:url';

// ES module 中获取当前文件路径的方式
const __filename = fileURLToPath(import.meta.url);

console.log('=== Node.js 脚本参数测试 ===');
console.log('脚本路径:', __filename);

// 检查是否传递了特定参数
const args = process.argv.slice(2);
console.log('\n接收到的所有参数:');
args.forEach((arg, index) => {
  console.log(`  [${index}]: ${arg}`);
});

// 测试常见的参数格式
if (args.includes('--version') || args.includes('-v')) {
  console.log('\n✓ 检测到版本参数');
  console.log('Node.js 版本:', process.version);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log('\n✓ 检测到帮助参数');
  console.log('这是一个测试脚本，用于验证参数传递');
}

if (args.includes('--test')) {
  console.log('\n✓ 检测到测试参数');
  console.log('参数传递功能正常！');
}

if (args.length === 0) {
  console.log('\n⚠ 警告: 没有接收到任何参数');
  console.log('如果规则配置了 args，应该能看到参数列表');
}

console.log('\n按任意键退出...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  process.exit(0);
});
