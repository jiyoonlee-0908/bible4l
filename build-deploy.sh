#!/bin/bash

# Build script for deployment with permission fixes
set -e

echo "🚀 Starting deployment build process..."

# Set environment variables to resolve deployment issues
export NODE_ENV=production
export REPLIT_DISABLE_PACKAGE_LAYER_CACHING=1
export REPLIT_PRESERVE_DEVDEPS=1

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf client/dist

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Verify build output
echo "✅ Build completed successfully!"
echo "📁 Build artifacts:"
ls -la dist/
if [ -d "client/dist/" ]; then
  ls -la client/dist/
else
  echo "Frontend build output is in dist/public/"
  ls -la dist/public/
fi

echo "🎯 Deployment build ready!"