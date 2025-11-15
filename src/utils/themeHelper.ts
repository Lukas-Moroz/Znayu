// Theme management utilities for vocab pack and lexeme themes
import type { Lexeme, VocabPack } from '../types/models';

/**
 * Get theme for a vocab pack
 */
export const getPackTheme = (packId: number, vocabPacks: VocabPack[]): string | null => {
  const pack = vocabPacks.find((p) => p.pack_id === packId);
  return pack?.theme || null;
};

/**
 * Get theme for a lexeme (from lexeme itself or from its pack)
 */
export const getLexemeTheme = (
  lexeme: Lexeme,
  packThemes: Map<number, string>
): string | null => {
  // First check if lexeme has explicit theme
  if (lexeme.semantic_theme) {
    return lexeme.semantic_theme;
  }

  // Check if lexeme belongs to a pack with a theme
  // Note: This requires checking which pack the lexeme belongs to
  // For now, we'll rely on semantic_theme being set
  return null;
};

/**
 * Check if two themes are compatible
 * Uses a compatibility map that defines which themes work together
 */
export const areThemesCompatible = (
  theme1: string,
  theme2: string,
  compatibilityMap?: Map<string, string[]>
): boolean => {
  // If no compatibility map, only exact matches are compatible
  if (!compatibilityMap) {
    return theme1 === theme2;
  }

  // Check if theme1 is compatible with theme2
  const compatibleThemes = compatibilityMap.get(theme1);
  if (compatibleThemes && compatibleThemes.includes(theme2)) {
    return true;
  }

  // Check reverse (theme2 compatible with theme1)
  const reverseCompatible = compatibilityMap.get(theme2);
  if (reverseCompatible && reverseCompatible.includes(theme1)) {
    return true;
  }

  // Exact match is always compatible
  return theme1 === theme2;
};

/**
 * Suggest theme for a lexeme based on English translation
 * This is a simple heuristic-based approach
 */
export const suggestThemeForLexeme = (lexeme: Lexeme): string | null => {
  const translation = lexeme.english_translation.toLowerCase();
  const word = lexeme.russian_word.toLowerCase();

  // Food-related
  if (
    translation.includes('food') ||
    translation.includes('eat') ||
    translation.includes('drink') ||
    translation.includes('restaurant') ||
    translation.includes('café') ||
    translation.includes('menu') ||
    translation.includes('bill') ||
    word.includes('еда') ||
    word.includes('ресторан')
  ) {
    return 'food';
  }

  // Transit/transportation
  if (
    translation.includes('train') ||
    translation.includes('bus') ||
    translation.includes('car') ||
    translation.includes('travel') ||
    translation.includes('ticket') ||
    translation.includes('passenger') ||
    translation.includes('station') ||
    word.includes('поезд') ||
    word.includes('автобус')
  ) {
    return 'transit';
  }

  // Education
  if (
    translation.includes('student') ||
    translation.includes('university') ||
    translation.includes('school') ||
    translation.includes('teacher') ||
    translation.includes('study') ||
    word.includes('студент') ||
    word.includes('университет')
  ) {
    return 'education';
  }

  // Family
  if (
    translation.includes('dad') ||
    translation.includes('mom') ||
    translation.includes('father') ||
    translation.includes('mother') ||
    translation.includes('brother') ||
    translation.includes('sister') ||
    translation.includes('family') ||
    word.includes('папа') ||
    word.includes('мама')
  ) {
    return 'family';
  }

  // Hobbies/activities
  if (
    translation.includes('read') ||
    translation.includes('watch') ||
    translation.includes('listen') ||
    translation.includes('book') ||
    translation.includes('movie') ||
    translation.includes('music') ||
    word.includes('читать') ||
    word.includes('смотреть')
  ) {
    return 'hobbies';
  }

  // Readable items
  if (
    translation.includes('book') ||
    translation.includes('magazine') ||
    translation.includes('newspaper') ||
    translation.includes('article') ||
    word.includes('книга')
  ) {
    return 'readable';
  }

  // Edible items
  if (
    translation.includes('apple') ||
    translation.includes('bread') ||
    translation.includes('food') ||
    translation.includes('meal') ||
    word.includes('яблоко') ||
    word.includes('хлеб')
  ) {
    return 'edible';
  }

  // Locations
  if (
    translation.includes('university') ||
    translation.includes('house') ||
    translation.includes('home') ||
    translation.includes('restaurant') ||
    translation.includes('café') ||
    word.includes('университет') ||
    word.includes('дом')
  ) {
    return 'location';
  }

  return null;
};

/**
 * Build a map of pack IDs to themes from vocab packs
 */
export const buildPackThemeMap = (vocabPacks: VocabPack[]): Map<number, string> => {
  const map = new Map<number, string>();
  vocabPacks.forEach((pack) => {
    if (pack.theme) {
      map.set(pack.pack_id, pack.theme);
    }
  });
  return map;
};

