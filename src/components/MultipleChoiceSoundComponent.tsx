import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { speakRussian, stopSpeaking } from '../utils/ttsPlayer';

interface MultipleChoiceSoundComponentProps {
  prompt?: string;
  options: string[];
  correctAnswer: string;
  audioToPlay?: string;
  russianText?: string; // Russian text to speak if audio file not available
  onAnswer: (isCorrect: boolean) => void;
}

const MultipleChoiceSoundComponent: React.FC<MultipleChoiceSoundComponentProps> = ({
  prompt,
  options,
  correctAnswer,
  audioToPlay,
  russianText,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Reset state when exercise changes (prompt or correctAnswer changes)
  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setIsPlayingAudio(false);
  }, [prompt, correctAnswer]);

  const playAudio = async () => {
    try {
      setIsPlayingAudio(true);
      // Stop any ongoing TTS
      await stopSpeaking();
      
      // Try to play audio file if available
      if (audioToPlay) {
        try {
          if (sound) {
            await sound.unloadAsync();
          }
          const { sound: audioSound } = await Audio.Sound.createAsync(
            { uri: audioToPlay }
          );
          setSound(audioSound);
          await audioSound.playAsync();
          // Wait for playback to finish (rough estimate)
          setTimeout(() => setIsPlayingAudio(false), 2000);
          return; // Successfully played audio file
        } catch (audioError) {
          console.log('Error playing audio file, falling back to TTS:', audioError);
          // Fall through to TTS fallback
        }
      }
      
      // Fallback to TTS if audio file not available or failed
      if (russianText) {
        // Use explicitly provided Russian text
        await speakRussian(russianText);
      } else if (prompt) {
        // Extract Russian text from prompt if it contains Russian characters
        // For example: 'What does "дом" mean?' -> 'дом'
        const russianMatch = prompt.match(/[""]([А-Яа-яЁё\s]+)[""]/);
        if (russianMatch && russianMatch[1]) {
          await speakRussian(russianMatch[1].trim());
        } else if (/[А-Яа-яЁё]/.test(prompt)) {
          // If prompt contains Russian characters but no quotes, speak the Russian part
          const russianParts = prompt.match(/[А-Яа-яЁё]+/g);
          if (russianParts && russianParts.length > 0) {
            await speakRussian(russianParts[0]);
          }
        }
      }
      // TTS usually finishes quickly
      setTimeout(() => setIsPlayingAudio(false), 1500);
    } catch (error) {
      console.error('Error playing audio/TTS:', error);
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup
      if (sound) {
        sound.unloadAsync();
      }
      stopSpeaking();
    };
  }, [sound]);

  const handleOptionPress = (option: string) => {
    if (hasAnswered) return; // Already answered, prevent any changes
    
    // Toggle selection: if clicking the same option, deselect it
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (hasAnswered || !selectedOption) return;
    
    setHasAnswered(true);
    const isCorrect = selectedOption === correctAnswer;
    
    // Call onAnswer after a brief delay to show selection and allow processing
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 300);
  };

  const getButtonStyle = (option: string) => {
    if (!hasAnswered) {
      return selectedOption === option 
        ? [styles.optionButton, styles.selectedButton]
        : styles.optionButton;
    }
    
    // After answering, show correct/incorrect states
    if (option === correctAnswer) {
      return [styles.optionButton, styles.correctButton];
    }
    
    if (option === selectedOption && option !== correctAnswer) {
      return [styles.optionButton, styles.incorrectButton];
    }
    
    return [styles.optionButton, styles.disabledButton];
  };

  // Show audio button if we have audio file OR Russian text to speak
  const hasAudio = audioToPlay || russianText || (prompt && /[А-Яа-яЁё]/.test(prompt)) || correctAnswer;

  return (
    <View style={styles.container}>
      {hasAudio && (
        <TouchableOpacity 
          style={[styles.audioButton, isPlayingAudio && styles.audioButtonLoading]} 
          onPress={playAudio}
          disabled={isPlayingAudio}
        >
          {isPlayingAudio ? (
            <>
              <ActivityIndicator size="small" color="#4A90E2" />
              <Text style={styles.audioText}>Playing...</Text>
            </>
          ) : (
            <>
              <Ionicons name="volume-high" size={32} color="#4A90E2" />
              <Text style={styles.audioText}>Play Sound</Text>
            </>
          )}
        </TouchableOpacity>
      )}
      
      {prompt && (
        <Text style={styles.prompt}>{prompt}</Text>
      )}
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <View key={option} style={styles.optionWrapper}>
            <TouchableOpacity
              style={getButtonStyle(option)}
              onPress={() => handleOptionPress(option)}
              disabled={hasAnswered}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!selectedOption || hasAnswered) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!selectedOption || hasAnswered}
      >
        <Text style={styles.submitButtonText}>
          {hasAnswered ? 'Submitted' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 30,
  },
  audioButtonLoading: {
    opacity: 0.7,
  },
  audioText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '600',
  },
  prompt: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  optionsContainer: {
    width: '100%',
  },
  optionWrapper: {
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedButton: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  correctButton: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  incorrectButton: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  disabledButton: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MultipleChoiceSoundComponent;

