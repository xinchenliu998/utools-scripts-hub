# PowerShell 脚本测试 - 显示所有参数

Write-Host "=== PowerShell 脚本测试 ===" -ForegroundColor Cyan
Write-Host "脚本路径: $($MyInvocation.ScriptName)"
Write-Host "PowerShell 版本: $($PSVersionTable.PSVersion)"
Write-Host ""
Write-Host "接收到的参数:"

if ($args.Count -eq 0) {
    Write-Host "  没有传递任何参数" -ForegroundColor Yellow
} else {
    for ($i = 0; $i -lt $args.Count; $i++) {
        Write-Host "  参数 $($i + 1): $($args[$i])"
    }
    Write-Host ""
    Write-Host "总共接收到 $($args.Count) 个参数"
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
