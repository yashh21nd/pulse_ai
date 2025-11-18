@echo off
REM Context Bridge Deployment Script for Windows

echo 🚀 Starting Context Bridge Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Clean previous builds
echo 🧹 Cleaning previous builds...
call npm run clean

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci

REM Run type checking
echo 🔍 Type checking...
call npm run type-check

REM Run linting
echo 🔍 Linting code...
call npm run lint

REM Build the project
echo 🏗️ Building project...
call npm run build

echo ✅ Build completed successfully!

REM Choose deployment platform
echo.
echo Choose deployment platform:
echo 1. Vercel
echo 2. Netlify
echo 3. Railway
echo 4. Docker
echo 5. Skip deployment

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo 🚀 Deploying to Vercel...
    call npm run deploy:vercel
) else if "%choice%"=="2" (
    echo 🚀 Deploying to Netlify...
    call npm run deploy:netlify
) else if "%choice%"=="3" (
    echo 🚀 Deploying to Railway...
    call npm run deploy:railway
) else if "%choice%"=="4" (
    echo 🐳 Building Docker image...
    call npm run docker:build
    echo To run: npm run docker:run
) else if "%choice%"=="5" (
    echo ⏭️ Skipping deployment
) else (
    echo ❌ Invalid choice
    exit /b 1
)

echo ✅ Deployment process completed!
pause