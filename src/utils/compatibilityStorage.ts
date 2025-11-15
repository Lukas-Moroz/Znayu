// Persistent storage for learned compatibility patterns
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPATIBILITY_STORAGE_KEY = 'sentence_compatibility_patterns';

/**
 * Generate a storage key for a verb-noun pair
 */
const getCompatibilityKey = (verbId: number, nounId: number): string => {
  return `${verbId}:${nounId}`;
};

/**
 * Save a compatibility pattern
 */
export const saveCompatibilityPattern = async (
  verbId: number,
  nounId: number,
  compatible: boolean
): Promise<void> => {
  try {
    const key = getCompatibilityKey(verbId, nounId);
    const patterns = await loadCompatibilityPatterns();
    patterns.set(key, compatible);
    
    // Convert Map to object for storage
    const patternsObj: Record<string, boolean> = {};
    patterns.forEach((value, mapKey) => {
      patternsObj[mapKey] = value;
    });
    
    await AsyncStorage.setItem(COMPATIBILITY_STORAGE_KEY, JSON.stringify(patternsObj));
  } catch (error) {
    console.error('Error saving compatibility pattern:', error);
  }
};

/**
 * Load all compatibility patterns
 */
export const loadCompatibilityPatterns = async (): Promise<Map<string, boolean>> => {
  try {
    const stored = await AsyncStorage.getItem(COMPATIBILITY_STORAGE_KEY);
    if (!stored) {
      return new Map<string, boolean>();
    }

    const patternsObj: Record<string, boolean> = JSON.parse(stored);
    const patterns = new Map<string, boolean>();
    
    Object.entries(patternsObj).forEach(([key, value]) => {
      patterns.set(key, value);
    });

    return patterns;
  } catch (error) {
    console.error('Error loading compatibility patterns:', error);
    return new Map<string, boolean>();
  }
};

/**
 * Get compatibility for a specific verb-noun pair
 */
export const getCompatibilityPattern = async (
  verbId: number,
  nounId: number
): Promise<boolean | null> => {
  try {
    const patterns = await loadCompatibilityPatterns();
    const key = getCompatibilityKey(verbId, nounId);
    return patterns.has(key) ? patterns.get(key) || null : null;
  } catch (error) {
    console.error('Error getting compatibility pattern:', error);
    return null;
  }
};

/**
 * Clear all compatibility patterns
 */
export const clearCompatibilityPatterns = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(COMPATIBILITY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing compatibility patterns:', error);
  }
};

/**
 * Batch save multiple compatibility patterns
 */
export const saveCompatibilityPatternsBatch = async (
  patterns: Array<{ verbId: number; nounId: number; compatible: boolean }>
): Promise<void> => {
  try {
    const existingPatterns = await loadCompatibilityPatterns();
    
    patterns.forEach(({ verbId, nounId, compatible }) => {
      const key = getCompatibilityKey(verbId, nounId);
      existingPatterns.set(key, compatible);
    });
    
    // Convert Map to object for storage
    const patternsObj: Record<string, boolean> = {};
    existingPatterns.forEach((value, mapKey) => {
      patternsObj[mapKey] = value;
    });
    
    await AsyncStorage.setItem(COMPATIBILITY_STORAGE_KEY, JSON.stringify(patternsObj));
  } catch (error) {
    console.error('Error saving compatibility patterns batch:', error);
  }
};

