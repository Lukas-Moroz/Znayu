// Text-to-Speech utilities using expo-speech for Russian language support
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import type { AlphabetLetter, Lexeme } from '../types/models';
import type { SpeechOptions, Voice } from 'expo-speech';

// Import VoiceQuality as a value, not a type
import { VoiceQuality } from 'expo-speech';

// TTS Configuration Options (extends SpeechOptions)
export interface TTSOptions extends Partial<SpeechOptions> {
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
}

// Default TTS settings for Russian
export const DEFAULT_LANGUAGE = 'ru-RU';
export const DEFAULT_RATE = 0.75; // Slightly slower for learning
export const DEFAULT_PITCH = 1.0;
export const DEFAULT_VOLUME = 1.0;

// TTS Configuration state
let ttsInitialized = false;
let ttsAvailable = false;

/**
 * Check if TTS is currently speaking
 */
export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error('Error checking speaking status:', error);
    return false;
  }
};

/**
 * Stop current speech
 */
export const stopSpeaking = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Error stopping speech:', error);
  }
};

/**
 * Check if Russian TTS is available on the device
 */
export const checkRussianTTSAvailable = async (): Promise<boolean> => {
  try {
    // Try to get available voices
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const hasRussian = voices.some((voice) => 
        voice.language.toLowerCase().startsWith('ru')
      );
      return hasRussian || voices.length > 0; // Fallback to any voice if Russian not available
    } catch (error) {
      // If getVoices is not available, assume TTS is available (iOS/Android)
      // expo-speech will use system defaults
      return true;
    }
  } catch (error) {
    console.error('Error checking TTS availability:', error);
    // Assume available as fallback
    return true;
  }
};

/**
 * Main function to speak Russian text
 */
export const speakRussian = async (
  text: string,
  options?: TTSOptions
): Promise<void> => {
  if (!text || text.trim().length === 0) {
    console.warn('TTS: Empty text provided');
    return;
  }

  // Initialize TTS if not already initialized
  if (!ttsInitialized) {
    await initializeTTS();
  }

  try {
    // Stop any currently playing speech
    await stopSpeaking();

    const {
      language = DEFAULT_LANGUAGE,
      rate = DEFAULT_RATE,
      pitch = DEFAULT_PITCH,
      volume = DEFAULT_VOLUME,
      onStart,
      onDone,
      onStopped,
      onError,
      voice,
      ...otherOptions
    } = options || {};

    // Handle callbacks - expo-speech supports onStart, onDone, onStopped, onError
    // Note: quality is not in SpeechOptions, but voice identifier can be used
    const callbacks: SpeechOptions = {
      language,
      pitch,
      rate,
      volume,
      voice, // Voice identifier if provided
      onStart: onStart ? () => onStart() : undefined,
      onDone: onDone ? () => onDone() : undefined,
      onStopped: onStopped ? () => onStopped() : undefined,
      onError: onError 
        ? (error: Error) => {
            console.error('TTS Error:', error);
            onError(error);
          }
        : (error: Error) => {
            // Default error handling: log error
            console.error('TTS Error (no handler):', error);
            // Could try English fallback here if needed, but for now just log
          },
      ...otherOptions,
    };

    // Speak the text (expo-speech handles queuing automatically)
    try {
      Speech.speak(text, callbacks);
    } catch (speakError) {
      // Handle synchronous errors
      console.error('Error calling Speech.speak:', speakError);
      if (onError) {
        onError(speakError as Error);
      }
    }
  } catch (error) {
    console.error('Error in speakRussian:', error);
    if (options?.onError) {
      options.onError(error as Error);
    }
    // Note: We don't try English fallback here as it's already handled in onError callback
    // This prevents infinite recursion
  }
};

/**
 * Speak an alphabet letter with its name and example word
 */
export const speakAlphabetLetter = async (
  letter: AlphabetLetter,
  options?: TTSOptions
): Promise<void> => {
  try {
    // Stop any currently playing speech
    await stopSpeaking();

    const {
      language = DEFAULT_LANGUAGE,
      rate = DEFAULT_RATE,
      pitch = DEFAULT_PITCH,
      volume = DEFAULT_VOLUME,
      onStart,
      onDone,
      onStopped,
      onError,
      voice,
      ...otherOptions
    } = options || {};

    // Initialize TTS if not already initialized
    if (!ttsInitialized) {
      await initializeTTS();
    }

    // Speak the letter name first, then example word when done
    const callbacks: SpeechOptions = {
      language,
      pitch,
      rate,
      volume,
      voice, // Voice identifier if provided
      onStart: onStart || undefined,
      onDone: () => {
        // After letter name is done, speak the example word
        if (letter.example) {
          // Small delay between utterances for clarity
          setTimeout(() => {
            Speech.speak(letter.example, {
              language,
              pitch,
              rate,
              volume,
              voice,
              onDone: () => {
                if (onDone) onDone();
              },
              onError: (error: Error) => {
                console.error('Error speaking example word:', error);
                if (onError) {
                  onError(error);
                }
                // Still call onDone even if example fails
                if (onDone) onDone();
              },
              ...otherOptions,
            });
          }, 400); // 400ms pause between letter name and example
        } else {
          if (onDone) onDone();
        }
      },
      onStopped: onStopped || undefined,
      onError: (error: Error) => {
        console.error('Error speaking letter name:', error);
        if (onError) {
          onError(error);
        }
      },
      ...otherOptions,
    };

    // Speak the letter name
    Speech.speak(letter.name, callbacks);
  } catch (error) {
    console.error('Error in speakAlphabetLetter:', error);
    // Don't throw - just log the error
  }
};

/**
 * Speak just the letter name (for quiz components)
 */
export const speakLetterName = async (
  letterName: string,
  options?: TTSOptions
): Promise<void> => {
  await speakRussian(letterName, options);
};

/**
 * Speak a lexeme (Russian word)
 */
export const speakLexeme = async (
  lexeme: Lexeme,
  options?: TTSOptions
): Promise<void> => {
  await speakRussian(lexeme.russian_word, options);
};

/**
 * Speak a Russian word from text
 */
export const speakWord = async (
  word: string,
  options?: TTSOptions
): Promise<void> => {
  await speakRussian(word, options);
};

/**
 * Speak a full sentence in Russian
 */
export const speakSentence = async (
  sentence: string,
  options?: TTSOptions
): Promise<void> => {
  await speakRussian(sentence, options);
};

/**
 * Speak with slower rate (for learning purposes)
 */
export const speakSlowly = async (
  text: string,
  options?: TTSOptions
): Promise<void> => {
  await speakRussian(text, {
    ...options,
    rate: 0.5, // Very slow for learning
  });
};

/**
 * Speak with normal rate
 */
export const speakNormally = async (
  text: string,
  options?: TTSOptions
): Promise<void> => {
  await speakRussian(text, {
    ...options,
    rate: 1.0, // Normal speed
  });
};

/**
 * Initialize TTS (check availability, set up if needed)
 */
export const initializeTTS = async (): Promise<boolean> => {
  if (ttsInitialized) {
    return ttsAvailable;
  }

  try {
    ttsAvailable = await checkRussianTTSAvailable();
    ttsInitialized = true;
    
    if (!ttsAvailable) {
      console.warn('Russian TTS may not be available on this device');
    } else {
      console.log('TTS initialized successfully for Russian language');
    }
    
    return ttsAvailable;
  } catch (error) {
    console.error('Error initializing TTS:', error);
    ttsInitialized = true;
    ttsAvailable = false;
    return false;
  }
};

/**
 * Get TTS initialization status
 */
export const isTTSInitialized = (): boolean => {
  return ttsInitialized;
};

/**
 * Get TTS availability status
 */
export const isTTSAvailable = (): boolean => {
  return ttsAvailable;
};

/**
 * Get available voices (async - works on all platforms)
 */
export const getAvailableVoices = async (): Promise<Voice[]> => {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (error) {
    console.error('Error getting available voices:', error);
    return [];
  }
};

/**
 * Get Russian voices
 */
export const getRussianVoices = async (): Promise<Voice[]> => {
  try {
    const voices = await getAvailableVoices();
    return voices.filter((voice) => 
      voice.language.toLowerCase().startsWith('ru')
    );
  } catch (error) {
    console.error('Error getting Russian voices:', error);
    return [];
  }
};

// Export default language constant for use elsewhere
export const RUSSIAN_LANGUAGE = DEFAULT_LANGUAGE;

