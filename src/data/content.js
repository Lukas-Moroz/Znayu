// Module 0: Cyrillic Alphabet Content
export const ALPHABET_DATA = [
    { letter: 'А а', name: 'a', sound: '[a] as in father', example: 'Анна', audio: '/audio/alpha/a.mp3' },
    { letter: 'Б б', name: 'be', sound: '[b] as in boy', example: 'библиотека', audio: '/audio/alpha/b.mp3' },
    { letter: 'В в', name: 've', sound: '[v] as in vase', example: 'вторник', audio: '/audio/alpha/v.mp3' },
    { letter: 'Г г', name: 'ge', sound: '[g] as in go', example: 'говорить', audio: '/audio/alpha/g.mp3' },
    { letter: 'Д д', name: 'de', sound: '[d] as in dog', example: 'дом', audio: '/audio/alpha/d.mp3' },
    { letter: 'Е е', name: 'ye', sound: '[ye] as in yes', example: 'день', audio: '/audio/alpha/ye.mp3' },
    { letter: 'Ё ё', name: 'yo', sound: '[yo] as in yolk', example: 'ёлка', audio: '/audio/alpha/yo.mp3' },
    { letter: 'Ж ж', name: 'zhe', sound: '[zh] as in measure', example: 'жить', audio: '/audio/alpha/zh.mp3' },
    { letter: 'З з', name: 'ze', sound: '[z] as in zoo', example: 'зима', audio: '/audio/alpha/z.mp3' },
    { letter: 'И и', name: 'i', sound: '[ee] as in see', example: 'имя', audio: '/audio/alpha/i.mp3' },
    { letter: 'Й й', name: 'i kratkoye', sound: '[y] as in boy', example: 'мой', audio: '/audio/alpha/ikr.mp3' },
    { letter: 'К к', name: 'ka', sound: '[k] as in kite', example: 'кот', audio: '/audio/alpha/k.mp3' },
    { letter: 'Л л', name: 'el', sound: '[l] as in lamp', example: 'лампа', audio: '/audio/alpha/l.mp3' },
    { letter: 'М м', name: 'em', sound: '[m] as in mother', example: 'мама', audio: '/audio/alpha/m.mp3' },
    { letter: 'Н н', name: 'en', sound: '[n] as in no', example: 'нет', audio: '/audio/alpha/n.mp3' },
    { letter: 'О о', name: 'o', sound: '[o] as in or', example: 'окно', audio: '/audio/alpha/o.mp3' },
    { letter: 'П п', name: 'pe', sound: '[p] as in pen', example: 'папа', audio: '/audio/alpha/p.mp3' },
    { letter: 'Р р', name: 'er', sound: '[r] rolled r', example: 'рука', audio: '/audio/alpha/r.mp3' },
    { letter: 'С с', name: 'es', sound: '[s] as in sun', example: 'сын', audio: '/audio/alpha/s.mp3' },
    { letter: 'Т т', name: 'te', sound: '[t] as in top', example: 'там', audio: '/audio/alpha/t.mp3' },
    { letter: 'У у', name: 'u', sound: '[oo] as in boot', example: 'утро', audio: '/audio/alpha/u.mp3' },
    { letter: 'Ф ф', name: 'ef', sound: '[f] as in fox', example: 'фильм', audio: '/audio/alpha/f.mp3' },
    { letter: 'Х х', name: 'kha', sound: '[kh] as in loch', example: 'хорошо', audio: '/audio/alpha/kh.mp3' },
    { letter: 'Ц ц', name: 'tse', sound: '[ts] as in cats', example: 'цирк', audio: '/audio/alpha/ts.mp3' },
    { letter: 'Ч ч', name: 'che', sound: '[ch] as in cheese', example: 'час', audio: '/audio/alpha/ch.mp3' },
    { letter: 'Ш ш', name: 'sha', sound: '[sh] as in shut', example: 'школа', audio: '/audio/alpha/sh.mp3' },
    { letter: 'Щ щ', name: 'shcha', sound: '[shch] as in fresh cheese', example: 'борщ', audio: '/audio/alpha/shch.mp3' },
    { letter: 'Ъ ъ', name: 'tvyordiy znak', sound: 'hard sign', example: 'объект', audio: '/audio/alpha/hard.mp3' },
    { letter: 'Ы ы', name: 'y', sound: '[i] as in bit', example: 'мы', audio: '/audio/alpha/y.mp3' },
    { letter: 'Ь ь', name: 'myagkiy znak', sound: 'soft sign', example: 'день', audio: '/audio/alpha/soft.mp3' },
    { letter: 'Э э', name: 'e', sound: '[e] as in pet', example: 'это', audio: '/audio/alpha/e.mp3' },
    { letter: 'Ю ю', name: 'yu', sound: '[yu] as in you', example: 'юг', audio: '/audio/alpha/yu.mp3' },
    { letter: 'Я я', name: 'ya', sound: '[ya] as in yard', example: 'я', audio: '/audio/alpha/ya.mp3' },
  ];
  
  // Module 1: Greetings & Introductions Lexemes
  export const MODULE_1_LEXEMES = [
    { lexeme_id: 1, russian_word: 'Здравствуйте', english_translation: 'Hello', part_of_speech: 'PHRASE', gender: null },
    { lexeme_id: 2, russian_word: 'Меня зовут...', english_translation: 'My name is...', part_of_speech: 'PHRASE', gender: null },
    { lexeme_id: 3, russian_word: 'студент', english_translation: 'student (m.)', part_of_speech: 'NOUN', gender: 'MASCULINE' },
    { lexeme_id: 4, russian_word: 'студентка', english_translation: 'student (f.)', part_of_speech: 'NOUN', gender: 'FEMININE' },
    { lexeme_id: 5, russian_word: 'американец', english_translation: 'American (m.)', part_of_speech: 'NOUN', gender: 'MASCULINE' },
    { lexeme_id: 6, russian_word: 'американка', english_translation: 'American (f.)', part_of_speech: 'NOUN', gender: 'FEMININE' },
    { lexeme_id: 7, russian_word: 'жить', english_translation: 'to live', part_of_speech: 'VERB', gender: null },
    { lexeme_id: 8, russian_word: 'университет', english_translation: 'university', part_of_speech: 'NOUN', gender: 'MASCULINE' },
  ];
  
  // Module 2: Family & People Lexemes
  export const MODULE_2_LEXEMES = [
    { lexeme_id: 9, russian_word: 'папа', english_translation: 'dad', part_of_speech: 'NOUN', gender: 'MASCULINE' },
    { lexeme_id: 10, russian_word: 'мама', english_translation: 'mom', part_of_speech: 'NOUN', gender: 'FEMININE' },
    { lexeme_id: 11, russian_word: 'брат', english_translation: 'brother', part_of_speech: 'NOUN', gender: 'MASCULINE' },
    { lexeme_id: 12, russian_word: 'сестра', english_translation: 'sister', part_of_speech: 'NOUN', gender: 'FEMININE' },
    { lexeme_id: 13, russian_word: 'работать', english_translation: 'to work', part_of_speech: 'VERB', gender: null },
    { lexeme_id: 14, russian_word: 'врач', english_translation: 'doctor', part_of_speech: 'NOUN', gender: 'MASCULINE' },
    { lexeme_id: 15, russian_word: 'учительница', english_translation: 'teacher (f.)', part_of_speech: 'NOUN', gender: 'FEMININE' },
    { lexeme_id: 16, russian_word: 'дом', english_translation: 'house/home', part_of_speech: 'NOUN', gender: 'MASCULINE' },
  ];
  
  // Module 3: Hobbies & Activities Lexemes
  export const MODULE_3_LEXEMES = [
    { lexeme_id: 17, russian_word: 'читать', english_translation: 'to read', part_of_speech: 'VERB', gender: null },
    { lexeme_id: 18, russian_word: 'книга', english_translation: 'book', part_of_speech: 'NOUN', gender: 'FEMININE' },
    { lexeme_id: 19, russian_word: 'смотреть', english_translation: 'to watch', part_of_speech: 'VERB', gender: null },
    { lexeme_id: 20, russian_word: 'фильм', english_translation: 'movie', part_of_speech: 'NOUN', gender: 'MASCULINE' },
    { lexeme_id: 21, russian_word: 'слушать', english_translation: 'to listen', part_of_speech: 'VERB', gender: null },
    { lexeme_id: 22, russian_word: 'музыка', english_translation: 'music', part_of_speech: 'NOUN', gender: 'FEMININE' },
    { lexeme_id: 23, russian_word: 'любить', english_translation: 'to love/like', part_of_speech: 'VERB', gender: null },
    { lexeme_id: 24, russian_word: 'ходить', english_translation: 'to go (on foot)', part_of_speech: 'VERB', gender: null },
    { lexeme_id: 25, russian_word: 'кино', english_translation: 'movie theater', part_of_speech: 'NOUN', gender: 'NEUTER' },
    { lexeme_id: 26, russian_word: 'футбол', english_translation: 'football', part_of_speech: 'NOUN', gender: 'MASCULINE' },
  ];
  
  // Food Pack Lexemes
  export const FOOD_PACK_LEXEMES = [
    { lexeme_id: 100, russian_word: 'кафе', english_translation: 'café', part_of_speech: 'NOUN', gender: 'NEUTER' },
    { lexeme_id: 101, russian_word: 'ресторан', english_translation: 'restaurant', part_of_speech: 'NOUN', gender: 'MASCULINE' },
    { lexeme_id: 102, russian_word: 'столовая', english_translation: 'cafeteria', part_of_speech: 'NOUN', gender: 'FEMININE' },
    { lexeme_id: 103, russian_word: 'меню', english_translation: 'menu', part_of_speech: 'NOUN', gender: 'NEUTER' },
    { lexeme_id: 104, russian_word: 'счёт', english_translation: 'bill', part_of_speech: 'NOUN', gender: 'MASCULINE' },
    { lexeme_id: 105, russian_word: 'официант', english_translation: 'waiter', part_of_speech: 'NOUN', gender: 'MASCULINE' },
  ];
  
  // Grammar Rules
  export const GRAMMAR_RULES = [
    {
      rule_id: 1,
      rule_name: 'Noun Gender: Masculine',
      explanation_short: 'Masculine nouns typically end in a consonant, -й, or -ь',
      explanation_long: 'Masculine nouns typically end in a consonant (e.g., брат), -й (e.g., музей), or a soft sign -ь (e.g., день). Adjectives describing them end in -ый, -ий, or -ой.',
      unlocks_in_module: 1,
    },
    {
      rule_id: 2,
      rule_name: 'Noun Gender: Feminine',
      explanation_short: 'Feminine nouns typically end in -а, -я, or -ь',
      explanation_long: 'Feminine nouns typically end in -а (e.g., мама), -я (e.g., Таня), or a soft sign -ь (e.g., дверь). Adjectives describing them end in -ая or -яя.',
      unlocks_in_module: 1,
    },
    {
      rule_id: 3,
      rule_name: 'Prepositional Case: Location',
      explanation_short: 'Add -е to most nouns for location. Use -и for feminine nouns ending in -ия or -ь',
      explanation_long: 'The Prepositional case answers the question "Где?" (Where?). To indicate location, add -е to most nouns. For feminine nouns ending in -ия or -ь, use the ending -и (e.g., Я живу в России).',
      unlocks_in_module: 2,
    },
    {
      rule_id: 4,
      rule_name: 'Accusative Case: Inanimate Direct Object (Feminine)',
      explanation_short: 'Nouns ending in -а change to -у. Nouns ending in -я change to -ю',
      explanation_long: 'To show that a feminine noun is the direct object of an action, change the ending. Nouns ending in -а change to -у (e.g., Я читаю книгу). Nouns ending in -я change to -ю (e.g., Я изучаю историю).',
      unlocks_in_module: 3,
    },
    {
      rule_id: 5,
      rule_name: 'Accusative Case: Inanimate Direct Object (Masculine/Neuter)',
      explanation_short: 'Inanimate masculine and neuter nouns stay the same in Accusative',
      explanation_long: 'Inanimate masculine and neuter nouns do not change their form in the Accusative case when used as a direct object. The form is the same as the Nominative (e.g., Я смотрю фильм).',
      unlocks_in_module: 3,
    },
  ];
  
  // Modules Configuration
  export const MODULES = [
    {
      module_id: 1,
      module_number: 1,
      title_english: 'Greetings',
      associated_lexemes: MODULE_1_LEXEMES,
      associated_grammar: [1, 2],
    },
    {
      module_id: 2,
      module_number: 2,
      title_english: 'Family',
      associated_lexemes: MODULE_2_LEXEMES,
      associated_grammar: [3],
    },
    {
      module_id: 3,
      module_number: 3,
      title_english: 'Hobbies',
      associated_lexemes: MODULE_3_LEXEMES,
      associated_grammar: [4, 5],
    },
  ];
  
  // Vocab Packs Configuration
  export const VOCAB_PACKS = [
    {
      pack_id: 1,
      pack_name: 'Food Pack',
      description: 'Essential vocabulary for restaurants and cafés',
      icon: 'restaurant',
      word_count: 6,
      prerequisite_module: 1,
      associated_lexemes: FOOD_PACK_LEXEMES,
    },
  ];
  
  // Helper function to get lexemes by module
  export const getLexemesByModule = (moduleNumber, activePackIds = []) => {
    const module = MODULES.find(m => m.module_number === moduleNumber);
    if (!module) return [];
    
    let lexemes = [...module.associated_lexemes];
    
    // Add lexemes from active packs
    activePackIds.forEach(packId => {
      const pack = VOCAB_PACKS.find(p => p.pack_id === packId);
      if (pack && pack.prerequisite_module <= moduleNumber) {
        lexemes = [...lexemes, ...pack.associated_lexemes];
      }
    });
    
    return lexemes;
  };
  
  // Helper function to get grammar rules by module
  export const getGrammarRulesByModule = (moduleNumber) => {
    const module = MODULES.find(m => m.module_number === moduleNumber);
    if (!module) return [];
    
    return GRAMMAR_RULES.filter(rule => 
      module.associated_grammar.includes(rule.rule_id)
    );
  };