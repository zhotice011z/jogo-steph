#!/bin/bash

echo "================================"
echo "HTML5 Game Packaging Tool"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ ERROR: npm is not installed!"
    exit 1
fi

echo "✓ npm found"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Ask user what they want to build
echo "What would you like to build?"
echo "1) All platforms (Windows, Mac, Linux)"
echo "2) Windows only"
echo "3) Mac only"
echo "4) Linux only"
echo "5) Just test locally (no build)"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🔨 Building for all platforms..."
        npx pkg . --compress GZip
        ;;
    2)
        echo ""
        echo "🔨 Building for Windows..."
        npx pkg . --targets node18-win-x64 --compress GZip
        ;;
    3)
        echo ""
        echo "🔨 Building for Mac..."
        npx pkg . --targets node18-macos-x64 --compress GZip
        ;;
    4)
        echo ""
        echo "🔨 Building for Linux..."
        npx pkg . --targets node18-linux-x64 --compress GZip
        ;;
    5)
        echo ""
        echo "🚀 Starting local test server..."
        echo "Press Ctrl+C to stop"
        node server.js
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "✅ Build complete!"
echo "================================"
echo ""
echo "Your executables are in the 'dist' folder:"
ls -lh dist/
echo ""
echo "You can now distribute these files to players!"
