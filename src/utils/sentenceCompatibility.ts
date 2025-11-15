// Compatibility checking system for verb-noun pairs in sentence generation
import type { Lexeme, VocabPack } from '../types/models';
import {
  getPackTheme,
  getLexemeTheme,
  areThemesCompatible,
  buildPackThemeMap,
} from './themeHelper';
import {
  loadCompatibilityPatterns,
  getCompatibilityPattern,
  saveCompatibilityPattern,
} from './compatibilityStorage';

/**
 * Get theme for a lexeme, checking both lexeme and pack themes
 */
export const getThemeForLexeme = (
  lexeme: Lexeme,
  packThemes?: Map<number, string>,
  vocabPacks?: VocabPack[],
  lexemeToPackMap?: Map<number, number>
): string | null => {
  // First check if lexeme has explicit semantic theme
  if (lexeme.semantic_theme) {
    return lexeme.semantic_theme;
  }

  // Check if lexeme belongs to a pack with a theme
  if (lexemeToPackMap && packThemes) {
    const packId = lexemeToPackMap.get(lexeme.lexeme_id);
    if (packId) {
      const theme = packThemes.get(packId);
      if (theme) {
        return theme;
      }
    }
  }

  // If vocabPacks provided, try to find pack by checking lexeme IDs
  if (vocabPacks) {
    for (const pack of vocabPacks) {
      if (pack.associated_lexemes.includes(lexeme.lexeme_id) && pack.theme) {
        return pack.theme;
      }
    }
  }

  return null;
};

/**
 * Check if a verb and noun are compatible
 * Uses multiple strategies in order of preference
 */
export const isCompatible = async (
  verb: Lexeme,
  noun: Lexeme,
  packThemes?: Map<number, string>,
  vocabPacks?: VocabPack[],
  lexemeToPackMap?: Map<number, number>
): Promise<boolean> => {
  // Strategy 1: Check explicit compatible IDs
  if (verb.compatible_noun_ids && verb.compatible_noun_ids.includes(noun.lexeme_id)) {
    return true;
  }
  if (noun.compatible_verb_ids && noun.compatible_verb_ids.includes(verb.lexeme_id)) {
    return true;
  }

  // Strategy 2: Check semantic theme compatibility
  const verbTheme = getThemeForLexeme(verb, packThemes, vocabPacks, lexemeToPackMap);
  const nounTheme = getThemeForLexeme(noun, packThemes, vocabPacks, lexemeToPackMap);

  if (verbTheme && nounTheme) {
    // Check if verb's compatible_themes includes noun's theme
    if (verb.compatible_themes && verb.compatible_themes.includes(nounTheme)) {
      return true;
    }
    // Check if themes match
    if (verbTheme === nounTheme) {
      return true;
    }
    // Check theme compatibility (e.g., 'readable' theme works with 'read' verb)
    if (areThemesCompatible(verbTheme, nounTheme)) {
      return true;
    }
  }

  // Strategy 3: Check stored compatibility patterns
  const storedPattern = await getCompatibilityPattern(verb.lexeme_id, noun.lexeme_id);
  if (storedPattern !== null) {
    return storedPattern;
  }

  // Strategy 4: If one has a theme and the other doesn't, allow it (prefer tagged items)
  if ((verbTheme && !nounTheme) || (!verbTheme && nounTheme)) {
    return true; // Prefer tagged items but allow untagged
  }

  // Strategy 5: If neither has tags, return false (will trigger fallback)
  if (!verbTheme && !nounTheme) {
    return false;
  }

  // Default: not compatible
  return false;
};

/**
 * Find compatible nouns for a verb
 */
export const findCompatibleNouns = async (
  verb: Lexeme,
  nouns: Lexeme[],
  packThemes?: Map<number, string>,
  vocabPacks?: VocabPack[],
  lexemeToPackMap?: Map<number, number>
): Promise<Lexeme[]> => {
  const compatible: Lexeme[] = [];

  for (const noun of nouns) {
    const compatibleResult = await isCompatible(
      verb,
      noun,
      packThemes,
      vocabPacks,
      lexemeToPackMap
    );
    if (compatibleResult) {
      compatible.push(noun);
    }
  }

  return compatible;
};

/**
 * Find compatible verbs for a noun
 */
export const findCompatibleVerbs = async (
  noun: Lexeme,
  verbs: Lexeme[],
  packThemes?: Map<number, string>,
  vocabPacks?: VocabPack[],
  lexemeToPackMap?: Map<number, number>
): Promise<Lexeme[]> => {
  const compatible: Lexeme[] = [];

  for (const verb of verbs) {
    const compatibleResult = await isCompatible(
      verb,
      noun,
      packThemes,
      vocabPacks,
      lexemeToPackMap
    );
    if (compatibleResult) {
      compatible.push(verb);
    }
  }

  return compatible;
};

/**
 * Store a compatibility pattern (learn from successful sentence generation)
 */
export const storeCompatibilityPattern = async (
  verbId: number,
  nounId: number,
  isCompatible: boolean
): Promise<void> => {
  await saveCompatibilityPattern(verbId, nounId, isCompatible);
};

/**
 * Build a map from lexeme IDs to pack IDs
 */
export const buildLexemeToPackMap = (
  vocabPacks: VocabPack[]
): Map<number, number> => {
  const map = new Map<number, number>();
  vocabPacks.forEach((pack) => {
    pack.associated_lexemes.forEach((lexemeId) => {
      map.set(lexemeId, pack.pack_id);
    });
  });
  return map;
};

/**
 * Find a compatible verb-noun pair from available lexemes
 * Returns null if no compatible pair found
 */
export const findCompatiblePair = async (
  verbs: Lexeme[],
  nouns: Lexeme[],
  packThemes?: Map<number, string>,
  vocabPacks?: VocabPack[],
  lexemeToPackMap?: Map<number, number>
): Promise<{ verb: Lexeme; noun: Lexeme } | null> => {
  if (verbs.length === 0 || nouns.length === 0) {
    return null;
  }

  // Shuffle to get random selection
  const shuffledVerbs = [...verbs].sort(() => Math.random() - 0.5);
  const shuffledNouns = [...nouns].sort(() => Math.random() - 0.5);

  // Try to find a compatible pair
  for (const verb of shuffledVerbs) {
    const compatibleNouns = await findCompatibleNouns(
      verb,
      shuffledNouns,
      packThemes,
      vocabPacks,
      lexemeToPackMap
    );

    if (compatibleNouns.length > 0) {
      const noun = compatibleNouns[Math.floor(Math.random() * compatibleNouns.length)];
      return { verb, noun };
    }
  }

  // If no compatible pairs found, return null (caller should handle fallback)
  return null;
};

