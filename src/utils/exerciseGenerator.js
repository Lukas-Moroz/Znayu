import { getLexemesByModule } from '../data/content';

// Shuffle array helper
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get random items from array
const getRandomItems = (array, count) => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

// Generate Multiple Choice Exercise
const generateMultipleChoice = (lexemes, exerciseId) => {
  const correctLexeme = lexemes[Math.floor(Math.random() * lexemes.length)];
  const wrongLexemes = lexemes.filter(l => l.lexeme_id !== correctLexeme.lexeme_id);
  const wrongOptions = getRandomItems(wrongLexemes, 3);
  
  const options = shuffleArray([
    correctLexeme.english_translation,
    ...wrongOptions.map(l => l.english_translation)
  ]);

  return {
    id: exerciseId,
    type: 'MULTIPLE_CHOICE',
    prompt: `What does "${correctLexeme.russian_word}" mean?`,
    options,
    correctAnswer: correctLexeme.english_translation,
    audio: correctLexeme.audio_file_path,
    conceptId: `vocab_${correctLexeme.part_of_speech}`
  };
};

// Generate Matching Exercise
const generateMatching = (lexemes, exerciseId) => {
  const selectedLexemes = getRandomItems(lexemes, 5);
  
  const leftColumn = selectedLexemes.map(l => l.russian_word);
  const rightColumn = shuffleArray(selectedLexemes.map(l => l.english_translation));
  
  const correctPairs = {};
  selectedLexemes.forEach(l => {
    correctPairs[l.russian_word] = l.english_translation;
  });

  return {
    id: exerciseId,
    type: 'MATCHING',
    leftColumn,
    rightColumn,
    correctPairs,
    conceptId: 'matching_vocabulary'
  };
};

// Generate Fill in the Blank Exercise
const generateFillInBlank = (lexemes, exerciseId) => {
  const targetLexeme = lexemes[Math.floor(Math.random() * lexemes.length)];
  
  // Create simple sentences based on part of speech
  let part1 = '';
  let part2 = '';
  
  if (targetLexeme.part_of_speech === 'NOUN') {
    part1 = 'Это';
    part2 = `(This is a ${targetLexeme.english_translation})`;
  } else if (targetLexeme.part_of_speech === 'VERB') {
    part1 = 'Я хочу';
    part2 = `(I want to ${targetLexeme.english_translation})`;
  } else {
    part1 = '';
    part2 = `means "${targetLexeme.english_translation}"`;
  }

  return {
    id: exerciseId,
    type: 'FILL_IN_BLANK',
    part1,
    part2,
    correctAnswer: targetLexeme.russian_word,
    conceptId: `spelling_${targetLexeme.part_of_speech}`
  };
};

// Generate Listen and Type Exercise
const generateListenType = (lexemes, exerciseId) => {
  const targetLexeme = lexemes[Math.floor(Math.random() * lexemes.length)];

  return {
    id: exerciseId,
    type: 'LISTEN_TYPE',
    audio: targetLexeme.audio_file_path || '/audio/placeholder.mp3',
    correctAnswer: targetLexeme.russian_word,
    conceptId: `listening_${targetLexeme.part_of_speech}`
  };
};

// Main exercise generator function
export const generateExercises = (module, mode, activePackIds = []) => {
  const lexemes = getLexemesByModule(module.module_number, activePackIds);
  
  if (lexemes.length === 0) {
    return [];
  }

  const exercises = [];
  let exerciseId = 1000 + module.module_number * 100;

  if (mode === 'quick') {
    // Quick Practice: 5-7 exercises, only MATCHING and FILL_IN_BLANK
    const exerciseCount = 5 + Math.floor(Math.random() * 3); // 5-7
    
    for (let i = 0; i < exerciseCount; i++) {
      const exerciseType = Math.random() < 0.5 ? 'matching' : 'fillInBlank';
      
      if (exerciseType === 'matching' && lexemes.length >= 5) {
        exercises.push(generateMatching(lexemes, exerciseId++));
      } else {
        exercises.push(generateFillInBlank(lexemes, exerciseId++));
      }
    }
  } else {
    // Deep Dive: 10-12 exercises, all types
    const exerciseCount = 10 + Math.floor(Math.random() * 3); // 10-12
    
    const exerciseTypes = [
      'multipleChoice',
      'matching',
      'fillInBlank',
      'listenType'
    ];
    
    for (let i = 0; i < exerciseCount; i++) {
      const typeIndex = i % exerciseTypes.length;
      const exerciseType = exerciseTypes[typeIndex];
      
      switch (exerciseType) {
        case 'multipleChoice':
          if (lexemes.length >= 4) {
            exercises.push(generateMultipleChoice(lexemes, exerciseId++));
          }
          break;
        case 'matching':
          if (lexemes.length >= 5) {
            exercises.push(generateMatching(lexemes, exerciseId++));
          }
          break;
        case 'fillInBlank':
          exercises.push(generateFillInBlank(lexemes, exerciseId++));
          break;
        case 'listenType':
          exercises.push(generateListenType(lexemes, exerciseId++));
          break;
      }
    }
  }

  return shuffleArray(exercises);
};