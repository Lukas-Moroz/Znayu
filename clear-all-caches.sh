q#!/bin/bash
# Comprehensive cache clearing script for Expo/React Native

echo "🧹 Clearing all caches..."

# Clear Expo cache
echo "  - Clearing .expo directory..."
rm -rf .expo

# Clear Metro bundler cache
echo "  - Clearing Metro bundler cache..."
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

# Clear Watchman cache (if installed)
if command -v watchman &> /dev/null; then
  echo "  - Clearing Watchman cache..."
  watchman watch-del-all 2>/dev/null || true
fi

# Clear iOS build cache
echo "  - Clearing iOS build cache..."
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock

# Clear Android build cache
echo "  - Clearing Android build cache..."
rm -rf android/build
rm -rf android/app/build
rm -rf android/.gradle

# Clear npm/yarn cache (optional, uncomment if needed)
# echo "  - Clearing npm cache..."
# npm cache clean --force

echo "✅ All caches cleared!"
echo ""
echo "Now restart the dev server with:"
echo "  npx expo start --clear"

