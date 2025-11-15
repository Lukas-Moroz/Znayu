// Audio playback utilities using expo-av and expo-speech (TTS)
import { Audio } from 'expo-av';
import {
  speakRussian,
  speakAlphabetLetter,
  speakLexeme as speakLexemeTTS,
  speakWord,
  speakSentence,
  stopSpeaking,
  isSpeaking as isTTSSpeaking,
  RUSSIAN_LANGUAGE,
  type TTSOptions,
} from './ttsPlayer';
import type { AlphabetLetter, Lexeme } from '../types/models';

// Audio state management
let currentSound: Audio.Sound | null = null;

/**
 * Initialize audio mode for playback
 */
export const initializeAudio = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

/**
 * Play audio from a file path
 * @param audioPath - Path to audio file (e.g., '/audio/alpha/a.mp3')
 * @param onPlaybackStatusUpdate - Optional callback for playback status updates
 */
export const playAudio = async (
  audioPath: string,
  onPlaybackStatusUpdate?: (status: any) => void
): Promise<Audio.Sound | null> => {
  try {
    // Stop and unload any currently playing sound
    if (currentSound) {
      await stopAudio();
    }

    // Create and load the new sound
    // Note: In production, you'll need to map audioPath to actual require() statements
    // or use a dynamic approach with asset loading
    
    // Example for dynamic loading (requires proper asset mapping):
    // const { sound } = await Audio.Sound.createAsync(
    //   { uri: audioPath },
    //   { shouldPlay: true }
    // );

    // For now, we'll log the path (actual implementation requires asset bundling)
    console.log('Playing audio:', audioPath);

    // TODO: Implement actual audio loading once assets are in place
    // currentSound = sound;
    
    // if (onPlaybackStatusUpdate) {
    //   sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    // }

    return null; // Return sound when implemented
  } catch (error) {
    console.error('Error playing audio:', error);
    return null;
  }
};

/**
 * Play alphabet letter audio using TTS (preferred) or audio file (fallback)
 * @param letter - AlphabetLetter object
 */
export const playAlphabetLetter = async (
  letter: AlphabetLetter,
  useTTS: boolean = true
): Promise<void> => {
  if (useTTS) {
    // Use TTS to speak the letter name and example
    await speakAlphabetLetter(letter);
  } else {
    // Fallback to audio file if available
    const audioPath = letter.audio;
    if (audioPath) {
      await playAudio(audioPath);
    } else {
      // If no audio file, use TTS as fallback
      await speakAlphabetLetter(letter);
    }
  }
};

/**
 * Play lexeme pronunciation using TTS (preferred) or audio file (fallback)
 * @param lexeme - Lexeme object
 */
export const playLexeme = async (
  lexeme: Lexeme,
  useTTS: boolean = true
): Promise<void> => {
  if (useTTS || !lexeme.audio_file_path) {
    // Use TTS to speak the Russian word
    await speakLexemeTTS(lexeme);
  } else {
    // Fallback to audio file if available
    await playAudio(lexeme.audio_file_path);
  }
};

/**
 * Play text as speech using TTS
 * @param text - Russian text to speak
 * @param language - Language code (default: 'ru-RU')
 * @param options - TTS options
 */
export const playTextAsSpeech = async (
  text: string,
  language: string = RUSSIAN_LANGUAGE,
  options?: TTSOptions
): Promise<void> => {
  await speakRussian(text, { ...options, language });
};

/**
 * Pause currently playing audio
 */
export const pauseAudio = async (): Promise<void> => {
  try {
    if (currentSound) {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await currentSound.pauseAsync();
      }
    }
  } catch (error) {
    console.error('Error pausing audio:', error);
  }
};

/**
 * Resume paused audio
 */
export const resumeAudio = async (): Promise<void> => {
  try {
    if (currentSound) {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await currentSound.playAsync();
      }
    }
  } catch (error) {
    console.error('Error resuming audio:', error);
  }
};

/**
 * Stop and unload currently playing audio
 */
export const stopAudio = async (): Promise<void> => {
  try {
    if (currentSound) {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
      currentSound = null;
    }
  } catch (error) {
    console.error('Error stopping audio:', error);
  }
};

/**
 * Replay current audio from the beginning
 */
export const replayAudio = async (): Promise<void> => {
  try {
    if (currentSound) {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded) {
        await currentSound.replayAsync();
      }
    }
  } catch (error) {
    console.error('Error replaying audio:', error);
  }
};

/**
 * Get current playback status
 */
export const getAudioStatus = async (): Promise<any> => {
  try {
    if (currentSound) {
      return await currentSound.getStatusAsync();
    }
    return null;
  } catch (error) {
    console.error('Error getting audio status:', error);
    return null;
  }
};

/**
 * Set audio volume (0.0 to 1.0)
 * @param volume - Volume level between 0 and 1
 */
export const setAudioVolume = async (volume: number): Promise<void> => {
  try {
    if (currentSound) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      await currentSound.setVolumeAsync(clampedVolume);
    }
  } catch (error) {
    console.error('Error setting volume:', error);
  }
};

/**
 * Cleanup audio resources (call on component unmount)
 */
export const cleanupAudio = async (): Promise<void> => {
  await stopAudio();
  await stopSpeaking();
};

// Export the current sound for direct access if needed
export const getCurrentSound = (): Audio.Sound | null => currentSound;

/**
 * Check if any audio (file or TTS) is currently playing
 */
export const isAnyAudioPlaying = async (): Promise<boolean> => {
  const ttsSpeaking = await isTTSSpeaking();
  const audioPlaying = currentSound !== null;
  return ttsSpeaking || audioPlaying;
};

/**
 * Stop all audio (both file playback and TTS)
 */
export const stopAllAudio = async (): Promise<void> => {
  await stopAudio();
  await stopSpeaking();
};

