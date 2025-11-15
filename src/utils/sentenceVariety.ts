// Sentence variety generator for creating varied sentences from same concepts
import type { Lexeme, GrammarRule } from '../types/models';
import { getCaseForm, getVerbForm, getNounGender } from './russianDictionary';

/**
 * Get available adjectives that can modify nouns
 */
export const getAvailableAdjectives = (
  nouns: Lexeme[],
  allLexemes: Lexeme[]
): Lexeme[] => {
  return allLexemes.filter(
    (lexeme) => lexeme.part_of_speech === 'ADJECTIVE'
  );
};

/**
 * Generate a varied sentence with optional adjective
 */
export const generateVariedSentence = (
  verb: Lexeme,
  noun: Lexeme,
  adjectives: Lexeme[],
  grammarRules: GrammarRule[],
  options?: {
    includeAdjective?: boolean;
    pronoun?: 'я' | 'ты' | 'он' | 'она' | 'мы' | 'вы' | 'они';
    caseType?: 'accusative' | 'prepositional' | 'genitive';
    useDifferentPhrasing?: boolean;
  }
): { part1: string; part2: string; adjective?: Lexeme } => {
  const {
    includeAdjective = false,
    pronoun = 'я',
    caseType,
    useDifferentPhrasing = false,
  } = options || {};

  // Determine case type from grammar rules if not provided
  let finalCaseType: 'accusative' | 'prepositional' | 'genitive' = caseType || 'accusative';
  if (!caseType) {
    const hasAccusativeRule = grammarRules.some((r) =>
      r.rule_name.toLowerCase().includes('accusative')
    );
    const hasPrepositionalRule = grammarRules.some((r) =>
      r.rule_name.toLowerCase().includes('prepositional')
    );

    if (hasPrepositionalRule && !hasAccusativeRule) {
      finalCaseType = 'prepositional';
    }
  }

  // Get conjugated verb
  const conjugatedVerb = getVerbForm(verb.russian_word, pronoun);

  // Select adjective if requested and available
  let selectedAdjective: Lexeme | undefined;
  if (includeAdjective && adjectives.length > 0) {
    // Filter adjectives that match noun gender
    const genderMatchingAdjectives = adjectives.filter((adj) => {
      // For now, we'll use any adjective (can be enhanced with gender matching)
      return true;
    });
    
    if (genderMatchingAdjectives.length > 0) {
      selectedAdjective =
        genderMatchingAdjectives[Math.floor(Math.random() * genderMatchingAdjectives.length)];
    }
  }

  // Get cased noun
  const casedNoun = getCaseForm(noun.russian_word, finalCaseType, noun.gender);

  // Build sentence parts
  let part1 = '';
  let part2 = '';

  // Different phrasings
  if (useDifferentPhrasing) {
    // Alternative phrasings like "I am reading" vs "I read"
    // For now, we'll use simple present tense
    const pronounCapitalized = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
    
    if (selectedAdjective) {
      // Get adjective in correct case and gender
      const adjectiveForm = getCaseForm(
        selectedAdjective.russian_word,
        finalCaseType,
        noun.gender
      );
      part1 = `${pronounCapitalized} ${conjugatedVerb} ${adjectiveForm} ${casedNoun}`;
    } else {
      part1 = `${pronounCapitalized} ${conjugatedVerb} ${casedNoun}`;
    }

    // Build English translation
    const preposition = finalCaseType === 'prepositional' ? 'in ' : '';
    const article = finalCaseType === 'prepositional' ? '' : 'a ';
    const adjectiveText = selectedAdjective
      ? `${selectedAdjective.english_translation} `
      : '';
    part2 = `(${pronounCapitalized} ${verb.english_translation} ${preposition}${article}${adjectiveText}${noun.english_translation})`;
  } else {
    // Standard phrasing
    const pronounCapitalized = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
    
    if (selectedAdjective) {
      const adjectiveForm = getCaseForm(
        selectedAdjective.russian_word,
        finalCaseType,
        noun.gender
      );
      part1 = `${pronounCapitalized} ${conjugatedVerb} ${adjectiveForm} ${casedNoun}`;
    } else {
      part1 = `${pronounCapitalized} ${conjugatedVerb} ${casedNoun}`;
    }

    const preposition = finalCaseType === 'prepositional' ? 'in ' : '';
    const article = finalCaseType === 'prepositional' ? '' : 'a ';
    const adjectiveText = selectedAdjective
      ? `${selectedAdjective.english_translation} `
      : '';
    part2 = `(${pronounCapitalized} ${verb.english_translation} ${preposition}${article}${adjectiveText}${noun.english_translation})`;
  }

  return {
    part1,
    part2,
    adjective: selectedAdjective,
  };
};

/**
 * Generate multiple sentence variations from the same verb-noun pair
 */
export const generateSentenceVariations = (
  verb: Lexeme,
  noun: Lexeme,
  adjectives: Lexeme[],
  grammarRules: GrammarRule[],
  count: number = 3
): Array<{ part1: string; part2: string; adjective?: Lexeme }> => {
  const variations: Array<{ part1: string; part2: string; adjective?: Lexeme }> = [];
  const pronouns: Array<'я' | 'ты' | 'он' | 'она' | 'мы'> = ['я', 'ты', 'он', 'она', 'мы'];
  const caseTypes: Array<'accusative' | 'prepositional'> = ['accusative', 'prepositional'];

  for (let i = 0; i < count; i++) {
    const pronoun = pronouns[i % pronouns.length];
    const caseType = caseTypes[i % caseTypes.length];
    const includeAdjective = i % 2 === 0 && adjectives.length > 0; // Alternate with/without adjective

    const variation = generateVariedSentence(verb, noun, adjectives, grammarRules, {
      includeAdjective,
      pronoun,
      caseType,
      useDifferentPhrasing: i % 3 === 0, // Every third one uses different phrasing
    });

    variations.push(variation);
  }

  return variations;
};

/**
 * Find alternative verbs that are compatible with the same noun
 * Useful for generating "I finished the apple" vs "I ate the apple"
 */
export const findAlternativeVerbs = async (
  originalVerb: Lexeme,
  noun: Lexeme,
  allVerbs: Lexeme[],
  isCompatibleFn: (verb: Lexeme, noun: Lexeme, packThemes?: Map<number, string>, vocabPacks?: any[], lexemeToPackMap?: Map<number, number>) => Promise<boolean>,
  packThemes?: Map<number, string>,
  vocabPacks?: any[],
  lexemeToPackMap?: Map<number, number>
): Promise<Lexeme[]> => {
  const alternatives: Lexeme[] = [];

  for (const verb of allVerbs) {
    if (verb.lexeme_id === originalVerb.lexeme_id) {
      continue; // Skip the original verb
    }

    const compatible = await isCompatibleFn(verb, noun, packThemes, vocabPacks, lexemeToPackMap);
    if (compatible) {
      alternatives.push(verb);
    }
  }

  return alternatives;
};

