import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const ListenTypeComponent = ({
  audioToPlay,
  correctAnswer,
  onAnswer,
}) => {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sound, setSound] = useState(null);

  const playAudio = async () => {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: audioToPlay }
      );
      setSound(audioSound);
      await audioSound.playAsync();
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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
      <Text style={styles.instruction}>Listen and type what you hear</Text>
      
      <TouchableOpacity 
        style={styles.audioButton} 
        onPress={playAudio}
      >
        <Ionicons name="volume-high" size={48} color="#4A90E2" />
        <Text style={styles.audioText}>Play Audio</Text>
      </TouchableOpacity>
      
      <TextInput
        style={getInputStyle()}
        value={userInput}
        onChangeText={setUserInput}
        placeholder="Type here..."
        editable={!submitted}
        autoCapitalize="none"
        autoCorrect={false}
        multiline={false}
      />
      
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
    alignItems: 'center',
  },
  instruction: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  audioButton: {
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    paddingVertical: 30,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginBottom: 40,
  },
  audioText: {
    marginTop: 10,
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
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
    width: '100%',
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
    width: '100%',
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

export default ListenTypeComponent;