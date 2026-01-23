# PowerShell 脚本测试 - 带参数测试
# 这个脚本应该通过规则配置，使用 powershell 命令并传递参数运行

Write-Host "=== PowerShell 脚本参数测试 ===" -ForegroundColor Cyan
Write-Host "脚本路径: $($MyInvocation.ScriptName)"
Write-Host "PowerShell 版本: $($PSVersionTable.PSVersion)"
Write-Host ""

Write-Host "接收到的所有参数:"
for ($i = 0; $i -lt $args.Count; $i++) {
    Write-Host "  [$i]: $($args[$i])"
}

# 测试常见的参数格式
$hasVersion = $args -contains "--version" -or $args -contains "-v"
$hasHelp = $args -contains "--help" -or $args -contains "-h"
$hasTest = $args -contains "--test"
$hasVerbose = $args -contains "--verbose" -or $args -contains "-V"

if ($hasVersion) {
    Write-Host ""
    Write-Host "✓ 检测到版本参数" -ForegroundColor Green
    Write-Host "PowerShell 版本: $($PSVersionTable.PSVersion)"
}

if ($hasHelp) {
    Write-Host ""
    Write-Host "✓ 检测到帮助参数" -ForegroundColor Green
    Write-Host "这是一个测试脚本，用于验证参数传递"
}

if ($hasTest) {
    Write-Host ""
    Write-Host "✓ 检测到测试参数" -ForegroundColor Green
    Write-Host "参数传递功能正常！"
}

if ($hasVerbose) {
    Write-Host ""
    Write-Host "✓ 检测到详细输出参数" -ForegroundColor Green
    Write-Host "详细模式已启用"
}

if ($args.Count -eq 0) {
    Write-Host ""
    Write-Host "⚠ 警告: 没有接收到任何参数" -ForegroundColor Yellow
    Write-Host "如果规则配置了 args，应该能看到参数列表"
} else {
    Write-Host ""
    Write-Host "总共接收到 $($args.Count) 个参数"
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
