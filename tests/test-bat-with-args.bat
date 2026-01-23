@echo off
REM 测试 BAT 批处理脚本 - 带参数测试
REM 这个脚本应该通过规则配置，使用 cmd 命令并传递参数运行

echo === BAT 批处理脚本参数测试 ===
echo 脚本路径: %~f0
echo.

echo 接收到的所有参数:

set count=0
set hasVersion=0
set hasHelp=0
set hasTest=0

:parse
if "%~1"=="" goto :check
set /a count+=1
echo   [%count%]: %1

REM 检查参数类型
if /i "%1"=="--version" set hasVersion=1
if /i "%1"=="-v" set hasVersion=1
if /i "%1"=="--help" set hasHelp=1
if /i "%1"=="-h" set hasHelp=1
if /i "%1"=="--test" set hasTest=1

shift
goto :parse

:check
if %count%==0 (
    echo.
    echo ⚠ 警告: 没有接收到任何参数
    echo 如果规则配置了 args，应该能看到参数列表
    goto :end
)

echo.
echo 总共接收到 %count% 个参数
echo.

if %hasVersion%==1 (
    echo ✓ 检测到版本参数
    echo Windows 版本信息:
    ver
    echo.
)

if %hasHelp%==1 (
    echo ✓ 检测到帮助参数
    echo 这是一个测试脚本，用于验证参数传递
    echo.
)

if %hasTest%==1 (
    echo ✓ 检测到测试参数
    echo 参数传递功能正常！
    echo.
)

:end
echo 按任意键退出...
pause >nul
