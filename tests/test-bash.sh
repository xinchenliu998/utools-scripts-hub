#!/bin/bash

# 测试 Bash 脚本 - 显示所有参数

echo "=== Bash 脚本测试 ==="
echo "脚本路径: $0"
echo "接收到的参数:"

if [ $# -eq 0 ]; then
    echo "  没有传递任何参数"
else
    i=1
    for arg in "$@"; do
        echo "  参数 $i: $arg"
        i=$((i + 1))
    done
    echo ""
    echo "总共接收到 $# 个参数"
fi

echo ""
echo "按 Enter 键退出..."
read
