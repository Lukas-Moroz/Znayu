import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import MultipleChoiceSoundComponent from '../components/MultipleChoiceSoundComponent';
import MatchingComponent from '../components/MatchingComponent';
import FillInTheBlankComponent from '../components/FillInTheBlankComponent';
import ListenTypeComponent from '../components/ListenTypeComponent';
import { generateReviewExercise } from '../utils/reviewGenerator';
import { Exercise, MissedQuestion } from '../types/models';
import { RootStackParamList } from '../../App';
import { getAllLexemes, GRAMMAR_RULES } from '../data/content';

type ReviewLessonScreenRouteProp = RouteProp<RootStackParamList, 'ReviewLesson'>;
type ReviewLessonScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReviewLesson'>;

interface ReviewLessonScreenProps {
  route: ReviewLessonScreenRouteProp;
  navigation: ReviewLessonScreenNavigationProp;
}

const ReviewLessonScreen: React.FC<ReviewLessonScreenProps> = ({ route, navigation }) => {
  const { missedQuestions } = route.params;
  const { removeMissedQuestion } = useUser();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [reviewedMissedQuestionIds, setReviewedMissedQuestionIds] = useState<Set<number>>(new Set());

  // Get all lexemes and grammar rules for review generation
  const allLexemes = getAllLexemes();
  const allGrammarRules = GRAMMAR_RULES;

  useEffect(() => {
    // Generate review exercises from missed questions
    const reviewExercises = missedQuestions.map(mq => 
      generateReviewExercise(mq.originalExercise, mq, allLexemes, allGrammarRules)
    );
    setExercises(reviewExercises);
    // Reset state when exercises change
    setCurrentIndex(0);
    setShowFeedback(false);
    setCorrectCount(0);
    setReviewedMissedQuestionIds(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missedQuestions.length]);

  // Safety effect: reset index if it becomes invalid
  useEffect(() => {
    if (exercises.length > 0 && (currentIndex < 0 || currentIndex >= exercises.length)) {
      setCurrentIndex(0);
      setShowFeedback(false);
    }
  }, [exercises.length, currentIndex]);

  const handleAnswer = (correct: boolean, exerciseId?: number) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Find the corresponding missed question by matching the current index
    // The exercises array is generated in the same order as missedQuestions
    const missedQuestion = missedQuestions[currentIndex];

    if (correct && missedQuestion) {
      // Remove from missed questions
      removeMissedQuestion(missedQuestion.exerciseId);
      setCorrectCount(prev => prev + 1);
      setReviewedMissedQuestionIds(prev => new Set([...prev, missedQuestion.exerciseId]));
      setFeedbackMessage('Correct! Great job! 🎉');
    } else {
      setFeedbackMessage('Not quite. Keep practicing!');
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    
    if (currentIndex < exercises.length - 1) {
      // Use functional update to ensure we're using the latest state
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        // Safety check: ensure nextIndex is valid
        if (nextIndex < exercises.length) {
          return nextIndex;
        }
        return prev;
      });
    } else {
      // Review complete
      handleReviewComplete();
    }
  };

  const handleReviewComplete = () => {
    // Navigate back to ReviewScreen
    navigation.goBack();
  };

  const renderExercise = () => {
    if (exercises.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading review exercises...</Text>
        </View>
      );
    }

    // Safety check: ensure currentIndex is valid
    if (currentIndex < 0 || currentIndex >= exercises.length) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Exercise index out of bounds. Resetting...</Text>
        </View>
      );
    }

    const exercise = exercises[currentIndex];

    switch (exercise.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <MultipleChoiceSoundComponent
            key={`review-mc-${exercise.id}-${currentIndex}`}
            prompt={exercise.prompt || ''}
            options={exercise.options || []}
            correctAnswer={exercise.correctAnswer}
            audioToPlay={exercise.audioToPlay}
            russianText={exercise.prompt ? (exercise.prompt.match(/[""]([А-Яа-яЁё\s]+)[""]/)?.[1] || '') : undefined}
            onAnswer={(correct) => handleAnswer(correct, exercise.id)}
          />
        );
      
      case 'MATCHING':
        return (
          <MatchingComponent
            key={`review-match-${exercise.id}-${currentIndex}`}
            leftColumnItems={exercise.leftColumnItems || []}
            rightColumnItems={exercise.rightColumnItems || []}
            correctPairs={exercise.correctPairs || {}}
            onComplete={(correct) => handleAnswer(correct, exercise.id)}
          />
        );
      
      case 'FILL_IN_BLANK':
        return (
          <FillInTheBlankComponent
            key={`review-fill-${exercise.id}-${currentIndex}`}
            sentencePart1={exercise.sentencePart1 || ''}
            sentencePart2={exercise.sentencePart2 || ''}
            correctAnswer={exercise.correctAnswer}
            onAnswer={(correct) => handleAnswer(correct, exercise.id)}
          />
        );
      
      case 'LISTEN_TYPE':
        return (
          <ListenTypeComponent
            key={`review-listen-${exercise.id}-${currentIndex}`}
            audioToPlay={exercise.audioToPlay}
            correctAnswer={exercise.correctAnswer}
            onAnswer={(correct) => handleAnswer(correct, exercise.id)}
          />
        );
      
      default:
        return <Text>Unknown exercise type: {exercise.type}</Text>;
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
          <Text style={styles.scoreText}>{correctCount}/{missedQuestions.length}</Text>
        </View>
      </View>

      {/* Review Progress Info */}
      <View style={styles.reviewInfoContainer}>
        <Text style={styles.reviewInfoText}>
          {correctCount} of {missedQuestions.length} reviewed correctly
        </Text>
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
              {currentIndex < exercises.length - 1 ? 'Next' : 'Finish Review'}
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
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E8EAF0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  reviewInfoContainer: {
    backgroundColor: '#FFF4E6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  reviewInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    textAlign: 'center',
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
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  correctBanner: {
    backgroundColor: '#10B981',
  },
  incorrectBanner: {
    backgroundColor: '#EF4444',
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

export default ReviewLessonScreen;

