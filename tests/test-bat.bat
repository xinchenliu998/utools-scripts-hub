@echo off
REM 测试 BAT 批处理脚本 - 显示所有参数

echo === BAT 批处理脚本测试 ===
echo 脚本路径: %~f0
echo.

echo 接收到的参数:

if "%~1"=="" (
    echo   没有传递任何参数
) else (
    set count=0
    :loop
    set /a count+=1
    if "%~1"=="" goto :end
    echo   参数 %count%: %1
    shift
    goto :loop
    :end
    echo.
    echo 总共接收到 %count% 个参数
)

echo.
echo 按任意键退出...
pause >nul
