// Audio service wrapper for TTS
// This provides a simple interface for speaking Russian text
import { speakRussian, stopSpeaking, isSpeaking, checkRussianTTSAvailable } from '../utils/ttsPlayer';
import { Platform, Alert } from 'react-native';

/**
 * Speak Russian text using TTS
 * @param text - Russian text to speak
 */
export const speak = async (text: string): Promise<void> => {
  if (!text || text.trim().length === 0) {
    console.warn('AudioService: Empty text provided');
    return;
  }

  try {
    await speakRussian(text);
  } catch (error) {
    console.error('AudioService: Error speaking text:', error);
    throw error;
  }
};

/**
 * Speak text with options
 */
export const speakWithOptions = async (
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onDone?: () => void;
    onError?: (error: Error) => void;
  }
): Promise<void> => {
  if (!text || text.trim().length === 0) {
    console.warn('AudioService: Empty text provided');
    return;
  }

  try {
    await speakRussian(text, {
      rate: options?.rate,
      pitch: options?.pitch,
      volume: options?.volume,
      onDone: options?.onDone,
      onError: options?.onError,
    });
  } catch (error) {
    console.error('AudioService: Error speaking text:', error);
    if (options?.onError) {
      options.onError(error as Error);
    } else {
      throw error;
    }
  }
};

/**
 * Check if Russian TTS is supported on the device
 */
export const isRussianSupported = async (): Promise<boolean> => {
  try {
    return await checkRussianTTSAvailable();
  } catch (error) {
    console.error('AudioService: Error checking TTS support:', error);
    return false;
  }
};

/**
 * Stop current speech
 */
export const stop = async (): Promise<void> => {
  try {
    await stopSpeaking();
  } catch (error) {
    console.error('AudioService: Error stopping speech:', error);
  }
};

/**
 * Check if currently speaking
 */
export const isCurrentlySpeaking = async (): Promise<boolean> => {
  try {
    return await isSpeaking();
  } catch (error) {
    console.error('AudioService: Error checking speaking status:', error);
    return false;
  }
};

/**
 * Show alert if Russian TTS is not available
 */
export const checkAndAlertTTS = async (): Promise<boolean> => {
  const supported = await isRussianSupported();
  
  if (!supported && Platform.OS !== 'web') {
    Alert.alert(
      'Russian Voice Not Available',
      'Please install Russian language pack in your device settings to enable text-to-speech.',
      [{ text: 'OK' }]
    );
  }
  
  return supported;
};

// Export default for convenience
export default {
  speak,
  speakWithOptions,
  stop,
  isSpeaking: isCurrentlySpeaking,
  isRussianSupported,
  checkAndAlertTTS,
};

