import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const MultipleChoiceSoundComponent = ({
  prompt,
  options,
  correctAnswer,
  audioToPlay,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [sound, setSound] = useState(null);

  const playAudio = async () => {
    if (!audioToPlay) return;
    
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

  const handleOptionPress = (option) => {
    if (selectedOption !== null) return; // Already answered
    
    setSelectedOption(option);
    const isCorrect = option === correctAnswer;
    
    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };

  const getButtonStyle = (option) => {
    if (selectedOption === null) {
      return styles.optionButton;
    }
    
    if (option === correctAnswer) {
      return [styles.optionButton, styles.correctButton];
    }
    
    if (option === selectedOption && option !== correctAnswer) {
      return [styles.optionButton, styles.incorrectButton];
    }
    
    return [styles.optionButton, styles.disabledButton];
  };

  return (
    <View style={styles.container}>
      {audioToPlay && (
        <TouchableOpacity 
          style={styles.audioButton} 
          onPress={playAudio}
        >
          <Ionicons name="volume-high" size={32} color="#4A90E2" />
          <Text style={styles.audioText}>Play Sound</Text>
        </TouchableOpacity>
      )}
      
      {prompt && (
        <Text style={styles.prompt}>{prompt}</Text>
      )}
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getButtonStyle(option)}
            onPress={() => handleOptionPress(option)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
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
});

export default MultipleChoiceSoundComponent;