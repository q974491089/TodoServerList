@echo off
echo 正在启动应用...
echo 请勿关闭此窗口，关闭窗口将停止服务。
cd /d "%~dp0"
call npm run preview
pause
