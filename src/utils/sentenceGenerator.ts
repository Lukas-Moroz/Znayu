// Sentence generator for creating Russian sentences from vocabulary
import { buildPhrase, getCaseForm, getVerbForm, getNounGender } from './russianDictionary';
import type { Lexeme, VocabPack } from '../types/models';
import {
  findCompatiblePair,
  buildLexemeToPackMap,
  isCompatible,
} from './sentenceCompatibility';
import { buildPackThemeMap } from './themeHelper';

type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Generate a Russian sentence from a list of vocabulary words
 * @param words - Array of Russian words (can be verbs, nouns, etc.)
 * @param difficulty - Difficulty level
 */
export const generateSentence = (
  words: string[],
  difficulty: Difficulty = 'easy'
): string | null => {
  if (!words || words.length === 0) return null;

  // Simple sentence patterns for easy difficulty
  if (difficulty === 'easy') {
    // Pattern: Я [verb] [noun in accusative]
    const verbs = words.filter((w) => 
      w.toLowerCase().endsWith('ть') || 
      w.toLowerCase().endsWith('ти') || 
      w.toLowerCase().endsWith('чь')
    );
    const nouns = words.filter((w) => !verbs.includes(w));

    if (verbs.length > 0 && nouns.length > 0) {
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      return buildPhrase('я', verb, noun, 'accusative');
    }

    // Fallback: simple verb sentence
    if (verbs.length > 0) {
      const verb = verbs[0];
      const conjugated = getVerbForm(verb, 'я');
      return `Я ${conjugated}`;
    }
  }

  // Medium difficulty: add more complexity
  if (difficulty === 'medium') {
    const verbs = words.filter((w) => 
      w.toLowerCase().endsWith('ть') || 
      w.toLowerCase().endsWith('ти') || 
      w.toLowerCase().endsWith('чь')
    );
    const nouns = words.filter((w) => !verbs.includes(w));

    if (verbs.length > 0 && nouns.length > 0) {
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const pronouns: Array<'я' | 'ты' | 'он' | 'она' | 'мы'> = ['я', 'ты', 'он', 'она', 'мы'];
      const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
      return buildPhrase(pronoun, verb, noun, 'accusative');
    }
  }

  // Hard difficulty: multiple nouns, different cases
  if (difficulty === 'hard') {
    const verbs = words.filter((w) => 
      w.toLowerCase().endsWith('ть') || 
      w.toLowerCase().endsWith('ти') || 
      w.toLowerCase().endsWith('чь')
    );
    const nouns = words.filter((w) => !verbs.includes(w));

    if (verbs.length > 0 && nouns.length >= 2) {
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      const noun1 = nouns[Math.floor(Math.random() * nouns.length)];
      const noun2 = nouns.filter((n) => n !== noun1)[Math.floor(Math.random() * (nouns.length - 1))];
      
      const pronouns: Array<'я' | 'ты' | 'он' | 'она' | 'мы'> = ['я', 'ты', 'он', 'она', 'мы'];
      const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
      
      const conjugatedVerb = getVerbForm(verb, pronoun);
      const casedNoun1 = getCaseForm(noun1, 'accusative', getNounGender(noun1));
      const casedNoun2 = getCaseForm(noun2, 'prepositional', getNounGender(noun2));
      
      const capitalizedPronoun = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
      return `${capitalizedPronoun} ${conjugatedVerb} ${casedNoun1} в ${casedNoun2}`;
    }
  }

  return null;
};

/**
 * Generate a sentence from lexemes (with part of speech info)
 * Always uses semantic compatibility checking for coherent sentences
 */
export const generateSentenceFromLexemes = async (
  lexemes: Lexeme[],
  difficulty: Difficulty = 'easy',
  vocabPacks?: VocabPack[],
  activePackIds?: number[]
): Promise<string | null> => {
  if (!lexemes || lexemes.length === 0) return null;

  const verbs = lexemes.filter((l) => l.part_of_speech === 'VERB');
  const nouns = lexemes.filter((l) => l.part_of_speech === 'NOUN');

  // Always try semantic compatibility checking if we have both verbs and nouns
  if (verbs.length > 0 && nouns.length > 0) {
    // Build theme maps for compatibility checking
    // Use vocabPacks if provided, otherwise use empty arrays (will rely on lexeme-level semantic_theme)
    const activePacks = vocabPacks && activePackIds
      ? vocabPacks.filter((p) => activePackIds.includes(p.pack_id))
      : [];
    const packThemes = buildPackThemeMap(activePacks);
    const lexemeToPackMap = buildLexemeToPackMap(activePacks);

    // Try to find a compatible pair using semantics
    const compatiblePair = await findCompatiblePair(
      verbs,
      nouns,
      packThemes,
      activePacks,
      lexemeToPackMap
    );

    if (compatiblePair) {
      const { verb, noun } = compatiblePair;
      return buildPhrase('я', verb.russian_word, noun.russian_word, 'accusative');
    }
  }

  // Fallback to original logic only if semantic compatibility failed
  const words = lexemes.map((l) => l.russian_word);
  return generateSentence(words, difficulty);
};

/**
 * Extract words from a sentence
 */
export const extractWords = (sentence: string): string[] => {
  if (!sentence) return [];
  return sentence
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0 && !['в', 'на', 'с', 'к', 'от', 'для', 'о', 'об'].includes(w.toLowerCase()));
};

/**
 * Check if vocabulary is sufficient to generate sentences
 */
export const canGenerateSentences = (vocab: string[]): boolean => {
  if (!vocab || vocab.length < 2) return false;
  
  // Need at least one verb and one noun
  const hasVerb = vocab.some((w) => 
    w.toLowerCase().endsWith('ть') || 
    w.toLowerCase().endsWith('ти') || 
    w.toLowerCase().endsWith('чь')
  );
  
  const hasNoun = vocab.some((w) => {
    const lower = w.toLowerCase();
    return !hasVerb || (!lower.endsWith('ть') && !lower.endsWith('ти') && !lower.endsWith('чь'));
  });
  
  return hasVerb && hasNoun;
};

/**
 * Generate multiple sentences
 */
export const generateSentences = (
  words: string[],
  count: number = 5,
  difficulty: Difficulty = 'easy'
): string[] => {
  if (!canGenerateSentences(words)) {
    console.warn('Vocabulary insufficient to generate sentences');
    return [];
  }
  
  const sentences: string[] = [];
  const maxAttempts = count * 3; // Try up to 3x to get unique sentences
  let attempts = 0;
  
  while (sentences.length < count && attempts < maxAttempts) {
    const sentence = generateSentence(words, difficulty);
    if (sentence && !sentences.includes(sentence)) {
      sentences.push(sentence);
    }
    attempts++;
  }
  
  return sentences;
};

