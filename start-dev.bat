@echo off
echo Starting Context Bridge Development Server...
echo.
echo This will start both client and server in development mode.
echo If VS Code becomes unresponsive, press Ctrl+C to stop.
echo.

REM Clean previous builds
echo Cleaning previous builds...
rmdir /s /q dist 2>nul
del *.tsbuildinfo 2>nul
rmdir /s /q node_modules\.tmp 2>nul

echo.
echo Starting servers...
npm run dev

pause