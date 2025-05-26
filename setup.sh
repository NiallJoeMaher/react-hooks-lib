#!/bin/bash

# React Hooks Library Setup Script
echo "🚀 Setting up React Hooks Library Tutorial..."

# Install main project dependencies
echo "📦 Installing main project dependencies..."
npm install

# Build the library
echo "🔨 Building the library..."
npm run build

# Install example app dependencies
echo "📦 Installing example app dependencies..."
cd example && npm install

# Go back to root
cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Start the example app: npm run example"
echo "  2. Watch for changes: npm run dev"
echo "  3. Build the library: npm run build"
echo ""
echo "📖 Read TUTORIAL.md for a detailed walkthrough!" 