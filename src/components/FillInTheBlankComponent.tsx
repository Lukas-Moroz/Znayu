import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface FillInTheBlankComponentProps {
  sentencePart1: string;
  sentencePart2: string;
  correctAnswer: string;
  onAnswer: (isCorrect: boolean) => void;
}

const FillInTheBlankComponent: React.FC<FillInTheBlankComponentProps> = ({
  sentencePart1,
  sentencePart2,
  correctAnswer,
  onAnswer,
}) => {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
    setUserInput('');
    setSubmitted(false);
  }, [sentencePart1, correctAnswer]);

  // Extract English translation from sentencePart2 if it's in parentheses
  const extractTranslation = (text: string): { russianPart: string; englishTranslation: string | null } => {
    // Check if text starts with '(' and contains English (no Cyrillic)
    const parenMatch = text.match(/^\((.*?)\)$/);
    if (parenMatch) {
      const content = parenMatch[1];
      // Check if content is English (no Cyrillic characters)
      const hasCyrillic = /[А-Яа-яЁё]/.test(content);
      if (!hasCyrillic) {
        return { russianPart: '', englishTranslation: content };
      }
    }
    // Check if text has Russian and English mixed (e.g., "text (translation)")
    const mixedMatch = text.match(/^(.+?)\s*\((.*?)\)$/);
    if (mixedMatch) {
      const russianPart = mixedMatch[1].trim();
      const englishPart = mixedMatch[2].trim();
      const hasCyrillicInRussian = /[А-Яа-яЁё]/.test(russianPart);
      const hasCyrillicInEnglish = /[А-Яа-яЁё]/.test(englishPart);
      if (hasCyrillicInRussian && !hasCyrillicInEnglish) {
        return { russianPart, englishTranslation: englishPart };
      }
    }
    // If no parentheses or mixed content, treat as Russian
    return { russianPart: text, englishTranslation: null };
  };

  const { russianPart: part2Russian, englishTranslation } = extractTranslation(sentencePart2);

  const handleSubmit = () => {
    if (userInput.trim() === '') return;
    
    setSubmitted(true);
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    
    // Delay answer callback to allow visual feedback to show first
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 300);
  };

  const getInputStyle = () => {
    if (!submitted) {
      return styles.input;
    }
    
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    return [
      styles.input,
      isCorrect ? styles.inputCorrect : styles.inputIncorrect
    ];
  };

  return (
    <View style={styles.container}>
      {/* English translation hint (shown above if available) */}
      {englishTranslation && (
        <View style={styles.translationHint}>
          <Text style={styles.translationText}>{englishTranslation}</Text>
        </View>
      )}
      
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentenceText}>{sentencePart1}</Text>
        <TextInput
          style={getInputStyle()}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="___"
          editable={!submitted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {part2Russian && (
          <Text style={styles.sentenceText}>{part2Russian}</Text>
        )}
      </View>
      
      {submitted && userInput.trim().toLowerCase() !== correctAnswer.trim().toLowerCase() && (
        <View style={styles.correctAnswerContainer}>
          <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
          <Text style={styles.correctAnswerText}>{correctAnswer}</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={[
          styles.submitButton,
          (submitted || userInput.trim() === '') && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={submitted || userInput.trim() === ''}
      >
        <Text style={styles.submitButtonText}>
          {submitted ? 'Submitted' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  sentenceText: {
    fontSize: 20,
    color: '#333',
    marginHorizontal: 5,
  },
  translationHint: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  translationText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
    minWidth: 120,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  inputCorrect: {
    borderColor: '#28A745',
    backgroundColor: '#D4EDDA',
  },
  inputIncorrect: {
    borderColor: '#DC3545',
    backgroundColor: '#F8D7DA',
  },
  correctAnswerContainer: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  correctAnswerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  correctAnswerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
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

export default FillInTheBlankComponent;

