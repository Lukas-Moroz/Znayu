#!/bin/bash
# Script to clear cache and restart Expo dev server

echo "Clearing Metro bundler cache..."
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear --web

