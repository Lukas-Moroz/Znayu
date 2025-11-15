// React hook for audio/TTS functionality
import { useState, useEffect, useCallback } from 'react';
import { speakWithOptions, stop, isCurrentlySpeaking, isRussianSupported } from '../services/audioService';

export const useAudio = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  // Check TTS support on mount
  useEffect(() => {
    const checkSupport = async () => {
      const supported = await isRussianSupported();
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  // Monitor speaking state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isSpeaking) {
      interval = setInterval(async () => {
        const speaking = await isCurrentlySpeaking();
        if (!speaking) {
          setIsSpeaking(false);
        }
      }, 500);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSpeaking]);

  const speakText = useCallback(async (
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      volume?: number;
    }
  ) => {
    if (!text || text.trim().length === 0) return;
    
    setIsSpeaking(true);
    try {
      await speakWithOptions(text, {
        ...options,
        onDone: () => {
          setIsSpeaking(false);
        },
        onError: () => {
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      setIsSpeaking(false);
      console.error('Error speaking:', error);
    }
  }, []);

  const stopSpeaking = useCallback(async () => {
    await stop();
    setIsSpeaking(false);
  }, []);

  return {
    speak: speakText,
    stop: stopSpeaking,
    isSpeaking,
    isSupported,
  };
};

