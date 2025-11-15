// Russian dictionary utilities for case forms, verb conjugation, and phrase building
// Based on Russian grammar rules

type Case = 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'prepositional';
type Gender = 'MASCULINE' | 'FEMININE' | 'NEUTER';
type Pronoun = 'я' | 'ты' | 'он' | 'она' | 'оно' | 'мы' | 'вы' | 'они';

/**
 * Get the case form of a Russian noun
 * @param noun - The noun in nominative case
 * @param caseType - The case to convert to
 * @param gender - Optional gender hint (if not provided, will try to infer)
 */
export const getCaseForm = (noun: string, caseType: Case, gender?: Gender): string => {
  if (!noun || noun.trim().length === 0) return noun;

  const trimmed = noun.trim();
  const lower = trimmed.toLowerCase();

  // Infer gender from ending if not provided
  if (!gender) {
    if (lower.endsWith('а') || lower.endsWith('я')) {
      gender = 'FEMININE';
    } else if (lower.endsWith('о') || lower.endsWith('е')) {
      gender = 'NEUTER';
    } else {
      gender = 'MASCULINE';
    }
  }

  // Nominative case (default)
  if (caseType === 'nominative') {
    return trimmed;
  }

  // Accusative case
  if (caseType === 'accusative') {
    if (gender === 'FEMININE') {
      // Feminine: -а -> -у, -я -> -ю, -ь -> -ь (no change for soft sign)
      if (lower.endsWith('а')) {
        return trimmed.slice(0, -1) + 'у';
      }
      if (lower.endsWith('я')) {
        return trimmed.slice(0, -1) + 'ю';
      }
      if (lower.endsWith('ь')) {
        return trimmed; // Soft sign feminine nouns often don't change
      }
    } else if (gender === 'MASCULINE') {
      // Masculine animate: same as genitive, inanimate: same as nominative
      // For simplicity, return nominative (can be enhanced)
      return trimmed;
    }
    // Neuter: same as nominative
    return trimmed;
  }

  // Prepositional case
  if (caseType === 'prepositional') {
    if (gender === 'FEMININE') {
      // Feminine: -а -> -е, -я -> -е, -ь -> -и, -ия -> -ии
      if (lower.endsWith('ия')) {
        return trimmed.slice(0, -2) + 'ии';
      }
      if (lower.endsWith('а')) {
        return trimmed.slice(0, -1) + 'е';
      }
      if (lower.endsWith('я')) {
        return trimmed.slice(0, -1) + 'е';
      }
      if (lower.endsWith('ь')) {
        return trimmed.slice(0, -1) + 'и';
      }
    } else if (gender === 'MASCULINE' || gender === 'NEUTER') {
      // Masculine/Neuter: add -е (or -и for certain endings)
      if (lower.endsWith('й')) {
        return trimmed.slice(0, -1) + 'е';
      }
      if (lower.endsWith('ь')) {
        return trimmed.slice(0, -1) + 'и';
      }
      return trimmed + 'е';
    }
  }

  // Genitive case
  if (caseType === 'genitive') {
    if (gender === 'FEMININE') {
      // Feminine: -а -> -ы/-и, -я -> -и, -ь -> -и
      if (lower.endsWith('а')) {
        // Check for hard vs soft stem
        return trimmed.slice(0, -1) + 'ы';
      }
      if (lower.endsWith('я')) {
        return trimmed.slice(0, -1) + 'и';
      }
      if (lower.endsWith('ь')) {
        return trimmed.slice(0, -1) + 'и';
      }
    } else if (gender === 'MASCULINE') {
      // Masculine: add -а or -я
      if (lower.endsWith('й') || lower.endsWith('ь')) {
        return trimmed.slice(0, -1) + 'я';
      }
      return trimmed + 'а';
    } else if (gender === 'NEUTER') {
      // Neuter: -о -> -а, -е -> -я
      if (lower.endsWith('о')) {
        return trimmed.slice(0, -1) + 'а';
      }
      if (lower.endsWith('е')) {
        return trimmed.slice(0, -1) + 'я';
      }
    }
  }

  // Dative case
  if (caseType === 'dative') {
    if (gender === 'FEMININE') {
      // Feminine: -а -> -е, -я -> -е, -ь -> -и
      if (lower.endsWith('а') || lower.endsWith('я')) {
        return trimmed.slice(0, -1) + 'е';
      }
      if (lower.endsWith('ь')) {
        return trimmed.slice(0, -1) + 'и';
      }
    } else if (gender === 'MASCULINE' || gender === 'NEUTER') {
      // Masculine/Neuter: add -у or -ю
      if (lower.endsWith('й') || lower.endsWith('ь')) {
        return trimmed.slice(0, -1) + 'ю';
      }
      return trimmed + 'у';
    }
  }

  // Instrumental case
  if (caseType === 'instrumental') {
    if (gender === 'FEMININE') {
      // Feminine: -а -> -ой/-ей, -я -> -ей, -ь -> -ью
      if (lower.endsWith('а')) {
        return trimmed.slice(0, -1) + 'ой';
      }
      if (lower.endsWith('я')) {
        return trimmed.slice(0, -1) + 'ей';
      }
      if (lower.endsWith('ь')) {
        return trimmed + 'ю';
      }
    } else if (gender === 'MASCULINE' || gender === 'NEUTER') {
      // Masculine/Neuter: add -ом/-ем
      if (lower.endsWith('й') || lower.endsWith('ь')) {
        return trimmed.slice(0, -1) + 'ем';
      }
      return trimmed + 'ом';
    }
  }

  // Fallback: return original
  return trimmed;
};

/**
 * Get the conjugated form of a Russian verb
 * @param verb - The verb in infinitive form
 * @param pronoun - The pronoun to conjugate for
 */
export const getVerbForm = (verb: string, pronoun: Pronoun): string => {
  if (!verb || verb.trim().length === 0) return verb;

  const trimmed = verb.trim();
  const lower = trimmed.toLowerCase();

  // Remove infinitive endings (-ть, -ти, -чь)
  let stem = trimmed;
  if (lower.endsWith('ть')) {
    stem = trimmed.slice(0, -2);
  } else if (lower.endsWith('ти')) {
    stem = trimmed.slice(0, -2);
  } else if (lower.endsWith('чь')) {
    stem = trimmed.slice(0, -2);
  }

  // Conjugation patterns
  const endings: Record<Pronoun, string> = {
    я: 'ю',
    ты: 'ешь',
    он: 'ет',
    она: 'ет',
    оно: 'ет',
    мы: 'ем',
    вы: 'ете',
    они: 'ют',
  };

  // Check for first conjugation (most verbs ending in -ать, -ять, -еть)
  // First conjugation: -ю, -ешь, -ет, -ем, -ете, -ют
  if (lower.endsWith('ать') || lower.endsWith('ять') || lower.endsWith('еть')) {
    if (pronoun === 'я') return stem + 'ю';
    if (pronoun === 'ты') return stem + 'ешь';
    if (pronoun === 'он' || pronoun === 'она' || pronoun === 'оно') return stem + 'ет';
    if (pronoun === 'мы') return stem + 'ем';
    if (pronoun === 'вы') return stem + 'ете';
    if (pronoun === 'они') return stem + 'ют';
  }

  // Second conjugation (verbs ending in -ить)
  // Second conjugation: -ю, -ишь, -ит, -им, -ите, -ят
  if (lower.endsWith('ить')) {
    const stem2 = trimmed.slice(0, -3);
    if (pronoun === 'я') return stem2 + 'ю';
    if (pronoun === 'ты') return stem2 + 'ишь';
    if (pronoun === 'он' || pronoun === 'она' || pronoun === 'оно') return stem2 + 'ит';
    if (pronoun === 'мы') return stem2 + 'им';
    if (pronoun === 'вы') return stem2 + 'ите';
    if (pronoun === 'они') return stem2 + 'ят';
  }

  // Fallback: try to add standard endings
  const ending = endings[pronoun];
  if (ending) {
    return stem + ending;
  }

  return trimmed;
};

/**
 * Build a Russian phrase with proper conjugation and case
 * @param pronoun - The pronoun (subject)
 * @param verb - The verb in infinitive form
 * @param noun - The noun in nominative case
 * @param caseType - The case for the noun (default: accusative for direct objects)
 */
export const buildPhrase = (
  pronoun: Pronoun,
  verb: string,
  noun: string,
  caseType: Case = 'accusative'
): string => {
  const conjugatedVerb = getVerbForm(verb, pronoun);
  const casedNoun = getCaseForm(noun, caseType);

  // Capitalize first letter
  const capitalizedPronoun = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);

  return `${capitalizedPronoun} ${conjugatedVerb} ${casedNoun}`.trim();
};

/**
 * Get the gender of a Russian noun based on its ending
 */
export const getNounGender = (noun: string): Gender => {
  if (!noun) return 'MASCULINE';

  const lower = noun.toLowerCase().trim();

  if (lower.endsWith('а') || lower.endsWith('я')) {
    return 'FEMININE';
  }
  if (lower.endsWith('о') || lower.endsWith('е')) {
    return 'NEUTER';
  }
  return 'MASCULINE';
};

/**
 * Get genitive plural form of a Russian noun
 * @param noun - The noun in nominative singular
 * @param gender - Optional gender hint
 */
export const getGenitivePluralForm = (noun: string, gender?: Gender): string => {
  if (!noun || noun.trim().length === 0) return noun;

  const trimmed = noun.trim();
  const lower = trimmed.toLowerCase();

  // Special exceptions
  const exceptions: Record<string, string> = {
    'человек': 'человек',
    'друг': 'друзей',
    'брат': 'братьев',
    'сын': 'сыновей',
    'студент': 'студентов',
    'учитель': 'учителей',
    'музей': 'музеев',
    'театр': 'театров',
    'магазин': 'магазинов',
    'банк': 'банков',
    'парк': 'парков',
    'город': 'городов',
    'центр': 'центров',
  };

  if (exceptions[lower]) {
    return exceptions[lower];
  }

  // Infer gender if not provided
  if (!gender) {
    gender = getNounGender(noun);
  }

  if (gender === 'MASCULINE') {
    // Masculine genitive plural rules
    if (lower.endsWith('й')) {
      // -й -> -ев (музей -> музеев)
      return trimmed.slice(0, -1) + 'ев';
    }
    if (lower.endsWith('ь')) {
      // -ь -> -ей (учитель -> учителей)
      return trimmed.slice(0, -1) + 'ей';
    }
    // Consonant stem -> -ов (студент -> студентов)
    // Check for hushers (ж, ш, ч, щ) - they also get -ей
    const lastChar = lower[lower.length - 1];
    if (['ж', 'ш', 'ч', 'щ'].includes(lastChar)) {
      return trimmed + 'ей';
    }
    return trimmed + 'ов';
  } else if (gender === 'FEMININE') {
    // Feminine genitive plural rules
    if (lower.endsWith('а')) {
      // -а -> remove -а, add - (usually - or -ов/-ев depending on stem)
      // Most feminine nouns ending in -а become - (zero ending) in genitive plural
      // But some get -ов/-ев
      const stem = trimmed.slice(0, -1);
      // Check if stem ends in certain consonants that require -ов
      const lastStemChar = stem.toLowerCase()[stem.length - 1];
      if (['к', 'г', 'х'].includes(lastStemChar)) {
        return stem + 'ов';
      }
      // Default: zero ending (just remove -а)
      return stem;
    }
    if (lower.endsWith('я')) {
      // -я -> -й or -ь (depending on stem)
      // Most become -й
      return trimmed.slice(0, -1) + 'й';
    }
    if (lower.endsWith('ь')) {
      // -ь -> -ей
      return trimmed.slice(0, -1) + 'ей';
    }
  } else if (gender === 'NEUTER') {
    // Neuter genitive plural rules
    if (lower.endsWith('о')) {
      // -о -> usually zero ending, but some get -ов
      const stem = trimmed.slice(0, -1);
      return stem; // Most neuter nouns have zero ending in genitive plural
    }
    if (lower.endsWith('е')) {
      // -е -> -ей or -ь
      return trimmed.slice(0, -1) + 'ей';
    }
  }

  // Fallback: return original
  return trimmed;
};

/**
 * Check if a word exists in our vocabulary (basic check)
 * In a full implementation, this would check against a dictionary JSON file
 */
export const wordExists = (word: string): boolean => {
  if (!word || word.trim().length === 0) return false;
  // Basic validation: contains Cyrillic characters
  return /[А-Яа-яЁё]/.test(word);
};

/**
 * Try to get the normal form (nominative/infinitive) of a word
 * This is a simplified version - in production, use pymorphy2-generated dictionary
 */
export const getNormalForm = (word: string): string => {
  if (!word) return word;
  
  const trimmed = word.trim();
  const lower = trimmed.toLowerCase();
  
  // For verbs, try to remove conjugation endings
  if (lower.endsWith('ю') || lower.endsWith('у')) {
    // Might be conjugated verb, but we can't reliably get infinitive without dictionary
    return trimmed;
  }
  
  // For nouns, try basic case reversal (simplified)
  if (lower.endsWith('у')) {
    // Might be accusative feminine, try to reverse
    return trimmed.slice(0, -1) + 'а';
  }
  if (lower.endsWith('ю')) {
    // Might be accusative feminine ending in -я
    return trimmed.slice(0, -1) + 'я';
  }
  if (lower.endsWith('е')) {
    // Might be prepositional, try to reverse
    const withoutE = trimmed.slice(0, -1);
    if (lower.endsWith('ие')) {
      return withoutE.slice(0, -1) + 'ия';
    }
    return withoutE + 'а';
  }
  
  // Return as-is if we can't determine
  return trimmed;
};

/**
 * Get comprehensive word data (if dictionary JSON is available)
 * This would load from russian_dictionary.json if it exists
 */
export const getWordData = (word: string): Record<string, any> | null => {
  // In a full implementation, this would load from the generated JSON dictionary
  // For now, return basic info
  if (!wordExists(word)) return null;
  
  return {
    word,
    normal_form: getNormalForm(word),
    gender: getNounGender(word),
  };
};

