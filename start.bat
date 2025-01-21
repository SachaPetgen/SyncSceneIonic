@echo off
:retry
adb kill-server
adb start-server
timeout /t 5
ionic cap run android --external --livereload
if errorlevel 1 goto retry
