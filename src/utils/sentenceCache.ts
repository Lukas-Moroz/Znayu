// Sentence caching utility using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateSentences, generateSentenceFromLexemes } from './sentenceGenerator';
import type { Lexeme, VocabPack } from '../types/models';

type Difficulty = 'easy' | 'medium' | 'hard';

// In-memory cache for faster access
const memoryCache: Map<string, string[]> = new Map();

/**
 * Generate cache key from vocabulary
 */
const getCacheKey = (vocabKey: string, difficulty: Difficulty): string => {
  return `sentences_${vocabKey}_${difficulty}`;
};

/**
 * Get cached sentences or generate new ones
 */
export const getCachedSentences = async (
  vocabKey: string,
  generator: () => string[],
  difficulty: Difficulty = 'easy'
): Promise<string[]> => {
  const cacheKey = getCacheKey(vocabKey, difficulty);

  // Check memory cache first
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // Check AsyncStorage
  try {
    const stored = await AsyncStorage.getItem(cacheKey);
    if (stored) {
      const sentences = JSON.parse(stored);
      memoryCache.set(cacheKey, sentences);
      return sentences;
    }
  } catch (error) {
    console.error('Error reading from AsyncStorage:', error);
  }

  // Generate and cache
  const sentences = generator();
  
  // Store in memory
  memoryCache.set(cacheKey, sentences);
  
  // Store in AsyncStorage (async, don't wait)
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(sentences));
  } catch (error) {
    console.error('Error writing to AsyncStorage:', error);
  }

  return sentences;
};

/**
 * Get cached sentences from words array
 */
export const getCachedSentencesFromWords = async (
  words: string[],
  count: number = 5,
  difficulty: Difficulty = 'easy'
): Promise<string[]> => {
  const vocabKey = words.sort().join('_');
  
  return getCachedSentences(
    vocabKey,
    () => {
      // Import here to avoid circular dependency
      const { generateSentences } = require('./sentenceGenerator');
      return generateSentences(words, count, difficulty);
    },
    difficulty
  );
};

/**
 * Get cached sentences from lexemes
 * Now supports semantic compatibility checking via vocabPacks
 */
export const getCachedSentencesFromLexemes = async (
  lexemes: Lexeme[],
  count: number = 5,
  difficulty: Difficulty = 'easy',
  vocabPacks?: VocabPack[],
  activePackIds?: number[]
): Promise<string[]> => {
  const vocabKey = lexemes
    .map((l) => l.russian_word)
    .sort()
    .join('_');
  
  return getCachedSentences(
    vocabKey,
    async () => {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        const sentence = await generateSentenceFromLexemes(lexemes, difficulty, vocabPacks, activePackIds);
        if (sentence && !sentences.includes(sentence)) {
          sentences.push(sentence);
        }
      }
      return sentences;
    },
    difficulty
  );
};

/**
 * Clear cache for a specific vocabulary key
 */
export const clearCache = async (vocabKey: string, difficulty?: Difficulty): Promise<void> => {
  if (difficulty) {
    const cacheKey = getCacheKey(vocabKey, difficulty);
    memoryCache.delete(cacheKey);
    try {
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  } else {
    // Clear all difficulties for this vocab
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    for (const diff of difficulties) {
      const cacheKey = getCacheKey(vocabKey, diff);
      memoryCache.delete(cacheKey);
      try {
        await AsyncStorage.removeItem(cacheKey);
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }
  }
};

/**
 * Clear all sentence caches
 */
export const clearAllCaches = async (): Promise<void> => {
  memoryCache.clear();
  try {
    const keys = await AsyncStorage.getAllKeys();
    const sentenceKeys = keys.filter((key) => key.startsWith('sentences_'));
    await AsyncStorage.multiRemove(sentenceKeys);
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
};

