#!/bin/bash

# 测试 Bash 脚本 - 带参数测试
# 这个脚本应该通过规则配置，使用 bash 命令并传递参数运行

echo "=== Bash 脚本参数测试 ==="
echo "脚本路径: $0"
echo "Bash 版本: $BASH_VERSION"

echo ""
echo "接收到的所有参数:"
i=0
for arg in "$@"; do
    echo "  [$i]: $arg"
    i=$((i + 1))
done

# 测试常见的参数格式
if [[ " $* " =~ " --version " ]] || [[ " $* " =~ " -v " ]]; then
    echo ""
    echo "✓ 检测到版本参数"
    echo "Bash 版本: $BASH_VERSION"
fi

if [[ " $* " =~ " --help " ]] || [[ " $* " =~ " -h " ]]; then
    echo ""
    echo "✓ 检测到帮助参数"
    echo "这是一个测试脚本，用于验证参数传递"
fi

if [[ " $* " =~ " --test " ]]; then
    echo ""
    echo "✓ 检测到测试参数"
    echo "参数传递功能正常！"
fi

if [ $# -eq 0 ]; then
    echo ""
    echo "⚠ 警告: 没有接收到任何参数"
    echo "如果规则配置了 args，应该能看到参数列表"
else
    echo ""
    echo "总共接收到 $# 个参数"
fi

echo ""
echo "按 Enter 键退出..."
read
