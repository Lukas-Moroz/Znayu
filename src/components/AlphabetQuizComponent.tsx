import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speakLetterName } from '../utils/ttsPlayer';
import { stopSpeaking } from '../utils/ttsPlayer';
import type { AlphabetLetter } from '../types/models';

interface AlphabetQuizComponentProps {
  letter: string;
  correctSound: string;
  options: string[];
  onAnswer: (isCorrect: boolean) => void;
  letterData?: AlphabetLetter;
}

const AlphabetQuizComponent: React.FC<AlphabetQuizComponentProps> = ({
  letter,
  correctSound,
  options,
  onAnswer,
  letterData,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Reset state when letter changes
    setSelectedAnswer(null);
    setIsSubmitted(false);
    // Stop any ongoing speech when letter changes
    stopSpeaking();
  }, [letter]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handlePlaySound = async () => {
    try {
      // Use TTS to speak the letter name
      if (letterData) {
        await speakLetterName(letterData.name);
      } else {
        // Fallback: try to extract letter name from letter string
        // For example, "М" -> "эм"
        await speakLetterName(letter);
      }
    } catch (error) {
      console.error('Error playing sound with TTS:', error);
    }
  };

  const handleSelectAnswer = async (answer: string) => {
    if (isSubmitted) return;

    setSelectedAnswer(answer);
    
    // Play the letter name sound when clicking an answer
    try {
      if (letterData) {
        await speakLetterName(letterData.name);
      } else {
        await speakLetterName(letter);
      }
    } catch (error) {
      console.error('Error playing sound with TTS:', error);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedAnswer === correctSound;
    onAnswer(isCorrect);
  };

  return (
    <View style={styles.container}>
      {/* Letter Display */}
      <View style={styles.letterSection}>
        <Text style={styles.letterDisplay}>{letter}</Text>
        <TouchableOpacity style={styles.soundButton} onPress={handlePlaySound}>
          <Ionicons name="volume-high" size={24} color="#4A90E2" />
          <Text style={styles.soundButtonText}>Hear the sound</Text>
        </TouchableOpacity>
      </View>

      {/* Question */}
      <View style={styles.questionSection}>
        <Text style={styles.questionText}>What sound does this letter make?</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === correctSound;
          const showResult = isSubmitted && isSelected;

          return (
            <View key={option} style={styles.optionWrapper}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isSelected && !isSubmitted && styles.optionSelected,
                  showResult && isCorrect && styles.optionCorrect,
                  showResult && !isCorrect && styles.optionIncorrect,
                ]}
                onPress={() => handleSelectAnswer(option)}
                disabled={isSubmitted}
              >
                <Text
                  style={[
                    styles.optionText,
                    showResult && isCorrect && styles.optionTextCorrect,
                    showResult && !isCorrect && styles.optionTextIncorrect,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Submit Button */}
      {selectedAnswer && !isSubmitted && (
        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  letterSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  letterDisplay: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 16,
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
  },
  soundButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 8,
    fontWeight: '500',
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  optionWrapper: {
    width: '48%',
    padding: 6,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionCorrect: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  optionIncorrect: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  optionTextCorrect: {
    color: '#155724',
    fontWeight: '600',
  },
  optionTextIncorrect: {
    color: '#721C24',
    fontWeight: '600',
  },
  optionSelected: {
    borderColor: '#4A90E2',
    borderWidth: 2,
    backgroundColor: '#F0F7FF',
  },
  submitContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AlphabetQuizComponent;

