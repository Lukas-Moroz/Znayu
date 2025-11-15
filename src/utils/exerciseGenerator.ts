// Enhanced exercise generator with context-aware sentence generation
import {
  getLexemesBySection,
  getGrammarRulesBySection,
  getLearnedLexemes,
  getLexemesByIds,
  GRAMMAR_RULES,
  CHAPTERS,
  getChapterByNumber,
  VOCAB_PACKS,
} from '../data/content';
import type { ExerciseType } from '../types/models';
import { Lexeme, GrammarRule, Exercise, Section, Chapter, VocabPack } from '../types/models';
import { getCaseForm, getVerbForm, buildPhrase, getNounGender, getGenitivePluralForm } from './russianDictionary';
import { generateSentence, generateSentenceFromLexemes } from './sentenceGenerator';
import {
  findCompatiblePair,
  buildLexemeToPackMap,
  storeCompatibilityPattern,
} from './sentenceCompatibility';
import { buildPackThemeMap } from './themeHelper';
import {
  generateVariedSentence,
  getAvailableAdjectives,
} from './sentenceVariety';

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

// Sentence templates for different grammar rules
const SENTENCE_TEMPLATES = {
  // Prepositional case templates
  prepositional: [
    { part1: 'Я живу в', part2: '(I live in ___)', requiresCase: 'prepositional' },
    { part1: 'Мы в', part2: '(We are in ___)', requiresCase: 'prepositional' },
    { part1: 'Он работает в', part2: '(He works in ___)', requiresCase: 'prepositional' },
  ],
  // Accusative case templates
  accusative: [
    { part1: 'Я читаю', part2: '(I read ___)', requiresCase: 'accusative', partOfSpeech: 'NOUN' },
    { part1: 'Я смотрю', part2: '(I watch ___)', requiresCase: 'accusative', partOfSpeech: 'NOUN' },
    { part1: 'Я люблю', part2: '(I love ___)', requiresCase: 'accusative', partOfSpeech: 'NOUN' },
    { part1: 'Он слушает', part2: '(He listens to ___)', requiresCase: 'accusative', partOfSpeech: 'NOUN' },
  ],
  // Basic verb sentences
  verb: [
    { part1: 'Я хочу', part2: '', verb: true },
    { part1: 'Мы любим', part2: '', verb: true },
    { part1: 'Они могут', part2: '', verb: true },
  ],
  // Basic noun identification
  noun: [
    { part1: 'Это', part2: '', noun: true },
    { part1: 'Вот', part2: '', noun: true },
  ],
  // Genitive case templates
  genitive: [
    { part1: 'У меня нет', part2: '(I don\'t have ___)', requiresCase: 'genitive', requiresPlural: false },
    { part1: 'В городе нет', part2: '(There is no ___ in the city)', requiresCase: 'genitive', requiresPlural: false },
    { part1: 'У меня два', part2: '(I have two ___)', requiresCase: 'genitive', requiresPlural: false, numberRange: [2, 4] },
    { part1: 'У меня три', part2: '(I have three ___)', requiresCase: 'genitive', requiresPlural: false, numberRange: [2, 4] },
    { part1: 'У меня четыре', part2: '(I have four ___)', requiresCase: 'genitive', requiresPlural: false, numberRange: [2, 4] },
    { part1: 'У меня пять', part2: '(I have five ___)', requiresCase: 'genitive', requiresPlural: true, numberRange: [5, Infinity] },
    { part1: 'В Москве много', part2: '(There are many ___ in Moscow)', requiresCase: 'genitive', requiresPlural: true },
    { part1: 'Недалеко от', part2: '(Not far from ___)', requiresCase: 'genitive', requiresPlural: false },
    { part1: 'Около', part2: '(Near ___)', requiresCase: 'genitive', requiresPlural: false },
    { part1: 'Это машина', part2: '(This is ___\'s car)', requiresCase: 'genitive', requiresPlural: false, isPossession: true },
  ],
};

// Hawai'i localization contexts for exercise generation
export const HAWAII_CONTEXTS = {
  beaches: {
    nouns: ['пляж', 'океан', 'лагуна', 'парк', 'пляжный парк'],
    verbs: ['бывать', 'находиться', 'плавать', 'загорать', 'отдыхать'],
    adjectives: ['красивый', 'тихий', 'широкий', 'песчаный', 'голубой'],
  },
  tourism: {
    places: ['Вайкики', 'аквариум', 'порт', 'торговый центр', 'Алмоана'],
    verbs: ['посмотреть', 'поехать', 'гулять', 'исследовать'],
    quantities: ['много', 'несколько'],
  },
  island_geography: {
    nouns: ['остров', 'гора', 'вулкан', 'тропа', 'кратер', 'долина'],
    prepositions: ['около', 'недалеко от', 'из'],
    numbers: [2, 3, 5, 10],
  },
};

/**
 * Generate contextual sentence for fill-in-blank exercises
 */
const generateContextualSentence = (
  targetLexeme: Lexeme,
  availableLexemes: Lexeme[],
  grammarRules: GrammarRule[]
): { part1: string; part2: string } => {
  // Find applicable grammar rule
  const applicableRule = grammarRules.find((rule) =>
    rule.rule_name.toLowerCase().includes('accusative') ||
    rule.rule_name.toLowerCase().includes('prepositional') ||
    rule.rule_name.toLowerCase().includes('genitive')
  );

  // Select appropriate template based on part of speech and grammar
  if (targetLexeme.part_of_speech === 'VERB') {
    const template = getRandomItems(SENTENCE_TEMPLATES.verb, 1)[0];
    return {
      part1: template.part1,
      part2: `(means "to ${targetLexeme.english_translation}")`,
    };
  }

  if (targetLexeme.part_of_speech === 'NOUN') {
    if (applicableRule?.rule_name.includes('Genitive')) {
      const template = getRandomItems(SENTENCE_TEMPLATES.genitive, 1)[0];
      return {
        part1: template.part1,
        part2: template.part2,
      };
    } else if (applicableRule?.rule_name.includes('Accusative')) {
      const template = getRandomItems(SENTENCE_TEMPLATES.accusative, 1)[0];
      return {
        part1: template.part1,
        part2: template.part2,
      };
    } else if (applicableRule?.rule_name.includes('Prepositional')) {
      const template = getRandomItems(SENTENCE_TEMPLATES.prepositional, 1)[0];
      return {
        part1: template.part1,
        part2: template.part2,
      };
    } else {
      const template = getRandomItems(SENTENCE_TEMPLATES.noun, 1)[0];
      return {
        part1: template.part1,
        part2: `(This is a ${targetLexeme.english_translation})`,
      };
    }
  }

  // Default simple sentence
  return {
    part1: '',
    part2: `means "${targetLexeme.english_translation}"`,
  };
};

/**
 * Generate Multiple Choice Exercise
 * Note: For genitive case, use fill-in-blank instead to test case forms
 */
const generateMultipleChoice = (
  lexemes: Lexeme[],
  exerciseId: number,
  allAvailableLexemes: Lexeme[],
  grammarRules: GrammarRule[] = []
): Exercise => {
  // Filter out prepositions and quantity words for multiple choice (they don't work well)
  const suitableLexemes = lexemes.filter(
    (l) => l.part_of_speech !== 'PREPOSITION' && l.part_of_speech !== 'ADVERB'
  );
  
  if (suitableLexemes.length === 0) {
    // Fallback to all lexemes if none are suitable
    const correctLexeme = lexemes[Math.floor(Math.random() * lexemes.length)];
    const wrongLexemes = lexemes.filter((l) => l.lexeme_id !== correctLexeme.lexeme_id);
    const wrongOptions = getRandomItems(wrongLexemes, 3);

    const options = shuffleArray([
      correctLexeme.english_translation,
      ...wrongOptions.map((l) => l.english_translation),
    ]);

    return {
      id: exerciseId,
      type: 'MULTIPLE_CHOICE',
      prompt: `What does "${correctLexeme.russian_word}" mean?`,
      options,
      correctAnswer: correctLexeme.english_translation,
      audioToPlay: correctLexeme.audio_file_path,
      lexeme_ids: [correctLexeme.lexeme_id],
    };
  }

  const correctLexeme = suitableLexemes[Math.floor(Math.random() * suitableLexemes.length)];
  const wrongLexemes = suitableLexemes.filter((l) => l.lexeme_id !== correctLexeme.lexeme_id);
  const wrongOptions = getRandomItems(wrongLexemes, 3);

  const options = shuffleArray([
    correctLexeme.english_translation,
    ...wrongOptions.map((l) => l.english_translation),
  ]);

  return {
    id: exerciseId,
    type: 'MULTIPLE_CHOICE',
    prompt: `What does "${correctLexeme.russian_word}" mean?`,
    options,
    correctAnswer: correctLexeme.english_translation,
    audioToPlay: correctLexeme.audio_file_path, // Optional: fallback to TTS if not available
    // Note: Russian text is in the prompt, TTS will extract it automatically
    lexeme_ids: [correctLexeme.lexeme_id],
  };
};

/**
 * Generate Matching Exercise
 */
const generateMatching = (lexemes: Lexeme[], exerciseId: number): Exercise => {
  const selectedLexemes = getRandomItems(lexemes, Math.min(5, lexemes.length));

  const leftColumnItems = selectedLexemes.map((l) => l.russian_word);
  const rightColumnItems = shuffleArray(selectedLexemes.map((l) => l.english_translation));

  const correctPairs: Record<string, string> = {};
  selectedLexemes.forEach((l) => {
    correctPairs[l.russian_word] = l.english_translation;
  });

  return {
    id: exerciseId,
    type: 'MATCHING',
    leftColumnItems,
    rightColumnItems,
    correctPairs,
    correctAnswer: '', // Not used for matching
    lexeme_ids: selectedLexemes.map((l) => l.lexeme_id),
  };
};

/**
 * Generate Fill in the Blank Exercise using dictionary utilities
 * NEW WAY: Uses compatibility checking and sentence variety for coherent sentences
 */
const generateFillInBlank = async (
  lexemes: Lexeme[],
  exerciseId: number,
  allAvailableLexemes: Lexeme[],
  grammarRules: GrammarRule[],
  activePackIds: number[] = []
): Promise<Exercise> => {
  // Try to find a verb and noun for a complete sentence
  const verbs = lexemes.filter((l) => l.part_of_speech === 'VERB');
  const nouns = lexemes.filter((l) => l.part_of_speech === 'NOUN');

  // If we have both verb and noun, use compatibility checking
  if (verbs.length > 0 && nouns.length > 0) {
    // Build theme maps for compatibility checking
    const activePacks = VOCAB_PACKS.filter((p) => activePackIds.includes(p.pack_id));
    const packThemes = buildPackThemeMap(activePacks);
    const lexemeToPackMap = buildLexemeToPackMap(activePacks);

    // Try to find a compatible pair
    const compatiblePair = await findCompatiblePair(
      verbs,
      nouns,
      packThemes,
      activePacks,
      lexemeToPackMap
    );

    if (compatiblePair) {
      const { verb, noun } = compatiblePair;

      // Store successful compatibility pattern
      await storeCompatibilityPattern(verb.lexeme_id, noun.lexeme_id, true);

      // Get available adjectives for variety
      const adjectives = getAvailableAdjectives(nouns, allAvailableLexemes);
      const includeAdjective = adjectives.length > 0 && Math.random() > 0.5; // 50% chance

      // Determine which case to use based on grammar rules
      let caseType: 'accusative' | 'prepositional' | 'genitive' = 'accusative';
      const hasAccusativeRule = grammarRules.some((r) =>
        r.rule_name.toLowerCase().includes('accusative')
      );
      const hasPrepositionalRule = grammarRules.some((r) =>
        r.rule_name.toLowerCase().includes('prepositional')
      );
      const hasGenitiveRule = grammarRules.some((r) =>
        r.rule_name.toLowerCase().includes('genitive')
      );

      // Prioritize genitive if present, then prepositional, then accusative
      if (hasGenitiveRule) {
        caseType = 'genitive';
        
        // Check if we should use a possession template (30% chance when genitive is present)
        if (Math.random() < 0.3) {
          const possessionTemplate = SENTENCE_TEMPLATES.genitive.find(t => t.isPossession);
          if (possessionTemplate) {
            // Generate genitive possession exercise: "Это машина ___" (This is ___'s car)
            const correctAnswer = getCaseForm(noun.russian_word, 'genitive', noun.gender);
            
            return {
              id: exerciseId,
              type: 'FILL_IN_BLANK',
              sentencePart1: possessionTemplate.part1,
              sentencePart2: possessionTemplate.part2,
              correctAnswer: correctAnswer,
              lexeme_ids: [noun.lexeme_id],
              grammar_rule_ids: grammarRules
                .filter((r) => r.rule_name.toLowerCase().includes('genitive'))
                .map((r) => r.rule_id),
            };
          }
        }
      } else if (hasPrepositionalRule && !hasAccusativeRule) {
        caseType = 'prepositional';
      }

      // Generate varied sentence
      const sentenceVariation = generateVariedSentence(
        verb,
        noun,
        adjectives,
        grammarRules,
        {
          includeAdjective,
          pronoun: 'я',
          caseType,
          useDifferentPhrasing: Math.random() > 0.7, // 30% chance for different phrasing
        }
      );

      // Get correct answer (cased noun, potentially with adjective)
      // Check if we need genitive plural (for quantity words like много, пять, etc.)
      let requiresPlural = false;
      if (caseType === 'genitive') {
        // Check if sentence variation indicates plural (from template)
        const genitiveTemplate = SENTENCE_TEMPLATES.genitive.find(
          (t) => sentenceVariation.part1.includes(t.part1.split(' ')[0])
        );
        requiresPlural = genitiveTemplate?.requiresPlural || false;
      }

      let correctAnswer: string;
      if (caseType === 'genitive' && requiresPlural) {
        correctAnswer = getGenitivePluralForm(noun.russian_word, noun.gender);
      } else {
        correctAnswer = getCaseForm(noun.russian_word, caseType, noun.gender);
      }

      if (sentenceVariation.adjective) {
        // For adjectives with genitive plural, we'd need adjective plural forms too
        // For now, use singular genitive adjective (can be enhanced later)
        const adjectiveForm = getCaseForm(
          sentenceVariation.adjective.russian_word,
          caseType,
          noun.gender
        );
        correctAnswer = `${adjectiveForm} ${correctAnswer}`;
      }

      return {
        id: exerciseId,
        type: 'FILL_IN_BLANK',
        sentencePart1: sentenceVariation.part1,
        sentencePart2: sentenceVariation.part2,
        correctAnswer: correctAnswer,
        lexeme_ids: sentenceVariation.adjective
          ? [verb.lexeme_id, noun.lexeme_id, sentenceVariation.adjective.lexeme_id]
          : [verb.lexeme_id, noun.lexeme_id],
        grammar_rule_ids: grammarRules
          .filter((r) => r.rule_name.toLowerCase().includes(caseType))
          .map((r) => r.rule_id),
      };
    } else {
      // No compatible pair found, fall back to random (with warning)
      console.warn(
        `No compatible verb-noun pairs found for exercise ${exerciseId}, using random selection`
      );
      // Continue to fallback logic below
    }
  }

  // Fallback: Use random selection if no compatible pairs found
  if (verbs.length > 0 && nouns.length > 0) {
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    // Determine which case to use based on grammar rules
    let caseType: 'accusative' | 'prepositional' | 'genitive' = 'accusative';
    const hasAccusativeRule = grammarRules.some((r) =>
      r.rule_name.toLowerCase().includes('accusative')
    );
    const hasPrepositionalRule = grammarRules.some((r) =>
      r.rule_name.toLowerCase().includes('prepositional')
    );
    const hasGenitiveRule = grammarRules.some((r) =>
      r.rule_name.toLowerCase().includes('genitive')
    );

    // Prioritize genitive if present, then prepositional, then accusative
    if (hasGenitiveRule) {
      caseType = 'genitive';
      // Use genitive templates directly for better exercises
      // Include possession templates (20% chance) or use other templates
      const usePossession = Math.random() < 0.2;
      let genitiveTemplates = SENTENCE_TEMPLATES.genitive;
      
      if (usePossession) {
        // Use possession template
        const possessionTemplate = genitiveTemplates.find(t => t.isPossession);
        if (possessionTemplate) {
          const correctAnswer = getCaseForm(noun.russian_word, 'genitive', noun.gender);
          return {
            id: exerciseId,
            type: 'FILL_IN_BLANK',
            sentencePart1: possessionTemplate.part1,
            sentencePart2: possessionTemplate.part2,
            correctAnswer: correctAnswer,
            lexeme_ids: [noun.lexeme_id],
            grammar_rule_ids: grammarRules
              .filter((r) => r.rule_name.toLowerCase().includes('genitive'))
              .map((r) => r.rule_id),
          };
        }
      }
      
      // Use non-possession templates
      genitiveTemplates = genitiveTemplates.filter((t) => !t.isPossession);
      if (genitiveTemplates.length > 0) {
        const template = getRandomItems(genitiveTemplates, 1)[0];
        let correctAnswer: string;
        if (template.requiresPlural) {
          correctAnswer = getGenitivePluralForm(noun.russian_word, noun.gender);
        } else {
          correctAnswer = getCaseForm(noun.russian_word, 'genitive', noun.gender);
        }

        return {
          id: exerciseId,
          type: 'FILL_IN_BLANK',
          sentencePart1: template.part1,
          sentencePart2: template.part2,
          correctAnswer: correctAnswer,
          lexeme_ids: [noun.lexeme_id],
          grammar_rule_ids: grammarRules
            .filter((r) => r.rule_name.toLowerCase().includes('genitive'))
            .map((r) => r.rule_id),
        };
      }
    } else if (hasPrepositionalRule && !hasAccusativeRule) {
      caseType = 'prepositional';
    }

    // Get conjugated verb and cased noun
    const conjugatedVerb = getVerbForm(verb.russian_word, 'я');
    const correctAnswer = getCaseForm(noun.russian_word, caseType, noun.gender);

    // Build the sentence parts
    let part1 = `Я ${conjugatedVerb}`;
    let part2 = `(I ${verb.english_translation} `;
    if (caseType === 'prepositional') {
      part2 += `in ${noun.english_translation})`;
    } else if (caseType === 'genitive') {
      part2 += `${noun.english_translation} [genitive])`;
    } else {
      part2 += `a ${noun.english_translation})`;
    }

    return {
      id: exerciseId,
      type: 'FILL_IN_BLANK',
      sentencePart1: part1,
      sentencePart2: part2,
      correctAnswer: correctAnswer,
      lexeme_ids: [verb.lexeme_id, noun.lexeme_id],
      grammar_rule_ids: grammarRules
        .filter((r) => r.rule_name.toLowerCase().includes(caseType))
        .map((r) => r.rule_id),
    };
  }

  // Fallback: Use sentence generator if available
  const sentence = await generateSentenceFromLexemes(lexemes, 'easy', VOCAB_PACKS, activePackIds);
  if (sentence) {
    const words = sentence.split(' ');
    if (words.length >= 2) {
      // Extract a word to blank out (prefer the last word which is usually the object)
      const blankIndex = words.length - 1;
      const correctAnswer = words[blankIndex];
      const part1 = words.slice(0, blankIndex).join(' ');
      const part2 = '';

      return {
        id: exerciseId,
        type: 'FILL_IN_BLANK',
        sentencePart1: part1,
        sentencePart2: part2,
        correctAnswer: correctAnswer,
        lexeme_ids: lexemes.map((l) => l.lexeme_id),
        grammar_rule_ids: grammarRules.map((r) => r.rule_id),
      };
    }
  }

  // Last resort: Use old method with contextual sentence
  const targetLexeme = lexemes[Math.floor(Math.random() * lexemes.length)];
  const oldSentence = generateContextualSentence(targetLexeme, allAvailableLexemes, grammarRules);

  return {
    id: exerciseId,
    type: 'FILL_IN_BLANK',
    sentencePart1: oldSentence.part1,
    sentencePart2: oldSentence.part2,
    correctAnswer: targetLexeme.russian_word,
    lexeme_ids: [targetLexeme.lexeme_id],
    grammar_rule_ids: grammarRules.map((r) => r.rule_id),
  };
};

/**
 * Generate Listen and Type Exercise
 */
const generateListenType = (lexemes: Lexeme[], exerciseId: number): Exercise => {
  const targetLexeme = lexemes[Math.floor(Math.random() * lexemes.length)];

  return {
    id: exerciseId,
    type: 'LISTEN_TYPE',
    audioToPlay: targetLexeme.audio_file_path, // Optional: TTS will be used if not available
    correctAnswer: targetLexeme.russian_word, // TTS will speak this Russian word
    lexeme_ids: [targetLexeme.lexeme_id],
  };
};

/**
 * Main exercise generator function with section and chapter support
 */
export const generateExercises = async (
  moduleNumber: number | null,
  section: Section | null,
  mode: 'quick' | 'deep',
  activePackIds: number[] = [],
  chapter: Chapter | null = null,
  chapterNumber: number | null = null
): Promise<Exercise[]> => {
  // Letter learning sections don't generate exercises - they use AlphabetLearningScreen
  if (section && section.section_type === 'LETTER_LEARNING') {
    return [];
  }

  // Get lexemes and grammar rules based on section or chapter/module
  let lexemes: Lexeme[];
  let grammarRules: GrammarRule[];

  if (section) {
    // Get lexemes and grammar from section
    lexemes = getLexemesBySection(section.section_id);
    grammarRules = getGrammarRulesBySection(section.section_id);
    
    // If section has associated lexemes from chapter, use those
    if (chapter && section.associated_lexemes.length > 0) {
      lexemes = getLexemesByIds(section.associated_lexemes);
    }
    
    if (chapter && section.associated_grammar.length > 0) {
      grammarRules = GRAMMAR_RULES.filter((r) => section.associated_grammar.includes(r.rule_id));
    }
  } else if (chapter) {
    // Use chapter-level lexemes and grammar
    lexemes = getLexemesByIds(chapter.associated_lexemes);
    grammarRules = GRAMMAR_RULES.filter((r) => chapter.associated_grammar.includes(r.rule_id));
  } else if (moduleNumber !== null) {
    // Fallback to module-level if no section/chapter provided
    lexemes = getLearnedLexemes(moduleNumber, activePackIds);
    grammarRules = GRAMMAR_RULES.filter((r) => r.unlocks_in_module <= moduleNumber);
  } else {
    // No valid input
    return [];
  }

  if (lexemes.length === 0) {
    return [];
  }

  // Get all available lexemes for context
  let allAvailableLexemes: Lexeme[];
  if (chapterNumber !== null) {
    // Get lexemes from all chapters up to current
    const chaptersUpTo = CHAPTERS.filter((ch) => ch.chapter_number <= chapterNumber);
    const allLexemeIds = chaptersUpTo.flatMap((ch) => ch.associated_lexemes);
    allAvailableLexemes = getLexemesByIds(allLexemeIds);
  } else if (moduleNumber !== null) {
    allAvailableLexemes = getLearnedLexemes(moduleNumber, activePackIds);
  } else {
    allAvailableLexemes = lexemes;
  }

  const exercises: Exercise[] = [];
  const baseId = chapter ? chapter.chapter_id * 1000 : (moduleNumber || 0) * 100;
  let exerciseId = baseId + (section?.section_id || 0);

  // Check if genitive case is present - if so, prioritize fill-in-blank exercises
  const hasGenitiveRule = grammarRules.some((r) =>
    r.rule_name.toLowerCase().includes('genitive')
  );

  // Determine exercise types based on section type
  let exerciseTypes: string[] = [];
  
  if (section) {
    // SectionType is now a string literal union type, so direct comparison works
    switch (section.section_type) {
      case 'GRAMMAR':
        // If genitive case, prioritize fill-in-blank to test case forms
        if (hasGenitiveRule) {
          exerciseTypes = ['fillInBlank', 'fillInBlank', 'fillInBlank', 'matching'];
        } else {
          exerciseTypes = ['fillInBlank', 'multipleChoice', 'fillInBlank']; // Focus on application
        }
        break;
      case 'VOCABULARY':
        exerciseTypes = ['matching', 'multipleChoice', 'multipleChoice']; // Focus on recognition
        break;
      case 'SPELLING':
        exerciseTypes = ['listenType', 'fillInBlank', 'listenType']; // Focus on spelling
        break;
      case 'LISTENING':
        exerciseTypes = ['listenType', 'multipleChoice', 'listenType']; // Focus on listening
        break;
      case 'MIXED_REVIEW':
        // If genitive case, include more fill-in-blank exercises
        if (hasGenitiveRule) {
          exerciseTypes = ['fillInBlank', 'multipleChoice', 'fillInBlank', 'matching', 'fillInBlank'];
        } else {
          exerciseTypes = ['multipleChoice', 'matching', 'fillInBlank', 'listenType']; // All types
        }
        break;
      case 'LETTER_LEARNING':
        // Should not reach here, but just in case
        return [];
      default:
        if (hasGenitiveRule) {
          exerciseTypes = ['fillInBlank', 'fillInBlank', 'matching', 'multipleChoice'];
        } else {
          exerciseTypes = ['multipleChoice', 'matching', 'fillInBlank'];
        }
    }
  } else {
    // Default mixed exercises - prioritize fill-in-blank if genitive is present
    if (hasGenitiveRule) {
      exerciseTypes = ['fillInBlank', 'fillInBlank', 'matching', 'multipleChoice'];
    } else {
      exerciseTypes = ['multipleChoice', 'matching', 'fillInBlank', 'listenType'];
    }
  }

  const exerciseCount = mode === 'quick' ? 5 + Math.floor(Math.random() * 3) : 10 + Math.floor(Math.random() * 3);

  for (let i = 0; i < exerciseCount; i++) {
    const typeIndex = i % exerciseTypes.length;
    const exerciseType = exerciseTypes[typeIndex];

    switch (exerciseType) {
      case 'multipleChoice':
        // Skip multiple choice if genitive case is present (use fill-in-blank instead)
        if (!hasGenitiveRule && lexemes.length >= 4) {
          const exercise = generateMultipleChoice(lexemes, exerciseId++, allAvailableLexemes, grammarRules);
          if (chapter) exercise.chapter_id = chapter.chapter_id;
          if (section) exercise.section_id = section.section_id;
          exercises.push(exercise);
        } else if (hasGenitiveRule) {
          // Replace multiple choice with fill-in-blank for genitive case
          const exerciseFill = await generateFillInBlank(lexemes, exerciseId++, allAvailableLexemes, grammarRules, activePackIds);
          if (chapter) exerciseFill.chapter_id = chapter.chapter_id;
          if (section) exerciseFill.section_id = section.section_id;
          exercises.push(exerciseFill);
        }
        break;
      case 'matching':
        if (lexemes.length >= 3) {
          const exercise = generateMatching(lexemes, exerciseId++);
          if (chapter) exercise.chapter_id = chapter.chapter_id;
          if (section) exercise.section_id = section.section_id;
          exercises.push(exercise);
        }
        break;
      case 'fillInBlank':
        const exerciseFill = await generateFillInBlank(lexemes, exerciseId++, allAvailableLexemes, grammarRules, activePackIds);
        if (chapter) exerciseFill.chapter_id = chapter.chapter_id;
        if (section) exerciseFill.section_id = section.section_id;
        exercises.push(exerciseFill);
        break;
      case 'listenType':
        const exerciseListen = generateListenType(lexemes, exerciseId++);
        if (chapter) exerciseListen.chapter_id = chapter.chapter_id;
        if (section) exerciseListen.section_id = section.section_id;
        exercises.push(exerciseListen);
        break;
    }
  }

  return shuffleArray(exercises);
};

