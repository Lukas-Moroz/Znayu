import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const FillInTheBlankComponent = ({
  sentencePart1,
  sentencePart2,
  correctAnswer,
  onAnswer,
}) => {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (userInput.trim() === '') return;
    
    setSubmitted(true);
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    
    if (onAnswer) {
      onAnswer(isCorrect);
    }
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
        <Text style={styles.sentenceText}>{sentencePart2}</Text>
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