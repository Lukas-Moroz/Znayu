#!/bin/bash
# Clear all caches for Expo/Metro bundler

echo "Clearing Expo cache..."
rm -rf .expo
rm -rf node_modules/.cache

echo "Clearing Metro bundler cache..."
npx expo start --clear

echo "Cache cleared! The server should restart automatically."

