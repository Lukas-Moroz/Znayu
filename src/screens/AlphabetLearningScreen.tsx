import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { ALPHABET_DATA } from '../data/content';
import AlphabetQuizComponent from '../components/AlphabetQuizComponent';
import { playAlphabetLetter } from '../utils/audioPlayer';
import { stopSpeaking } from '../utils/ttsPlayer';
import { Section, Chapter } from '../types/models';
import { RootStackParamList } from '../../App';

type ViewMode = 'learn' | 'quiz';

type AlphabetLearningScreenRouteProp = RouteProp<RootStackParamList, 'AlphabetLearning'>;

interface AlphabetLearningScreenProps {
  route: AlphabetLearningScreenRouteProp;
  navigation: any;
}

// Helper function to shuffle array deterministically (seeded by letter)
const shuffleArray = <T,>(array: T[], seed: string): T[] => {
  const shuffled = [...array];
  // Create a simple hash from seed for deterministic shuffling
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use hash as seed for pseudo-random but consistent shuffling
  let random = (hash % 1000) / 1000;
  for (let i = shuffled.length - 1; i > 0; i--) {
    random = (random * 9301 + 49297) % 233280;
    const j = Math.floor((random / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const AlphabetLearningScreen: React.FC<AlphabetLearningScreenProps> = ({ route, navigation }) => {
  const { section, chapter } = route.params || {};
  
  // Filter alphabet data based on section letters if provided
  const filteredAlphabetData = useMemo(() => {
    if (section && section.section_type === 'LETTER_LEARNING' && section.letters) {
      // Filter ALPHABET_DATA to only include letters in the section
      return ALPHABET_DATA.filter((letterData) =>
        section.letters?.some((sectionLetter) => {
          // Match by the letter string (e.g., "М м" matches "М м")
          return letterData.letter === sectionLetter || 
                 letterData.letter.split(' ')[0] === sectionLetter.split(' ')[0];
        })
      );
    }
    // If no section provided, show all alphabet data (legacy Module 0 behavior)
    return ALPHABET_DATA;
  }, [section]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentLetter = filteredAlphabetData[currentIndex];
  const progress = ((currentIndex + 1) / filteredAlphabetData.length) * 100;
  
  // Reset to first letter if current index is out of bounds
  React.useEffect(() => {
    if (currentIndex >= filteredAlphabetData.length) {
      setCurrentIndex(0);
    }
  }, [filteredAlphabetData.length, currentIndex]);

  // Generate quiz options for current letter - memoized to prevent reshuffling
  const quizOptions = useMemo(() => {
    if (!currentLetter) return [];
    
    const correct = currentLetter.sound;
    // Use filtered alphabet data for options to keep them relevant to the section
    const otherSounds = filteredAlphabetData
      .filter((l) => l.sound !== correct)
      .map((l) => l.sound);
    
    // If we don't have enough options in filtered data, use all alphabet data
    const allOtherSounds = otherSounds.length >= 3 
      ? otherSounds 
      : ALPHABET_DATA.filter((l) => l.sound !== correct).map((l) => l.sound);
    
    // Deterministically shuffle based on letter to get consistent order
    const shuffledOthers = shuffleArray(allOtherSounds, currentLetter.letter);
    const selectedOthers = shuffledOthers.slice(0, 3);
    
    // Combine and shuffle again deterministically
    return shuffleArray([correct, ...selectedOthers], currentLetter.letter + currentLetter.sound);
  }, [currentLetter?.letter, currentLetter?.sound, filteredAlphabetData]);

  const handlePlaySound = async () => {
    try {
      if (!currentLetter) return;
      
      // Use TTS to speak the letter name and example word
      await playAlphabetLetter(currentLetter, true);
    } catch (error) {
      console.error('Error playing sound with TTS:', error);
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    setFeedback({
      isCorrect,
      message: isCorrect
        ? 'Perfect! You got it!'
        : `Not quite. The letter ${currentLetter.letter.split(' ')[0]} makes the sound "${currentLetter.sound}"`,
    });

    if (isCorrect) {
      setQuizCompleted(true);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setQuizCompleted(false);
    setViewMode('learn');

    if (currentIndex < filteredAlphabetData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Section complete!
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setFeedback(null);
      setQuizCompleted(false);
      setViewMode('learn');
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStartQuiz = () => {
    setViewMode('quiz');
  };

  // Cleanup TTS on unmount
  React.useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Feedback Banner */}
      {feedback && (
        <View style={[styles.feedbackBanner, feedback.isCorrect ? styles.correctBanner : styles.incorrectBanner]}>
          <View style={styles.feedbackContent}>
            <Ionicons name={feedback.isCorrect ? 'checkmark-circle' : 'close-circle'} size={28} color="white" />
            <Text style={styles.feedbackText}>{feedback.message}</Text>
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < filteredAlphabetData.length - 1 ? 'Next' : 'Complete'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {section ? section.section_name : 'Cyrillic Alphabet'}
        </Text>

        <View style={styles.headerRight}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {filteredAlphabetData.length}
          </Text>
          <View style={{ width: 15 }} />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {!currentLetter ? (
          <View style={styles.card}>
            <Text style={styles.loadingText}>Loading letters...</Text>
          </View>
        ) : viewMode === 'learn' ? (
          <>
            {/* Learn Mode Card */}
            <View style={styles.card}>
              {/* Large Letter Display */}
              <View style={styles.letterDisplay}>
                <Text style={styles.letterLarge}>{currentLetter.letter.split(' ')[0]}</Text>
                <Text style={styles.letterSmall}>{currentLetter.letter.split(' ')[1]}</Text>
              </View>

              {/* Letter Name */}
              <View style={styles.letterInfo}>
                <Text style={styles.letterName}>{currentLetter.name}</Text>
                <Text style={styles.letterSound}>{currentLetter.sound}</Text>
              </View>

              {/* Audio Button */}
              <TouchableOpacity style={styles.audioButton} onPress={handlePlaySound}>
                <Ionicons name="volume-high" size={24} color="#4A90E2" />
                <Text style={styles.audioButtonText}>Hear the sound</Text>
              </TouchableOpacity>

              {/* Example Word */}
              <View style={styles.exampleSection}>
                <Text style={styles.exampleLabel}>Example word:</Text>
                <Text style={styles.exampleWord}>{currentLetter.example}</Text>
              </View>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline, currentIndex === 0 && styles.buttonDisabled]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}
              >
                <Text style={[styles.buttonText, styles.buttonTextOutline]}>Previous</Text>
              </TouchableOpacity>
              <View style={{ width: 12 }} />
              <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleStartQuiz}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Quiz Mode */}
            {currentLetter && (
              <AlphabetQuizComponent
                letter={currentLetter.letter.split(' ')[0]}
                correctSound={currentLetter.sound}
                options={quizOptions}
                onAnswer={handleQuizAnswer}
                letterData={currentLetter}
              />
            )}

            {/* Navigation Buttons in Quiz Mode */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline, currentIndex === 0 && styles.buttonDisabled]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}
              >
                <Text style={[styles.buttonText, styles.buttonTextOutline]}>Previous</Text>
              </TouchableOpacity>
              <View style={{ width: 12 }} />
              {quizCompleted && !feedback ? (
                <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleNext}>
                  <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                    {currentIndex === filteredAlphabetData.length - 1 ? 'Complete Section' : 'Next Letter'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.button, styles.buttonOutline]} 
                  onPress={() => setViewMode('learn')}
                >
                  <Text style={[styles.buttonText, styles.buttonTextOutline]}>Back to Learning</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  letterDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  letterLarge: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  letterSmall: {
    fontSize: 48,
    color: '#666',
    marginTop: 8,
  },
  letterInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  letterName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  letterSound: {
    fontSize: 14,
    color: '#666',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    marginBottom: 24,
  },
  audioButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 8,
    fontWeight: '500',
  },
  exampleSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  exampleLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  exampleWord: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#4A90E2',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: 'white',
  },
  buttonTextOutline: {
    color: '#4A90E2',
  },
  backToLearnButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backToLearnText: {
    fontSize: 16,
    color: '#4A90E2',
  },
  feedbackBanner: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  correctBanner: {
    backgroundColor: '#28A745',
  },
  incorrectBanner: {
    backgroundColor: '#DC3545',
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  feedbackText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default AlphabetLearningScreen;

