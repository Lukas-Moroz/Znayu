// Core data models for the Znayu app
// Aligned with Anna Kudyma's Russian textbook pedagogy

// Use string literal union types instead of enums for better Metro bundler compatibility
export type PartOfSpeech = 
  | 'NOUN'
  | 'VERB'
  | 'ADJECTIVE'
  | 'PHRASE'
  | 'ADVERB'
  | 'PREPOSITION'
  | 'PRONOUN';

export type Gender = 
  | 'MASCULINE'
  | 'FEMININE'
  | 'NEUTER';

export type ConjugationType = 
  | 'FIRST'
  | 'SECOND'
  | 'IRREGULAR';

// Use string literal union type instead of enum for better Metro bundler compatibility
export type ExerciseType = 
  | 'MATCHING'
  | 'FILL_IN_BLANK'
  | 'LISTEN_TYPE'
  | 'SOUND_RECOGNITION'
  | 'MULTIPLE_CHOICE'
  | 'ALPHABET_QUIZ';

// Use string literal union type instead of enum for better Metro bundler compatibility
export type SectionType = 
  | 'GRAMMAR'
  | 'VOCABULARY'
  | 'SPELLING'
  | 'LISTENING'
  | 'MIXED_REVIEW'
  | 'LETTER_LEARNING';

// Alphabet letter data for Module 0
export interface AlphabetLetter {
  letter: string; // e.g., "А а"
  name: string; // e.g., "a"
  sound: string; // e.g., "[a] as in father"
  example: string; // e.g., "Анна"
  audio: string; // path to audio file
}

// Lexeme (vocabulary word)
export interface Lexeme {
  lexeme_id: number;
  russian_word: string;
  english_translation: string;
  part_of_speech: PartOfSpeech;
  gender?: Gender;
  base_conjugation_type?: ConjugationType;
  audio_file_path?: string;
  // Compatibility metadata for coherent sentence generation
  semantic_theme?: string; // e.g., 'transit', 'food', 'education', 'readable', 'edible', 'location'
  compatible_themes?: string[]; // For verbs: themes of nouns they can work with
  compatible_verb_ids?: number[]; // Optional: specific verb IDs this noun works with
  compatible_noun_ids?: number[]; // Optional: for verbs, specific noun IDs they work with
}

// Grammar rule
export interface GrammarRule {
  rule_id: number;
  rule_name: string;
  explanation_short: string;
  explanation_long: string;
  unlocks_in_module: number;
  examples?: string[];
}

// Section within a module or chapter (e.g., Grammar, Vocabulary, Spelling, Letter Learning)
export interface Section {
  section_id: number;
  section_name: string;
  section_type: SectionType;
  associated_lexemes: number[]; // Lexeme IDs
  associated_grammar: number[]; // Grammar rule IDs
  letters?: string[]; // For LETTER_LEARNING sections: array of letter strings (e.g., ["М", "П", "ТК", "А", "О", "Э"])
  order: number; // Display order within module/chapter
  is_completed?: boolean;
}

// Module (corresponds to textbook chapters) - legacy, kept for backward compatibility
export interface Module {
  module_id: number;
  module_number: number;
  title_english: string;
  title_russian?: string;
  associated_lexemes: number[]; // All lexemes in module
  associated_grammar: number[]; // All grammar rules in module
  sections: Section[]; // Subdivisions within module
  is_unlocked?: boolean;
  textbook_chapter?: number; // Reference to Kudyma textbook chapter
}

// Chapter (1:1 with textbook chapters, replaces modules)
export interface Chapter {
  chapter_id: number;
  chapter_number: number; // 1-24
  title_english: string;
  title_russian?: string;
  associated_lexemes: number[]; // All lexemes in chapter
  associated_grammar: number[]; // All grammar rules in chapter
  sections: Section[]; // Subdivisions within chapter
  is_unlocked?: boolean;
}

// Exercise definition
export interface Exercise {
  id: number;
  type: ExerciseType;
  module_id?: number; // Legacy support
  chapter_id?: number;
  section_id?: number;
  prompt?: string;
  options?: string[];
  correctAnswer: string;
  concept_id?: string;
  audioToPlay?: string;
  
  // For matching exercises
  leftColumnItems?: string[];
  rightColumnItems?: string[];
  correctPairs?: Record<string, string>;
  
  // For fill-in-blank exercises
  sentencePart1?: string;
  sentencePart2?: string;
  
  // Tracking
  lexeme_ids?: number[]; // Lexemes used in this exercise
  grammar_rule_ids?: number[]; // Grammar rules tested
}

// Vocabulary pack (supplementary themed vocabulary)
export interface VocabPack {
  pack_id: number;
  pack_name: string;
  description?: string;
  associated_lexemes: number[];
  prerequisite_module: number;
  icon?: string;
  word_count?: number;
  // Theme metadata for compatibility checking
  theme?: string; // e.g., 'transit', 'food', 'education'
  theme_description?: string; // Human-readable description
}

// Missed question tracking with full metadata
export interface MissedQuestion {
  exerciseId: number;
  chapterId?: number;
  sectionId?: number;
  conceptType?: 'vocab' | 'grammar' | 'spelling' | 'listening';
  grammarRuleId?: number;
  lexemeIds?: number[];
  originalExercise: Exercise; // Store original for reference
  timestamp: string;
}

// User progress tracking
export interface UserProgress {
  user_id: number;
  current_module: number; // Legacy support
  current_chapter: number; // Current chapter (1-24)
  streak_count: number;
  missed_questions: MissedQuestion[]; // Replaces missed_question_ids
  active_vocab_packs: number[];
  module_0_complete: boolean;
  completed_sections: number[]; // Section IDs
  last_activity_date?: string;
}

