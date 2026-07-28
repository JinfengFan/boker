@echo off
cd /d "%~dp0"
echo Starting Vite in directory: %CD%
E:\nodejs\node.exe E:\AgnetTest\boker\node_modules\vite\bin\vite.js --host --config "%~dp0vite.config.ts"
