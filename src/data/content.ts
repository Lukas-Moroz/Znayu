// Content data for Znayu app
// Aligned with Anna Kudyma's "Beginning Russian" textbook structure
import type {
  AlphabetLetter,
  Lexeme,
  GrammarRule,
  Module,
  VocabPack,
  Section,
  Chapter,
} from '../types/models';

// ==================== MODULE 0: CYRILLIC ALPHABET ====================

export const ALPHABET_DATA: AlphabetLetter[] = [
  { letter: 'А а', name: 'a', sound: '[a] as in father', example: 'Анна', audio: '/audio/alpha/a.mp3' },
  { letter: 'Б б', name: 'be', sound: '[b] as in boy', example: 'библиотека', audio: '/audio/alpha/b.mp3' },
  { letter: 'В в', name: 've', sound: '[v] as in vase', example: 'вторник', audio: '/audio/alpha/v.mp3' },
  { letter: 'Г г', name: 'ge', sound: '[g] as in go', example: 'говорить', audio: '/audio/alpha/g.mp3' },
  { letter: 'Д д', name: 'de', sound: '[d] as in dog', example: 'дом', audio: '/audio/alpha/d.mp3' },
  { letter: 'Е е', name: 'ye', sound: '[ye] as in yes', example: 'день', audio: '/audio/alpha/ye.mp3' },
  { letter: 'Ё ё', name: 'yo', sound: '[yo] as in yolk', example: 'ёлка', audio: '/audio/alpha/yo.mp3' },
  { letter: 'Ж ж', name: 'zhe', sound: '[zh] as in pleasure', example: 'жить', audio: '/audio/alpha/zh.mp3' },
  { letter: 'З з', name: 'ze', sound: '[z] as in zoo', example: 'зима', audio: '/audio/alpha/z.mp3' },
  { letter: 'И и', name: 'i', sound: '[ee] as in see', example: 'имя', audio: '/audio/alpha/i.mp3' },
  { letter: 'Й й', name: 'i kratkoye', sound: '[y] as in boy', example: 'мой', audio: '/audio/alpha/ikr.mp3' },
  { letter: 'К к', name: 'ka', sound: '[k] as in kite', example: 'книга', audio: '/audio/alpha/k.mp3' },
  { letter: 'Л л', name: 'el', sound: '[l] as in light', example: 'лампа', audio: '/audio/alpha/l.mp3' },
  { letter: 'М м', name: 'em', sound: '[m] as in map', example: 'мама', audio: '/audio/alpha/m.mp3' },
  { letter: 'Н н', name: 'en', sound: '[n] as in no', example: 'нет', audio: '/audio/alpha/n.mp3' },
  { letter: 'О о', name: 'o', sound: '[o] as in or', example: 'окно', audio: '/audio/alpha/o.mp3' },
  { letter: 'П п', name: 'pe', sound: '[p] as in pet', example: 'папа', audio: '/audio/alpha/p.mp3' },
  { letter: 'Р р', name: 'er', sound: '[r] rolled r', example: 'рыба', audio: '/audio/alpha/r.mp3' },
  { letter: 'С с', name: 'es', sound: '[s] as in sun', example: 'слово', audio: '/audio/alpha/s.mp3' },
  { letter: 'Т т', name: 'te', sound: '[t] as in tap', example: 'ты', audio: '/audio/alpha/t.mp3' },
  { letter: 'У у', name: 'u', sound: '[oo] as in boot', example: 'улица', audio: '/audio/alpha/u.mp3' },
  { letter: 'Ф ф', name: 'ef', sound: '[f] as in face', example: 'фото', audio: '/audio/alpha/f.mp3' },
  { letter: 'Х х', name: 'kha', sound: '[kh] as in loch', example: 'хорошо', audio: '/audio/alpha/kh.mp3' },
  { letter: 'Ц ц', name: 'tse', sound: '[ts] as in cats', example: 'цирк', audio: '/audio/alpha/ts.mp3' },
  { letter: 'Ч ч', name: 'che', sound: '[ch] as in cheese', example: 'чай', audio: '/audio/alpha/ch.mp3' },
  { letter: 'Ш ш', name: 'sha', sound: '[sh] as in shut', example: 'школа', audio: '/audio/alpha/sh.mp3' },
  { letter: 'Щ щ', name: 'shcha', sound: '[shch]', example: 'борщ', audio: '/audio/alpha/shch.mp3' },
  { letter: 'Ъ ъ', name: 'tvyordiy znak', sound: 'hard sign', example: 'объект', audio: '/audio/alpha/hard.mp3' },
  { letter: 'Ы ы', name: 'y', sound: '[i] hard i', example: 'ты', audio: '/audio/alpha/y.mp3' },
  { letter: 'Ь ь', name: 'myagkiy znak', sound: 'soft sign', example: 'день', audio: '/audio/alpha/soft.mp3' },
  { letter: 'Э э', name: 'e', sound: '[e] as in pet', example: 'это', audio: '/audio/alpha/e.mp3' },
  { letter: 'Ю ю', name: 'yu', sound: '[yu] as in you', example: 'юг', audio: '/audio/alpha/yu.mp3' },
  { letter: 'Я я', name: 'ya', sound: '[ya] as in yard', example: 'я', audio: '/audio/alpha/ya.mp3' },
];

// ==================== LEXEMES BY MODULE ====================

// Module 1: Greetings & Introductions
export const MODULE_1_LEXEMES: Lexeme[] = [
  { lexeme_id: 1, russian_word: 'Здравствуйте', english_translation: 'Hello', part_of_speech: 'PHRASE' },
  { lexeme_id: 2, russian_word: 'Привет', english_translation: 'Hi (informal)', part_of_speech: 'PHRASE' },
  { lexeme_id: 3, russian_word: 'Меня зовут...', english_translation: 'My name is...', part_of_speech: 'PHRASE' },
  { lexeme_id: 4, russian_word: 'студент', english_translation: 'student (m.)', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'education' },
  { lexeme_id: 5, russian_word: 'студентка', english_translation: 'student (f.)', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'education' },
  { lexeme_id: 6, russian_word: 'американец', english_translation: 'American (m.)', part_of_speech: 'NOUN', gender: 'MASCULINE' },
  { lexeme_id: 7, russian_word: 'американка', english_translation: 'American (f.)', part_of_speech: 'NOUN', gender: 'FEMININE' },
  { lexeme_id: 8, russian_word: 'жить', english_translation: 'to live', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location', 'education'] },
  { lexeme_id: 9, russian_word: 'университет', english_translation: 'university', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
];

// Module 2: Family & People
export const MODULE_2_LEXEMES: Lexeme[] = [
  { lexeme_id: 10, russian_word: 'папа', english_translation: 'dad', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'family' },
  { lexeme_id: 11, russian_word: 'мама', english_translation: 'mom', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'family' },
  { lexeme_id: 12, russian_word: 'брат', english_translation: 'brother', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'family' },
  { lexeme_id: 13, russian_word: 'сестра', english_translation: 'sister', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'family' },
  { lexeme_id: 14, russian_word: 'работать', english_translation: 'to work', part_of_speech: 'VERB', semantic_theme: 'education', compatible_themes: ['education', 'location'] },
  { lexeme_id: 15, russian_word: 'врач', english_translation: 'doctor', part_of_speech: 'NOUN', gender: 'MASCULINE' },
  { lexeme_id: 16, russian_word: 'учительница', english_translation: 'teacher (f.)', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'education' },
  { lexeme_id: 17, russian_word: 'дом', english_translation: 'house/home', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
];

// Module 3: Hobbies & Activities
export const MODULE_3_LEXEMES: Lexeme[] = [
  { lexeme_id: 18, russian_word: 'читать', english_translation: 'to read', part_of_speech: 'VERB', semantic_theme: 'hobbies', compatible_themes: ['readable', 'hobbies'] },
  { lexeme_id: 19, russian_word: 'книга', english_translation: 'book', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'readable' },
  { lexeme_id: 20, russian_word: 'смотреть', english_translation: 'to watch', part_of_speech: 'VERB', semantic_theme: 'hobbies', compatible_themes: ['hobbies'] },
  { lexeme_id: 21, russian_word: 'фильм', english_translation: 'movie', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'hobbies' },
  { lexeme_id: 22, russian_word: 'слушать', english_translation: 'to listen', part_of_speech: 'VERB', semantic_theme: 'hobbies', compatible_themes: ['hobbies'] },
  { lexeme_id: 23, russian_word: 'музыка', english_translation: 'music', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'hobbies' },
  { lexeme_id: 24, russian_word: 'любить', english_translation: 'to love/like', part_of_speech: 'VERB', semantic_theme: 'hobbies', compatible_themes: ['hobbies', 'edible', 'readable'] },
  { lexeme_id: 25, russian_word: 'ходить', english_translation: 'to go (on foot)', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  { lexeme_id: 26, russian_word: 'кино', english_translation: 'movie theater', part_of_speech: 'NOUN', gender: 'NEUTER', semantic_theme: 'location' },
  { lexeme_id: 27, russian_word: 'футбол', english_translation: 'football', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'hobbies' },
];

// Food Pack Vocabulary
export const FOOD_PACK_LEXEMES: Lexeme[] = [
  { lexeme_id: 100, russian_word: 'кафе', english_translation: 'café', part_of_speech: 'NOUN', gender: 'NEUTER', semantic_theme: 'food' },
  { lexeme_id: 101, russian_word: 'ресторан', english_translation: 'restaurant', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'food' },
  { lexeme_id: 102, russian_word: 'столовая', english_translation: 'cafeteria', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'food' },
  { lexeme_id: 103, russian_word: 'меню', english_translation: 'menu', part_of_speech: 'NOUN', gender: 'NEUTER', semantic_theme: 'food' },
  { lexeme_id: 104, russian_word: 'счёт', english_translation: 'bill', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'food' },
  { lexeme_id: 105, russian_word: 'официант', english_translation: 'waiter', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'food' },
];

// Module 18: City & Genitive Case - Locations
export const MODULE_18_LOCATIONS: Lexeme[] = [
  { lexeme_id: 1800, russian_word: 'город', english_translation: 'city', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 1801, russian_word: 'центр', english_translation: 'center', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 1802, russian_word: 'площадь', english_translation: 'square', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 1803, russian_word: 'улица', english_translation: 'street', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 1804, russian_word: 'проспект', english_translation: 'avenue/prospect', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 1805, russian_word: 'набережная', english_translation: 'embankment', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 1806, russian_word: 'магазин', english_translation: 'store', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 1807, russian_word: 'банк', english_translation: 'bank', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 1808, russian_word: 'гостиница', english_translation: 'hotel', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'building' },
  { lexeme_id: 1809, russian_word: 'театр', english_translation: 'theater', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 1810, russian_word: 'музей', english_translation: 'museum', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 1811, russian_word: 'собор', english_translation: 'cathedral', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 1812, russian_word: 'дворец', english_translation: 'palace', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 1813, russian_word: 'памятник', english_translation: 'monument', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'physical_object' },
  { lexeme_id: 1814, russian_word: 'Кремль', english_translation: 'Kremlin', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 1815, russian_word: 'Красная площадь', english_translation: 'Red Square', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 1816, russian_word: 'Воробьёвы горы', english_translation: 'Sparrow Hills', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 1817, russian_word: 'река', english_translation: 'river', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 1818, russian_word: 'горы', english_translation: 'hills/mountains', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 1819, russian_word: 'парк', english_translation: 'park', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
];

// Module 18: City & Genitive Case - Verbs
export const MODULE_18_VERBS: Lexeme[] = [
  { lexeme_id: 1820, russian_word: 'называться', english_translation: 'to be called', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  { lexeme_id: 1821, russian_word: 'находиться', english_translation: 'to be located', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location', 'building'] },
  { lexeme_id: 1822, russian_word: 'бывать', english_translation: 'to visit/be (frequentative)', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location', 'building'] },
  { lexeme_id: 1823, russian_word: 'начинаться', english_translation: 'to begin', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  { lexeme_id: 1824, russian_word: 'поехать', english_translation: 'to go (by vehicle)', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  { lexeme_id: 1825, russian_word: 'посмотреть', english_translation: 'to see/look at', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location', 'building', 'physical_object'] },
];

// Module 18: City & Genitive Case - Adjectives
export const MODULE_18_ADJECTIVES: Lexeme[] = [
  { lexeme_id: 1826, russian_word: 'родной', english_translation: 'native/home', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 1827, russian_word: 'главный', english_translation: 'main', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 1828, russian_word: 'исторический', english_translation: 'historical', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 1829, russian_word: 'старый', english_translation: 'old', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 1830, russian_word: 'новый', english_translation: 'new', part_of_speech: 'ADJECTIVE' },
];

// Module 18: City & Genitive Case - Prepositions
export const MODULE_18_PREPOSITIONS: Lexeme[] = [
  { lexeme_id: 1831, russian_word: 'около', english_translation: 'near', part_of_speech: 'PREPOSITION', semantic_theme: 'location' },
  { lexeme_id: 1832, russian_word: 'недалеко от', english_translation: 'not far from', part_of_speech: 'PREPOSITION', semantic_theme: 'location' },
  { lexeme_id: 1833, russian_word: 'до', english_translation: 'before/until', part_of_speech: 'PREPOSITION' },
  { lexeme_id: 1834, russian_word: 'после', english_translation: 'after', part_of_speech: 'PREPOSITION' },
  { lexeme_id: 1835, russian_word: 'из', english_translation: 'from', part_of_speech: 'PREPOSITION', semantic_theme: 'location' },
  { lexeme_id: 1836, russian_word: 'от', english_translation: 'from', part_of_speech: 'PREPOSITION', semantic_theme: 'location' },
];

// Module 18: City & Genitive Case - Quantity Words
export const MODULE_18_QUANTITY_WORDS: Lexeme[] = [
  { lexeme_id: 1837, russian_word: 'много', english_translation: 'many/much', part_of_speech: 'ADVERB' },
  { lexeme_id: 1838, russian_word: 'мало', english_translation: 'few/little', part_of_speech: 'ADVERB' },
  { lexeme_id: 1839, russian_word: 'несколько', english_translation: 'several', part_of_speech: 'ADVERB' },
  { lexeme_id: 1840, russian_word: 'сколько', english_translation: 'how many', part_of_speech: 'ADVERB' },
];

// Hawai'i Pack: Island Geography & Locations
export const HAWAII_PACK_LEXEMES: Lexeme[] = [
  // Island Geography Nouns
  { lexeme_id: 2000, russian_word: 'остров', english_translation: 'island', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2001, russian_word: 'пляж', english_translation: 'beach', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2002, russian_word: 'лагуна', english_translation: 'lagoon', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 2003, russian_word: 'порт', english_translation: 'harbor/port', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2004, russian_word: 'гавань', english_translation: 'bay/harbor', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 2005, russian_word: 'национальный парк', english_translation: 'national park', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2006, russian_word: 'кратер', english_translation: 'crater', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2007, russian_word: 'океан', english_translation: 'ocean', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2008, russian_word: 'гора', english_translation: 'mountain', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 2009, russian_word: 'тропа', english_translation: 'trail/hike', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 2010, russian_word: 'вулкан', english_translation: 'volcano', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2011, russian_word: 'бухта', english_translation: 'cove/bay', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 2012, russian_word: 'залив', english_translation: 'gulf/bay', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2013, russian_word: 'мыс', english_translation: 'cape/point', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2014, russian_word: 'долина', english_translation: 'valley', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  
  // Famous Hawai'i Places
  { lexeme_id: 2015, russian_word: 'центр Гонолулу', english_translation: 'Downtown Honolulu', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2016, russian_word: 'Вайкики', english_translation: 'Waikiki', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2017, russian_word: 'Алмоана', english_translation: 'Ala Moana', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 2018, russian_word: 'Ала Моана пляж', english_translation: 'Ala Moana Beach', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2019, russian_word: 'Гавайский университет', english_translation: 'University of Hawaiʻi', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 2020, russian_word: 'Перл-Харбор', english_translation: 'Pearl Harbor', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  
  // Buildings/Places Common in Hawai'i
  { lexeme_id: 2021, russian_word: 'торговый центр', english_translation: 'mall/shopping center', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 2022, russian_word: 'сёрф-школа', english_translation: 'surf school', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'building' },
  { lexeme_id: 2023, russian_word: 'рынок', english_translation: 'market', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  { lexeme_id: 2024, russian_word: 'пляжный парк', english_translation: 'beach park', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2025, russian_word: 'аквариум', english_translation: 'aquarium', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
  
  // Verbs for Hawai'i Context
  { lexeme_id: 2026, russian_word: 'гулять', english_translation: 'to walk/stroll', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  { lexeme_id: 2027, russian_word: 'плавать', english_translation: 'to swim', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  { lexeme_id: 2028, russian_word: 'нырять', english_translation: 'to dive', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  { lexeme_id: 2029, russian_word: 'загорать', english_translation: 'to sunbathe', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  { lexeme_id: 2030, russian_word: 'исследовать', english_translation: 'to explore', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location', 'building'] },
  { lexeme_id: 2031, russian_word: 'отдыхать', english_translation: 'to relax/rest', part_of_speech: 'VERB', semantic_theme: 'location', compatible_themes: ['location'] },
  
  // Adjectives for Describing Places
  { lexeme_id: 2032, russian_word: 'красивый', english_translation: 'beautiful', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 2033, russian_word: 'тихий', english_translation: 'quiet', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 2034, russian_word: 'широкий', english_translation: 'wide', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 2035, russian_word: 'тропический', english_translation: 'tropical', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 2036, russian_word: 'живописный', english_translation: 'picturesque', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 2037, russian_word: 'популярный', english_translation: 'popular', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 2038, russian_word: 'голубой', english_translation: 'blue', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 2039, russian_word: 'песчаный', english_translation: 'sandy', part_of_speech: 'ADJECTIVE' },
  { lexeme_id: 2040, russian_word: 'турист', english_translation: 'tourist', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2041, russian_word: 'волна', english_translation: 'wave', part_of_speech: 'NOUN', gender: 'FEMININE', semantic_theme: 'location' },
  { lexeme_id: 2042, russian_word: 'закат', english_translation: 'sunset', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2043, russian_word: 'восход', english_translation: 'sunrise', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2044, russian_word: 'сёрфинг', english_translation: 'surfing', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'location' },
  { lexeme_id: 2045, russian_word: 'отель', english_translation: 'hotel', part_of_speech: 'NOUN', gender: 'MASCULINE', semantic_theme: 'building' },
];

// ==================== GRAMMAR RULES ====================

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    rule_id: 1,
    rule_name: 'Noun Gender: Masculine',
    explanation_short: 'Masculine nouns typically end in a consonant, -й, or soft sign -ь.',
    explanation_long: 'Masculine nouns typically end in a consonant (e.g., брат), -й (e.g., музей), or a soft sign -ь (e.g., день). Adjectives describing them end in -ый, -ий, or -ой.',
    unlocks_in_module: 1,
    examples: ['студент', 'дом', 'музей'],
  },
  {
    rule_id: 2,
    rule_name: 'Noun Gender: Feminine',
    explanation_short: 'Feminine nouns typically end in -а, -я, or soft sign -ь.',
    explanation_long: 'Feminine nouns typically end in -а (e.g., мама), -я (e.g., Таня), or a soft sign -ь (e.g., дверь). Adjectives describing them end in -ая or -яя.',
    unlocks_in_module: 1,
    examples: ['мама', 'книга', 'студентка'],
  },
  {
    rule_id: 3,
    rule_name: 'Prepositional Case: Location',
    explanation_short: 'Add -е to most nouns to show location (Где?).',
    explanation_long: 'The Prepositional case answers the question "Где?" (Where?). To indicate location, add -е to most nouns. For feminine nouns ending in -ия or -ь, use the ending -и (e.g., Я живу в России).',
    unlocks_in_module: 2,
    examples: ['в университете', 'в доме', 'в России'],
  },
  {
    rule_id: 4,
    rule_name: 'Accusative Case: Feminine Direct Object',
    explanation_short: 'Change -а to -у and -я to -ю for feminine direct objects.',
    explanation_long: 'To show that a feminine noun is the direct object of an action, change the ending. Nouns ending in -а change to -у (e.g., Я читаю книгу). Nouns ending in -я change to -ю (e.g., Я изучаю историю).',
    unlocks_in_module: 3,
    examples: ['Я читаю книгу', 'Я слушаю музыку'],
  },
  {
    rule_id: 5,
    rule_name: 'Accusative Case: Masculine/Neuter Direct Object',
    explanation_short: 'Inanimate masculine/neuter nouns don\'t change in accusative.',
    explanation_long: 'Inanimate masculine and neuter nouns do not change their form in the Accusative case when used as a direct object. The form is the same as the Nominative (e.g., Я смотрю фильм).',
    unlocks_in_module: 3,
    examples: ['Я смотрю фильм', 'Я люблю футбол'],
  },
  {
    rule_id: 18,
    rule_name: 'Genitive Case: Possession',
    explanation_short: 'Use genitive to show possession (whose)',
    explanation_long: 'The genitive case indicates possession. Example: Это машина моего друга (This is my friend\'s car). The possessor goes in genitive case.',
    unlocks_in_module: 18,
    examples: ['Это машина моего друга', 'Дом моей мамы'],
  },
  {
    rule_id: 19,
    rule_name: 'Genitive Case: Absence/Negation',
    explanation_short: 'Use genitive with нет (there is no/I don\'t have)',
    explanation_long: 'Use genitive case to indicate absence or lack: У меня нет брата (I don\'t have a brother). After нет, the noun goes in genitive.',
    unlocks_in_module: 18,
    examples: ['У меня нет брата', 'В городе нет парка'],
  },
  {
    rule_id: 20,
    rule_name: 'Genitive Case: Quantity with Numbers',
    explanation_short: 'After 2,3,4 use genitive singular; after 5+ use genitive plural',
    explanation_long: 'Numbers require genitive case:\n- After 2,3,4: genitive singular (два брата)\n- After 5+: genitive plural (пять братьев)',
    unlocks_in_module: 18,
    examples: ['У меня два брата', 'У меня пять братьев'],
  },
  {
    rule_id: 21,
    rule_name: 'Genitive Plural: Masculine Nouns',
    explanation_short: '-ов/-ев for consonant stems, -ей for soft stems',
    explanation_long: 'Genitive plural endings for masculine nouns:\n- -ов/-ев: студент → студентов\n- -ей (after ь or husher): учитель → учителей\n- -ев (after й): музей → музеев',
    unlocks_in_module: 18,
    examples: ['много студентов', 'много музеев', 'много учителей'],
  },
  {
    rule_id: 22,
    rule_name: 'Genitive with Prepositions',
    explanation_short: 'Prepositions около, недалеко от, до, после, из, от require genitive',
    explanation_long: 'Many prepositions require genitive case:\n- около/недалеко от (near): около дома\n- до/после (before/after): после обеда\n- из/с/от (from): из университета',
    unlocks_in_module: 18,
    examples: ['Недалеко от моего дома есть парк', 'Я пришёл из университета до обеда'],
  },
];

// ==================== MODULES WITH SECTIONS ====================

export const MODULES: Module[] = [
  {
    module_id: 0,
    module_number: 0,
    title_english: 'Cyrillic Alphabet',
    title_russian: 'Алфавит',
    associated_lexemes: [],
    associated_grammar: [],
    sections: [], // Alphabet module has its own special flow
    textbook_chapter: 0,
  },
  {
    module_id: 1,
    module_number: 1,
    title_english: 'Greetings',
    title_russian: 'Приветствия',
    associated_lexemes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    associated_grammar: [1, 2],
    textbook_chapter: 1,
    sections: [
      {
        section_id: 101,
        section_name: 'Basic Phrases',
        section_type: 'VOCABULARY',
        associated_lexemes: [1, 2, 3],
        associated_grammar: [],
        order: 1,
      },
      {
        section_id: 102,
        section_name: 'Noun Gender',
        section_type: 'GRAMMAR',
        associated_lexemes: [4, 5, 6, 7, 9],
        associated_grammar: [1, 2],
        order: 2,
      },
      {
        section_id: 103,
        section_name: 'Listening Practice',
        section_type: 'LISTENING',
        associated_lexemes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        associated_grammar: [],
        order: 3,
      },
    ],
  },
  {
    module_id: 2,
    module_number: 2,
    title_english: 'Family',
    title_russian: 'Семья',
    associated_lexemes: [10, 11, 12, 13, 14, 15, 16, 17],
    associated_grammar: [3],
    textbook_chapter: 2,
    sections: [
      {
        section_id: 201,
        section_name: 'Family Vocabulary',
        section_type: 'VOCABULARY',
        associated_lexemes: [10, 11, 12, 13],
        associated_grammar: [],
        order: 1,
      },
      {
        section_id: 202,
        section_name: 'Prepositional Case',
        section_type: 'GRAMMAR',
        associated_lexemes: [14, 15, 16, 17],
        associated_grammar: [3],
        order: 2,
      },
      {
        section_id: 203,
        section_name: 'Mixed Review',
        section_type: 'MIXED_REVIEW',
        associated_lexemes: [10, 11, 12, 13, 14, 15, 16, 17],
        associated_grammar: [3],
        order: 3,
      },
    ],
  },
  {
    module_id: 3,
    module_number: 3,
    title_english: 'Hobbies',
    title_russian: 'Хобби',
    associated_lexemes: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    associated_grammar: [4, 5],
    textbook_chapter: 3,
    sections: [
      {
        section_id: 301,
        section_name: 'Activity Verbs',
        section_type: 'VOCABULARY',
        associated_lexemes: [18, 20, 22, 24, 25],
        associated_grammar: [],
        order: 1,
      },
      {
        section_id: 302,
        section_name: 'Accusative Case',
        section_type: 'GRAMMAR',
        associated_lexemes: [19, 21, 23, 26, 27],
        associated_grammar: [4, 5],
        order: 2,
      },
      {
        section_id: 303,
        section_name: 'Spelling & Pronunciation',
        section_type: 'SPELLING',
        associated_lexemes: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
        associated_grammar: [],
        order: 3,
      },
    ],
  },
];

// ==================== VOCAB PACKS ====================

export const VOCAB_PACKS: VocabPack[] = [
  {
    pack_id: 1,
    pack_name: 'Food Pack',
    description: 'Essential vocabulary for dining and restaurants',
    associated_lexemes: [100, 101, 102, 103, 104, 105],
    prerequisite_module: 1,
    icon: 'restaurant',
    word_count: 6,
    theme: 'food',
    theme_description: 'Food and dining related vocabulary',
  },
  {
    pack_id: 2,
    pack_name: "Hawai'i Pack",
    description: "Hawai'i-themed vocabulary for city locations, directions, and genitive case practice",
    associated_lexemes: [
      2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014,
      2015, 2016, 2017, 2018, 2019, 2020,
      2021, 2022, 2023, 2024, 2025,
      2026, 2027, 2028, 2029, 2030, 2031,
      2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040,
      2041, 2042, 2043, 2044, 2045,
    ],
    prerequisite_module: 18,
    icon: 'island',
    word_count: 46,
    theme: 'hawaii',
    theme_description: "Hawai'i places and locations for genitive case practice",
  },
];

// ==================== HELPER FUNCTIONS ====================

// Get all lexemes from all modules
export const getAllLexemes = (): Lexeme[] => {
  return [
    ...MODULE_1_LEXEMES,
    ...MODULE_2_LEXEMES,
    ...MODULE_3_LEXEMES,
    ...FOOD_PACK_LEXEMES,
    ...MODULE_18_LOCATIONS,
    ...MODULE_18_VERBS,
    ...MODULE_18_ADJECTIVES,
    ...MODULE_18_PREPOSITIONS,
    ...MODULE_18_QUANTITY_WORDS,
    ...HAWAII_PACK_LEXEMES,
  ];
};

// Get lexemes by IDs
export const getLexemesByIds = (ids: number[]): Lexeme[] => {
  const allLexemes = getAllLexemes();
  return ids.map((id) => allLexemes.find((lex) => lex.lexeme_id === id)).filter(Boolean) as Lexeme[];
};

// Get lexemes by module number
export const getLexemesByModule = (moduleNumber: number, activePackIds: number[] = []): Lexeme[] => {
  const module = MODULES.find((m) => m.module_number === moduleNumber);
  if (!module) return [];

  let lexemes = getLexemesByIds(module.associated_lexemes);

  // Add lexemes from active packs
  activePackIds.forEach((packId) => {
    const pack = VOCAB_PACKS.find((p) => p.pack_id === packId);
    if (pack && pack.prerequisite_module <= moduleNumber) {
      lexemes = [...lexemes, ...getLexemesByIds(pack.associated_lexemes)];
    }
  });

  return lexemes;
};

// Get lexemes by section
export const getLexemesBySection = (sectionId: number): Lexeme[] => {
  // Check modules first
  for (const module of MODULES) {
    const section = module.sections.find((s) => s.section_id === sectionId);
    if (section) {
      return getLexemesByIds(section.associated_lexemes);
    }
  }
  // Check chapters
  for (const chapter of CHAPTERS) {
    const section = chapter.sections.find((s) => s.section_id === sectionId);
    if (section) {
      return getLexemesByIds(section.associated_lexemes);
    }
  }
  return [];
};

// Get grammar rules by module
export const getGrammarRulesByModule = (moduleNumber: number): GrammarRule[] => {
  const module = MODULES.find((m) => m.module_number === moduleNumber);
  if (!module) return [];

  return GRAMMAR_RULES.filter((rule) => module.associated_grammar.includes(rule.rule_id));
};

// Get grammar rules by section
export const getGrammarRulesBySection = (sectionId: number): GrammarRule[] => {
  // Check modules first
  for (const module of MODULES) {
    const section = module.sections.find((s) => s.section_id === sectionId);
    if (section) {
      return GRAMMAR_RULES.filter((rule) => section.associated_grammar.includes(rule.rule_id));
    }
  }
  // Check chapters
  for (const chapter of CHAPTERS) {
    const section = chapter.sections.find((s) => s.section_id === sectionId);
    if (section) {
      return GRAMMAR_RULES.filter((rule) => section.associated_grammar.includes(rule.rule_id));
    }
  }
  return [];
};

// Get all lexemes learned up to a module (for context-aware sentence generation)
export const getLearnedLexemes = (upToModuleNumber: number, activePackIds: number[] = []): Lexeme[] => {
  let allLexemes: Lexeme[] = [];

  for (let i = 1; i <= upToModuleNumber; i++) {
    const moduleLexemes = getLexemesByModule(i, activePackIds);
    allLexemes = [...allLexemes, ...moduleLexemes];
  }

  // Remove duplicates
  return Array.from(new Map(allLexemes.map((lex) => [lex.lexeme_id, lex])).values());
};

// ==================== CHAPTERS (1:1 with textbook) ====================

export const CHAPTERS: Chapter[] = [
  {
    chapter_id: 1,
    chapter_number: 1,
    title_english: 'Chapter 1',
    title_russian: 'Глава 1',
    associated_lexemes: [],
    associated_grammar: [],
    sections: [
      {
        section_id: 1001,
        section_name: 'Letters: М П Т К А О Э',
        section_type: 'LETTER_LEARNING',
        associated_lexemes: [],
        associated_grammar: [],
        letters: ['М м', 'П п', 'Т т', 'К к', 'А а', 'О о', 'Э э'],
        order: 1,
      },
      {
        section_id: 1002,
        section_name: 'Letters: Д Н Ч Е Я',
        section_type: 'LETTER_LEARNING',
        associated_lexemes: [],
        associated_grammar: [],
        letters: ['Д д', 'Н н', 'Ч ч', 'Е е', 'Я я'],
        order: 2,
      },
    ],
  },
  // Placeholder chapters 2-17
  ...Array.from({ length: 16 }, (_, i): Chapter => ({
    chapter_id: i + 2,
    chapter_number: i + 2,
    title_english: `Chapter ${i + 2}`,
    title_russian: `Глава ${i + 2}`,
    associated_lexemes: [],
    associated_grammar: [],
    sections: [],
  })),
  // Chapter 18: City & Genitive Case
  {
    chapter_id: 18,
    chapter_number: 18,
    title_english: 'City & Genitive Case',
    title_russian: 'Город и родительный падеж',
    associated_lexemes: [
      // Locations (1800-1819)
      1800, 1801, 1802, 1803, 1804, 1805, 1806, 1807, 1808, 1809, 1810, 1811, 1812, 1813, 1814, 1815, 1816, 1817, 1818, 1819,
      // Verbs (1820-1825)
      1820, 1821, 1822, 1823, 1824, 1825,
      // Adjectives (1826-1830)
      1826, 1827, 1828, 1829, 1830,
      // Prepositions (1831-1836)
      1831, 1832, 1833, 1834, 1835, 1836,
      // Quantity words (1837-1840)
      1837, 1838, 1839, 1840,
    ],
    associated_grammar: [18, 19, 20, 21, 22],
    sections: [
      {
        section_id: 1801,
        section_name: 'Vocabulary Introduction',
        section_type: 'VOCABULARY',
        associated_lexemes: [
          // Key locations
          1800, 1801, 1802, 1803, 1804, 1805,
          // Key buildings
          1806, 1807, 1808, 1809, 1810, 1811, 1812, 1813,
          // Verbs
          1820, 1821, 1822, 1823, 1824, 1825,
        ],
        associated_grammar: [],
        order: 1,
      },
      {
        section_id: 1802,
        section_name: 'Genitive Case Basics',
        section_type: 'GRAMMAR',
        associated_lexemes: [
          // Nouns for genitive practice
          1800, 1801, 1802, 1803, 1806, 1807, 1809, 1810, 1819,
          // Quantity words
          1837, 1838, 1839, 1840,
        ],
        associated_grammar: [18, 19, 20],
        order: 2,
      },
      {
        section_id: 1803,
        section_name: 'City Descriptions',
        section_type: 'MIXED_REVIEW',
        associated_lexemes: [
          // All locations and buildings
          1800, 1801, 1802, 1803, 1804, 1805, 1806, 1807, 1808, 1809, 1810, 1811, 1812, 1813, 1814, 1815, 1816, 1817, 1818, 1819,
          // Verbs
          1820, 1821, 1822, 1823, 1824, 1825,
          // Adjectives
          1826, 1827, 1828, 1829, 1830,
        ],
        associated_grammar: [18, 19, 20, 22],
        order: 3,
      },
      {
        section_id: 1804,
        section_name: 'Advanced Genitive',
        section_type: 'GRAMMAR',
        associated_lexemes: [
          // Nouns for genitive plural practice
          1800, 1806, 1807, 1809, 1810, 1811, 1812,
          // Prepositions
          1831, 1832, 1833, 1834, 1835, 1836,
          // Quantity words
          1837, 1838, 1839, 1840,
        ],
        associated_grammar: [21, 22],
        order: 4,
      },
    ],
  },
  // Placeholder chapters 19-24
  ...Array.from({ length: 6 }, (_, i): Chapter => ({
    chapter_id: i + 19,
    chapter_number: i + 19,
    title_english: `Chapter ${i + 19}`,
    title_russian: `Глава ${i + 19}`,
    associated_lexemes: [],
    associated_grammar: [],
    sections: [],
  })),
];

// Helper function to get chapter by number
export const getChapterByNumber = (chapterNumber: number): Chapter | undefined => {
  return CHAPTERS.find((ch) => ch.chapter_number === chapterNumber);
};

// Helper function to get chapters up to a certain number
export const getChaptersUpTo = (chapterNumber: number): Chapter[] => {
  return CHAPTERS.filter((ch) => ch.chapter_number <= chapterNumber);
};

