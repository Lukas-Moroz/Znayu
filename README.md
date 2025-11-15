# Znayu - Russian Language Learning App

A comprehensive Russian language learning application built with React Native and Expo, aligned with Anna Kudyma's "Beginning Russian" textbook pedagogy.

## 🌟 Features

### Core Learning Modules
- **Module 0: Cyrillic Alphabet** - Interactive alphabet learning with dual learn/quiz modes
- **Structured Modules** - Organized by textbook chapters with grammar, vocabulary, and spelling sections
- **Section-Based Learning** - Each module divided into focused sections (Grammar, Vocabulary, Spelling, Listening, Mixed Review)
- **Context-Aware Exercises** - Sentences generated using learned vocabulary and appropriate grammar rules

### Exercise Types
- **Multiple Choice** - Test vocabulary recognition with audio support
- **Matching** - Connect Russian words with English translations
- **Fill in the Blank** - Apply grammar rules in context
- **Listen and Type** - Practice spelling and listening comprehension
- **Alphabet Quiz** - Master Cyrillic letter sounds

### Progress Tracking
- Daily streak counter
- Module completion tracking
- Section-based progress
- Missed questions review system
- Vocab pack management

### Learning Modes
- **Quick Practice** - 5-7 focused exercises for daily review
- **Deep Dive** - 10-12 comprehensive exercises for thorough practice

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI (installed globally): `npm install -g expo-cli`

### Installation

```bash
# Clone the repository
cd Znayu

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platforms
npm run web       # Run in browser (Expo Web)
npm run ios       # Run on iOS simulator
npm run android   # Run on Android emulator
```

### TypeScript Support

The project now includes TypeScript for better type safety and developer experience:

```bash
# Run type checking
npm run type-check
```

## 📁 Project Structure

```
Znayu/
├── App.js                      # Main app entry with navigation
├── src/
│   ├── components/             # Reusable components
│   │   ├── AlphabetQuizComponent.tsx
│   │   ├── FillInTheBlankComponent.js
│   │   ├── LessonChoiceModal.js
│   │   ├── ListenTypeComponent.js
│   │   ├── MatchingComponent.js
│   │   └── MultipleChoiceSoundComponent.js
│   ├── context/               # React Context providers
│   │   └── UserContext.js     # User progress and state management
│   ├── data/                  # Content and data models
│   │   └── content.ts         # Lexemes, modules, sections, grammar rules
│   ├── screens/               # Main app screens
│   │   ├── AlphabetLearningScreen.tsx  # Module 0 alphabet learning
│   │   ├── HomeScreen.js              # Module path interface
│   │   ├── LessonEngineScreen.js      # Exercise execution
│   │   ├── LessonResultsScreen.js     # Post-lesson summary
│   │   ├── PacksScreen.js             # Vocab pack management
│   │   ├── ReviewScreen.js            # Missed questions review
│   │   └── SectionChoiceScreen.tsx    # Section selection interface
│   ├── types/                 # TypeScript type definitions
│   │   └── models.ts          # Core data model types
│   └── utils/                 # Utility functions
│       ├── audioPlayer.ts     # Audio playback utilities
│       └── exerciseGenerator.ts  # Context-aware exercise generation
├── assets/                    # Static assets
│   └── audio/                 # Audio files
│       ├── alpha/             # Alphabet pronunciation (33 letters)
│       └── lexemes/           # Word pronunciations
├── package.json
└── tsconfig.json             # TypeScript configuration
```

## 🎓 Pedagogical Approach

### Alignment with Anna Kudyma's Textbook
The app is structured to complement "Beginning Russian" by following the same progression:
- Modules correspond to textbook chapters
- Grammar rules introduced at appropriate levels
- Vocabulary builds progressively
- Exercises reinforce chapter concepts

### Section-Based Learning
Each module is divided into focused sections:

1. **Grammar** - Apply grammatical concepts with fill-in-blank exercises
2. **Vocabulary** - Build word recognition with matching and multiple choice
3. **Spelling** - Practice writing with listen-and-type exercises
4. **Listening** - Develop comprehension with audio-based exercises
5. **Mixed Review** - Consolidate all skills

### Context-Aware Exercise Generation
Exercises are dynamically generated using:
- Current module's vocabulary
- Previously learned words from earlier modules
- Active vocabulary packs
- Relevant grammar rules
- Sentence templates that make logical sense

## 📚 Content Management

### Adding New Modules
Edit `/src/data/content.ts`:

```typescript
{
  module_id: 4,
  module_number: 4,
  title_english: 'Daily Routines',
  title_russian: 'Распорядок дня',
  associated_lexemes: [28, 29, 30, ...],
  associated_grammar: [6, 7],
  textbook_chapter: 4,
  sections: [
    {
      section_id: 401,
      section_name: 'Time Expressions',
      section_type: SectionType.VOCABULARY,
      associated_lexemes: [28, 29, 30],
      associated_grammar: [],
      order: 1,
    },
    // ... more sections
  ],
}
```

### Adding Vocabulary

```typescript
{
  lexeme_id: 28,
  russian_word: 'утро',
  english_translation: 'morning',
  part_of_speech: PartOfSpeech.NOUN,
  gender: Gender.NEUTER,
  audio_file_path: '/audio/lexemes/28.mp3',
}
```

### Creating Vocabulary Packs

```typescript
{
  pack_id: 2,
  pack_name: 'Travel Pack',
  description: 'Essential vocabulary for travel and transportation',
  associated_lexemes: [106, 107, 108, ...],
  prerequisite_module: 2,
  icon: 'airplane',
  word_count: 15,
}
```

## 🎵 Audio Files

### Required Audio Structure
```
assets/audio/
├── alpha/              # Alphabet sounds (33 files)
│   ├── a.mp3
│   ├── b.mp3
│   ├── v.mp3
│   └── ...
└── lexemes/            # Word pronunciations
    ├── 1.mp3          # Based on lexeme_id
    ├── 2.mp3
    └── ...
```

### Audio Implementation
The app uses `expo-av` for audio playback. Utility functions are available in `/src/utils/audioPlayer.ts`:

```typescript
import { playAlphabetLetter, playLexeme } from '../utils/audioPlayer';

// Play alphabet letter
await playAlphabetLetter('a');

// Play lexeme pronunciation
await playLexeme(28);
```

## 🌐 Browser Mode (Expo Web)

The app runs seamlessly in browser mode for easy testing and development:

```bash
npm run web
```

Features verified for web:
- All React Native components render correctly
- Touch interactions work with mouse clicks
- Audio playback (requires browser audio support)
- Navigation flows
- Responsive layout for desktop browsers

## 🧪 Testing

### Type Checking
```bash
npm run type-check
```

### Manual Testing Checklist
- [ ] Module 0 alphabet learning (learn + quiz modes)
- [ ] Section selection interface
- [ ] All exercise types (5 types)
- [ ] Navigation flows (home → sections → exercises → results)
- [ ] Progress tracking and streak counter
- [ ] Vocab pack activation
- [ ] Audio playback (alphabet and lexemes)
- [ ] Quick vs Deep dive modes
- [ ] Browser compatibility (Expo Web)
- [ ] Mobile responsiveness

## 🔄 Migration from Old Structure

### Changes Made
1. **TypeScript Integration** - Added types for better code quality
2. **Section-Based Modules** - Modules now have subdivisions
3. **Enhanced Exercise Generator** - Context-aware sentence generation
4. **New Screens** - AlphabetLearningScreen, SectionChoiceScreen
5. **Audio System** - Unified audio playback utilities
6. **Modern UI** - Updated styling with better visual hierarchy

### Deprecated Files
The following file should be removed after verifying the migration:
- `/src/data/content.js` (replaced by `content.ts`)

## 📱 Platform Support

- **Web (Expo Web)** - Fully supported for browser-based learning
- **iOS** - Native app support via Expo
- **Android** - Native app support via Expo

## 🤝 Contributing

When adding content:
1. Follow the existing data structure in `content.ts`
2. Ensure lexeme IDs are unique
3. Add audio files for new vocabulary
4. Update section associations appropriately
5. Test exercises with the new content

## 📄 License

[Add your license information here]

## 🙏 Acknowledgments

- Curriculum based on "Beginning Russian" by Anna Kudyma
- Built with React Native and Expo
- Icons from @expo/vector-icons (Ionicons)

---

**Note**: This app is designed to complement formal Russian language instruction and should be used alongside the textbook for optimal learning outcomes.
