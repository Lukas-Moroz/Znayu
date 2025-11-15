# Testing Guide - Znayu App

## Browser Mode Testing (Expo Web)

### Setup and Launch

```bash
# Navigate to project directory
cd /Users/achu9972/Documents/GitHub/Znayu

# Install dependencies (if not already done)
npm install

# Start the app in browser mode
npm run web
```

The app should open in your default browser at `http://localhost:8081` or similar.

## Testing Checklist

### Phase 1: Initial Load
- [ ] App loads without errors
- [ ] Home screen displays with module path
- [ ] Streak counter shows (default: test data)
- [ ] Bottom navigation tabs are visible (Home, Packs, Review)

### Phase 2: Module 0 - Alphabet Learning
- [ ] Click on Module 0 (Alphabet)
- [ ] **Learn Mode**:
  - [ ] Large letter displays correctly (uppercase and lowercase)
  - [ ] Letter name and sound description show
  - [ ] "Hear the sound" button is present
  - [ ] Example word displays
  - [ ] "Previous" button (disabled on first letter)
  - [ ] "Test Yourself" button works
- [ ] **Quiz Mode**:
  - [ ] Letter displays in large format
  - [ ] Four sound options appear as buttons
  - [ ] Selecting correct answer shows green feedback
  - [ ] Selecting wrong answer shows red feedback with correction
  - [ ] "Next Letter" button appears after correct answer
- [ ] **Progress**:
  - [ ] Progress bar at top updates (1/33, 2/33, etc.)
  - [ ] Counter shows current position
  - [ ] Navigation through all 33 letters works
  - [ ] Completion navigates back to home

### Phase 3: Module 1+ - Section-Based Learning
- [ ] Click on Module 1 (Greetings)
- [ ] **Section Choice Screen**:
  - [ ] Sections display with icons (Grammar, Vocabulary, Listening)
  - [ ] Each section shows word/rule counts
  - [ ] Clicking section opens mode selection modal
- [ ] **Mode Selection Modal**:
  - [ ] "Quick Practice" option visible (5-7 exercises)
  - [ ] "Deep Dive" option visible (10-12 exercises)
  - [ ] Cancel button works
  - [ ] Selecting mode navigates to lesson engine

### Phase 4: Exercise Types
Test each exercise type appears and functions:

#### Multiple Choice
- [ ] Question displays in Russian
- [ ] Four answer options in English
- [ ] Selecting answer gives feedback
- [ ] Correct answer highlights green
- [ ] Wrong answer highlights red

#### Matching
- [ ] Left column shows Russian words
- [ ] Right column shows English translations (shuffled)
- [ ] Click/tap to match pairs
- [ ] Feedback shows when all matched
- [ ] Correct pairs highlighted

#### Fill in the Blank
- [ ] Sentence displays with blank space
- [ ] Input field accepts Russian text
- [ ] Submit button present
- [ ] Correct answer feedback
- [ ] Shows correct answer if wrong

#### Listen and Type
- [ ] Audio play button displays
- [ ] Input field for typing Russian word
- [ ] Submit button
- [ ] Audio playback works (if audio files present)
- [ ] Feedback on answer

### Phase 5: Lesson Flow
- [ ] **Progress Bar**: Updates as exercises complete
- [ ] **Score Counter**: Shows correct/total (e.g., "5/7")
- [ ] **Feedback Banner**:
  - [ ] Green banner for correct answers
  - [ ] Red banner for incorrect answers
  - [ ] "Next" button advances
  - [ ] "Finish" button on last exercise
- [ ] **Completion**: Navigates to results screen

### Phase 6: Navigation
- [ ] Back button returns to previous screen
- [ ] Close (X) button exits lesson
- [ ] Bottom tabs switch between sections
- [ ] Deep linking works (if implemented)

### Phase 7: Vocab Packs
- [ ] Navigate to "Packs" tab
- [ ] Packs display with descriptions
- [ ] Prerequisite indicator shows
- [ ] Activation toggle works
- [ ] Active packs persist

### Phase 8: Review Screen
- [ ] Navigate to "Review" tab
- [ ] Missed questions display (if any)
- [ ] Replay missed questions works
- [ ] Progress tracked

## Known Limitations in Browser Mode

### Audio Playback
Audio files need to be properly bundled and paths resolved. Placeholder implementation is in place. To enable:

1. Add audio files to `/assets/audio/alpha/` (33 letters)
2. Add audio files to `/assets/audio/lexemes/` (by lexeme_id)
3. Update `audioPlayer.ts` to use proper asset loading

### Placeholder Text
If you see: "Playing audio: /audio/alpha/a.mp3" in console, audio system is working but files are not yet loaded.

## Expected Console Output

### Normal Operation
```
Playing audio: /audio/alpha/a.mp3
Exercise generated for section: 101
```

### TypeScript Warnings (Safe to Ignore)
```
TS7006: Parameter implicitly has 'an any' type
```
These are from legacy .js files mixing with new .ts files.

## Common Issues

### Module Not Found
**Error**: "Cannot find module '../data/content.ts'"
**Fix**: Ensure TypeScript files are being processed. Check `tsconfig.json` includes.

### Navigation Error
**Error**: "The action 'NAVIGATE' with payload ... was not handled"
**Fix**: Verify screen names match in `App.js` and navigation calls.

### Style Issues on Web
**Issue**: Shadows or gradients not appearing
**Note**: Some React Native styles have limited web support. Fallbacks are in place.

## Performance Benchmarks

### Expected Load Times (Browser)
- Initial app load: < 3 seconds
- Navigate to section choice: < 500ms
- Generate exercises: < 100ms
- Render exercise: < 200ms

### Memory Usage
- Typical session: ~50-100 MB
- After 10 lessons: ~100-150 MB

## Testing on Mobile Devices

### iOS Simulator
```bash
npm run ios
```

Additional checks:
- [ ] Gesture navigation (swipe back)
- [ ] Keyboard behavior
- [ ] Touch feedback
- [ ] Audio playback

### Android Emulator
```bash
npm run android
```

Additional checks:
- [ ] Back button behavior
- [ ] Navigation drawer (if implemented)
- [ ] Hardware back button
- [ ] Audio formats supported

## Debugging Tips

### Enable Debug Mode
In `App.js`, add:
```javascript
console.log('Current route:', navigation.getCurrentRoute());
```

### View Exercise Data
In `LessonEngineScreen.js`:
```javascript
console.log('Generated exercises:', exercises);
```

### Check Content Loading
In `HomeScreen.js`:
```javascript
console.log('Loaded modules:', MODULES);
```

## Reporting Issues

When reporting issues, include:
1. Platform (Web/iOS/Android)
2. Browser (Chrome/Safari/Firefox)
3. Console errors (exact text)
4. Steps to reproduce
5. Expected vs actual behavior
6. Screenshots if applicable

## Success Criteria

All items in the testing checklist should pass for the browser mode to be considered production-ready. Currently:

✅ TypeScript configuration
✅ Navigation structure
✅ Screen implementations
✅ Exercise generation
✅ UI/UX styling
⚠️ Audio system (placeholder, needs assets)
⚠️ User progress persistence (needs backend or AsyncStorage)

## Next Steps for Production

1. **Add Audio Files**: Record and add all 33 alphabet sounds + lexeme pronunciations
2. **Persistence**: Implement AsyncStorage for user progress
3. **Error Boundaries**: Add React error boundaries for graceful failures
4. **Analytics**: Add tracking for learning patterns
5. **Accessibility**: Add screen reader support and keyboard navigation
6. **Internationalization**: Prepare for multiple languages
7. **Performance**: Optimize large module rendering
8. **Testing**: Add automated unit and integration tests

