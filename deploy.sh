#!/bin/bash

# Context Bridge Deployment Script

echo "🚀 Starting Context Bridge Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Type checking..."
npm run type-check

# Run linting
echo "🔍 Linting code..."
npm run lint

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"

# Choose deployment platform
echo ""
echo "Choose deployment platform:"
echo "1. Vercel"
echo "2. Netlify" 
echo "3. Railway"
echo "4. Docker"
echo "5. Skip deployment"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        npm run deploy:vercel
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        npm run deploy:netlify
        ;;
    3)
        echo "🚀 Deploying to Railway..."
        npm run deploy:railway
        ;;
    4)
        echo "🐳 Building Docker image..."
        npm run docker:build
        echo "To run: npm run docker:run"
        ;;
    5)
        echo "⏭️ Skipping deployment"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo "✅ Deployment process completed!"