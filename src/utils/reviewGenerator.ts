// Review exercise generator - creates exercises with same concept but different wrong answers
import {
  getLexemesByIds,
  getAllLexemes,
  GRAMMAR_RULES,
  CHAPTERS,
} from '../data/content';
import { Exercise, Lexeme, GrammarRule, MissedQuestion } from '../types/models';
import { getCaseForm, getVerbForm } from './russianDictionary';

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get random items from array
const getRandomItems = <T,>(array: T[], count: number): T[] => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Generate a review exercise from a missed question
 * Keeps the same concept and correct answer, but generates different wrong answers
 */
export const generateReviewExercise = (
  originalExercise: Exercise,
  missedQuestion: MissedQuestion,
  allLexemes: Lexeme[],
  allGrammarRules: GrammarRule[]
): Exercise => {
  const newExercise: Exercise = {
    ...originalExercise,
    id: originalExercise.id + 1000000, // Offset to avoid conflicts
  };

  switch (originalExercise.type) {
    case 'MULTIPLE_CHOICE':
      return generateReviewMultipleChoice(originalExercise, missedQuestion, allLexemes);
    
    case 'MATCHING':
      return generateReviewMatching(originalExercise, missedQuestion, allLexemes);
    
    case 'FILL_IN_BLANK':
      return generateReviewFillInBlank(originalExercise, missedQuestion, allLexemes, allGrammarRules);
    
    case 'LISTEN_TYPE':
      // For listen type, we can't really change much, but we can keep it the same
      return newExercise;
    
    default:
      return newExercise;
  }
};

/**
 * Generate review multiple choice with different wrong answers
 */
const generateReviewMultipleChoice = (
  original: Exercise,
  missedQuestion: MissedQuestion,
  allLexemes: Lexeme[]
): Exercise => {
  if (!original.options || !original.correctAnswer) {
    return original;
  }

  // Get the correct lexeme
  const correctLexeme = allLexemes.find(
    l => l.english_translation === original.correctAnswer
  );

  if (!correctLexeme) {
    return original; // Fallback to original if we can't find the lexeme
  }

  // Get lexemes from the same chapter for wrong answers
  let candidateLexemes: Lexeme[] = [];
  
  if (missedQuestion.chapterId) {
    const chapter = CHAPTERS.find(ch => ch.chapter_id === missedQuestion.chapterId);
    if (chapter) {
      candidateLexemes = getLexemesByIds(chapter.associated_lexemes);
    }
  }

  // If we don't have enough from chapter, use all lexemes
  if (candidateLexemes.length < 4) {
    candidateLexemes = allLexemes;
  }

  // Filter out the correct answer and original wrong answers
  const originalWrongAnswers = original.options.filter(opt => opt !== original.correctAnswer);
  const wrongLexemes = candidateLexemes.filter(
    l => l.lexeme_id !== correctLexeme.lexeme_id &&
         !originalWrongAnswers.includes(l.english_translation)
  );

  // Get 3 different wrong answers
  const wrongOptions = getRandomItems(wrongLexemes, 3).map(l => l.english_translation);

  // Combine and shuffle
  const newOptions = shuffleArray([original.correctAnswer, ...wrongOptions]);

  return {
    ...original,
    id: original.id + 1000000,
    options: newOptions,
  };
};

/**
 * Generate review matching with different items
 */
const generateReviewMatching = (
  original: Exercise,
  missedQuestion: MissedQuestion,
  allLexemes: Lexeme[]
): Exercise => {
  if (!original.leftColumnItems || !original.rightColumnItems || !original.correctPairs) {
    return original;
  }

  // Get lexemes from the same chapter
  let candidateLexemes: Lexeme[] = [];
  
  if (missedQuestion.chapterId) {
    const chapter = CHAPTERS.find(ch => ch.chapter_id === missedQuestion.chapterId);
    if (chapter) {
      candidateLexemes = getLexemesByIds(chapter.associated_lexemes);
    }
  }

  if (candidateLexemes.length < 5) {
    candidateLexemes = allLexemes;
  }

  // Get original lexeme IDs that were used
  const originalLexemeIds = new Set(
    candidateLexemes
      .filter(l => original.leftColumnItems?.includes(l.russian_word))
      .map(l => l.lexeme_id)
  );

  // Get new lexemes (different from original)
  const availableLexemes = candidateLexemes.filter(
    l => !originalLexemeIds.has(l.lexeme_id)
  );

  // Select 5 new lexemes (or as many as available)
  const selectedLexemes = getRandomItems(availableLexemes, Math.min(5, availableLexemes.length));

  // If we don't have enough new ones, mix with some originals
  if (selectedLexemes.length < 5) {
    const originalLexemes = candidateLexemes.filter(l => originalLexemeIds.has(l.lexeme_id));
    const additional = getRandomItems(originalLexemes, 5 - selectedLexemes.length);
    selectedLexemes.push(...additional);
  }

  const newLeftColumnItems = selectedLexemes.map(l => l.russian_word);
  const newRightColumnItems = shuffleArray(selectedLexemes.map(l => l.english_translation));

  const newCorrectPairs: Record<string, string> = {};
  selectedLexemes.forEach(l => {
    newCorrectPairs[l.russian_word] = l.english_translation;
  });

  return {
    ...original,
    id: original.id + 1000000,
    leftColumnItems: newLeftColumnItems,
    rightColumnItems: newRightColumnItems,
    correctPairs: newCorrectPairs,
  };
};

/**
 * Generate review fill-in-blank with different sentence structure
 */
const generateReviewFillInBlank = (
  original: Exercise,
  missedQuestion: MissedQuestion,
  allLexemes: Lexeme[],
  allGrammarRules: GrammarRule[]
): Exercise => {
  if (!original.correctAnswer || !original.sentencePart1) {
    return original;
  }

  // Try to find the correct lexeme
  const correctLexeme = allLexemes.find(
    l => l.russian_word === original.correctAnswer || 
         l.russian_word.toLowerCase() === original.correctAnswer.toLowerCase()
  );

  if (!correctLexeme) {
    return original; // Fallback
  }

  // Get grammar rules if available
  let grammarRules: GrammarRule[] = [];
  if (missedQuestion.grammarRuleId) {
    const rule = allGrammarRules.find(r => r.rule_id === missedQuestion.grammarRuleId);
    if (rule) {
      grammarRules = [rule];
    }
  }

  // Determine case type from grammar rules
  let caseType: 'accusative' | 'prepositional' | 'genitive' = 'accusative';
  if (grammarRules.length > 0) {
    const ruleName = grammarRules[0].rule_name.toLowerCase();
    if (ruleName.includes('prepositional')) {
      caseType = 'prepositional';
    } else if (ruleName.includes('genitive')) {
      caseType = 'genitive';
    }
  }

  // Get the correct answer in the appropriate case
  const correctAnswer = getCaseForm(correctLexeme.russian_word, caseType, correctLexeme.gender);

  // Try to create a different sentence structure
  const sentenceTemplates = [
    { part1: 'Я читаю', part2: '(I read ___)' },
    { part1: 'Я смотрю', part2: '(I watch ___)' },
    { part1: 'Я люблю', part2: '(I love ___)' },
    { part1: 'Я живу в', part2: '(I live in ___)' },
    { part1: 'Мы в', part2: '(We are in ___)' },
  ];

  // Pick a different template than the original
  const availableTemplates = sentenceTemplates.filter(
    t => t.part1 !== original.sentencePart1
  );
  const selectedTemplate = availableTemplates.length > 0
    ? getRandomItems(availableTemplates, 1)[0]
    : sentenceTemplates[0];

  return {
    ...original,
    id: original.id + 1000000,
    sentencePart1: selectedTemplate.part1,
    sentencePart2: selectedTemplate.part2,
    correctAnswer,
  };
};

