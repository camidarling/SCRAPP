#!/bin/bash

echo "🎮 Virtual Scrapbooking App - 8-bit Edition"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    echo "Or use a package manager like Homebrew: brew install node"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    echo "Please install npm along with Node.js"
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🚀 To start the development server, run:"
    echo "   npm run dev"
    echo ""
    echo "🎨 The app will open at http://localhost:3000"
    echo ""
    echo "📚 Available commands:"
    echo "   npm run dev     - Start development server"
    echo "   npm run build   - Build for production"
    echo "   npm run preview - Preview production build"
    echo "   npm run lint    - Run ESLint"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi 