import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import MultipleChoiceSoundComponent from '../components/MultipleChoiceSoundComponent';
import MatchingComponent from '../components/MatchingComponent';
import FillInTheBlankComponent from '../components/FillInTheBlankComponent';
import ListenTypeComponent from '../components/ListenTypeComponent';
import { generateExercises } from '../utils/exerciseGenerator';

const LessonEngineScreen = ({ route, navigation }) => {
  const { module, mode } = route.params; // mode: 'quick' or 'deep'
  const { userData, addMissedQuestion, updateCurrentModule, incrementStreak } = useUser();
  
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    // Generate exercises based on mode
    const generatedExercises = generateExercises(
      module,
      mode,
      userData.active_vocab_packs
    );
    setExercises(generatedExercises);
  }, [module, mode]);

  const handleAnswer = (correct, exerciseId, conceptId) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Update score
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    // Add to missed questions if wrong
    if (!correct && exerciseId) {
      addMissedQuestion(exerciseId);
    }

    // Set feedback message
    if (correct) {
      setFeedbackMessage('Correct! Great job! 🎉');
    } else {
      setFeedbackMessage('Not quite. Keep practicing!');
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Lesson complete
      handleLessonComplete();
    }
  };

  const handleLessonComplete = () => {
    // Update module progress if this was the current module
    if (module.module_number === userData.current_module) {
      updateCurrentModule(module.module_number + 1);
    }
    
    // Increment streak
    incrementStreak();
    
    // Navigate to results screen
    navigation.replace('LessonResults', {
      score,
      module,
      mode
    });
  };

  const renderExercise = () => {
    if (exercises.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading exercises...</Text>
        </View>
      );
    }

    const exercise = exercises[currentIndex];

    switch (exercise.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <MultipleChoiceSoundComponent
            prompt={exercise.prompt}
            options={exercise.options}
            correctAnswer={exercise.correctAnswer}
            audioToPlay={exercise.audio}
            onAnswer={(correct) => handleAnswer(correct, exercise.id, exercise.conceptId)}
          />
        );
      
      case 'MATCHING':
        return (
          <MatchingComponent
            leftColumnItems={exercise.leftColumn}
            rightColumnItems={exercise.rightColumn}
            correctPairs={exercise.correctPairs}
            onComplete={(correct) => handleAnswer(correct, exercise.id, exercise.conceptId)}
          />
        );
      
      case 'FILL_IN_BLANK':
        return (
          <FillInTheBlankComponent
            sentencePart1={exercise.part1}
            sentencePart2={exercise.part2}
            correctAnswer={exercise.correctAnswer}
            onAnswer={(correct) => handleAnswer(correct, exercise.id, exercise.conceptId)}
          />
        );
      
      case 'LISTEN_TYPE':
        return (
          <ListenTypeComponent
            audioToPlay={exercise.audio}
            correctAnswer={exercise.correctAnswer}
            onAnswer={(correct) => handleAnswer(correct, exercise.id, exercise.conceptId)}
          />
        );
      
      default:
        return <Text>Unknown exercise type</Text>;
    }
  };

  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {exercises.length}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score.correct}/{score.total}</Text>
        </View>
      </View>

      {/* Exercise Area */}
      <ScrollView style={styles.exerciseContainer}>
        {renderExercise()}
      </ScrollView>

      {/* Feedback Banner */}
      {showFeedback && (
        <View style={[
          styles.feedbackBanner,
          isCorrect ? styles.correctBanner : styles.incorrectBanner
        ]}>
          <View style={styles.feedbackContent}>
            <Ionicons 
              name={isCorrect ? "checkmark-circle" : "close-circle"} 
              size={28} 
              color="white" 
            />
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex < exercises.length - 1 ? 'Next' : 'Finish'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  exerciseContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  feedbackBanner: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default LessonEngineScreen;