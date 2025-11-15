import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import MultipleChoiceSoundComponent from '../components/MultipleChoiceSoundComponent';
import MatchingComponent from '../components/MatchingComponent';
import FillInTheBlankComponent from '../components/FillInTheBlankComponent';
import ListenTypeComponent from '../components/ListenTypeComponent';
import { generateExercises } from '../utils/exerciseGenerator';
import { Exercise, Module, Section, Chapter, MissedQuestion } from '../types/models';
import { RootStackParamList } from '../../App';

type LessonEngineScreenRouteProp = RouteProp<RootStackParamList, 'LessonEngine'>;
type LessonEngineScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LessonEngine'>;

interface LessonEngineScreenProps {
  route: LessonEngineScreenRouteProp;
  navigation: LessonEngineScreenNavigationProp;
}

const LessonEngineScreen: React.FC<LessonEngineScreenProps> = ({ route, navigation }) => {
  const { module, chapter, section, mode } = route.params;
  const { userData, addMissedQuestion, updateCurrentModule, updateCurrentChapter, incrementStreak } = useUser();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [exerciseStartTime, setExerciseStartTime] = useState<number>(Date.now());
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Generate exercises based on mode, section, and chapter/module
    const loadExercises = async () => {
      setIsLoading(true);
      setLoadingError(null);
      setExercises([]);
      
      try {
        // Add timeout for exercise generation (15 seconds)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Exercise generation timed out')), 15000);
        });
        
        const generationPromise = generateExercises(
          module?.module_number || null,
          section || null,
          mode,
          userData.active_vocab_packs,
          chapter || null,
          chapter?.chapter_number || null
        );
        
        const generatedExercises = await Promise.race([generationPromise, timeoutPromise]);
        
        if (!generatedExercises || generatedExercises.length === 0) {
          setLoadingError('No exercises available for this section. Please try a different section or chapter.');
          setExercises([]);
        } else {
          setExercises(generatedExercises);
          setCurrentIndex(0);
          setShowFeedback(false);
          setScore({ correct: 0, total: 0 });
          setExerciseStartTime(Date.now());
        }
      } catch (error) {
        console.error('Error generating exercises:', error);
        setLoadingError(
          error instanceof Error && error.message.includes('timed out')
            ? 'Exercise generation is taking longer than expected. Please try again.'
            : 'Failed to generate exercises. Please try again.'
        );
        setExercises([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module?.module_number, chapter?.chapter_number, section?.section_id, mode]);

  // Safety effect: reset index if it becomes invalid
  useEffect(() => {
    if (exercises.length > 0 && (currentIndex < 0 || currentIndex >= exercises.length)) {
      setCurrentIndex(0);
      setShowFeedback(false);
    }
  }, [exercises.length, currentIndex]);

  // Reset exercise start time when exercise changes
  useEffect(() => {
    if (exercises.length > 0 && currentIndex >= 0 && currentIndex < exercises.length) {
      setExerciseStartTime(Date.now());
      // Fade in animation for new exercise
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex, exercises.length]);

  const getExerciseTypeName = (type: string): string => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'Multiple Choice';
      case 'MATCHING': return 'Matching';
      case 'FILL_IN_BLANK': return 'Fill in the Blank';
      case 'LISTEN_TYPE': return 'Listen & Type';
      default: return 'Exercise';
    }
  };

  const getContextualFeedback = (correct: boolean, exerciseType: string): string => {
    if (correct) {
      const messages = [
        'Perfect! 🎉',
        'Excellent work! 🌟',
        'You got it! 👍',
        'Well done! ✨',
        'Correct! Keep it up! 💪'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else {
      const messages = [
        'Not quite, but you\'re learning! 💪',
        'Close! Review and try again. 📚',
        'Keep practicing - you\'ve got this! 🌱',
        'Not this time, but every mistake is progress! 📖',
        'Good effort! Review the answer and continue. 🎯'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  };

  const handleAnswer = (correct: boolean, exerciseId?: number, conceptId?: string) => {
    // Haptic feedback (optional, gracefully fails if not available)
    try {
      // Try to import and use haptics if available
      const Haptics = require('expo-haptics');
      if (correct) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      // Haptics not available, continue without it
    }

    setIsCorrect(correct);
    
    // Update score
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    // Add to missed questions if wrong
    if (!correct && exerciseId) {
      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        // Determine concept type based on exercise
        let conceptType: 'vocab' | 'grammar' | 'spelling' | 'listening' | undefined;
        if (exercise.type === 'LISTEN_TYPE' || exercise.type === 'SOUND_RECOGNITION') {
          conceptType = 'listening';
        } else if (exercise.type === 'FILL_IN_BLANK' && exercise.grammar_rule_ids && exercise.grammar_rule_ids.length > 0) {
          conceptType = 'grammar';
        } else if (exercise.lexeme_ids && exercise.lexeme_ids.length > 0) {
          conceptType = 'vocab';
        } else if (exercise.grammar_rule_ids && exercise.grammar_rule_ids.length > 0) {
          conceptType = 'grammar';
        }

        const missedQuestion: MissedQuestion = {
          exerciseId: exercise.id,
          chapterId: chapter?.chapter_id,
          sectionId: section?.section_id,
          conceptType,
          grammarRuleId: exercise.grammar_rule_ids?.[0],
          lexemeIds: exercise.lexeme_ids,
          originalExercise: { ...exercise }, // Store a copy of the original exercise
          timestamp: new Date().toISOString(),
        };

        addMissedQuestion(missedQuestion);
      }
    }

    // Set contextual feedback message
    const exercise = exercises.find(ex => ex.id === exerciseId);
    const exerciseType = exercise?.type || 'UNKNOWN';
    setFeedbackMessage(getContextualFeedback(correct, exerciseType));

    // Delay feedback appearance for better UX (500ms)
    setTimeout(() => {
      setShowFeedback(true);
      // Animate feedback banner
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 500);
  };

  const handleNext = () => {
    // Animate feedback out
    Animated.timing(feedbackOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowFeedback(false);
      
      if (currentIndex < exercises.length - 1) {
        setIsTransitioning(true);
        // Fade out current exercise
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Use functional update to ensure we're using the latest state
          setCurrentIndex(prev => {
            const nextIndex = prev + 1;
            // Safety check: ensure nextIndex is valid
            if (nextIndex < exercises.length) {
              return nextIndex;
            }
            return prev;
          });
          setIsTransitioning(false);
        });
      } else {
        // Lesson complete
        handleLessonComplete();
      }
    });
  };

  const handleExit = () => {
    if (score.total > 0) {
      Alert.alert(
        'Exit Lesson?',
        `You've completed ${score.total} exercise${score.total === 1 ? '' : 's'}. Your progress will be saved.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => {
              // Save progress and navigate back
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleLessonComplete = () => {
    // Update progress - prioritize chapter over module
    if (chapter && chapter.chapter_number === userData.current_chapter) {
      updateCurrentChapter(chapter.chapter_number + 1);
    } else if (module && module.module_number === userData.current_module) {
      updateCurrentModule(module.module_number + 1);
    }
    
    // Increment streak
    incrementStreak();
    
    // Navigate to results screen
    navigation.replace('LessonResults', {
      score,
      module: module || undefined,
      chapter: chapter || undefined,
      mode
    });
  };

  const getEstimatedTimeRemaining = (): string => {
    if (exercises.length === 0 || currentIndex >= exercises.length) return '';
    
    const avgTimePerExercise = 30; // seconds (rough estimate)
    const remainingExercises = exercises.length - currentIndex - 1;
    const estimatedSeconds = remainingExercises * avgTimePerExercise;
    
    if (estimatedSeconds < 60) {
      return `~${estimatedSeconds}s remaining`;
    } else {
      const minutes = Math.ceil(estimatedSeconds / 60);
      return `~${minutes} min remaining`;
    }
  };

  const renderLoadingState = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Generating exercises...</Text>
        <Text style={styles.loadingSubtext}>
          {mode === 'quick' ? 'Creating 5-7 exercises' : 'Creating 10-12 exercises'}
        </Text>
        {section && (
          <Text style={styles.loadingSubtext}>
            Section: {section.section_name}
          </Text>
        )}
      </View>
    );
  };

  const renderErrorState = () => {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorTitle}>Unable to Load Exercises</Text>
        <Text style={styles.errorText}>{loadingError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            // Trigger reload by updating a dependency
            setLoadingError(null);
            setIsLoading(true);
            // Force re-render by updating a state that triggers the useEffect
            const loadExercises = async () => {
              try {
                const generatedExercises = await generateExercises(
                  module?.module_number || null,
                  section || null,
                  mode,
                  userData.active_vocab_packs,
                  chapter || null,
                  chapter?.chapter_number || null
                );
                if (!generatedExercises || generatedExercises.length === 0) {
                  setLoadingError('No exercises available for this section.');
                } else {
                  setExercises(generatedExercises);
                  setCurrentIndex(0);
                  setShowFeedback(false);
                  setScore({ correct: 0, total: 0 });
                  setExerciseStartTime(Date.now());
                }
              } catch (error) {
                setLoadingError('Failed to generate exercises. Please try again.');
              } finally {
                setIsLoading(false);
              }
            };
            loadExercises();
          }}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderExercise = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (loadingError) {
      return renderErrorState();
    }

    if (exercises.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="document-text-outline" size={64} color="#666" />
          <Text style={styles.errorTitle}>No Exercises Available</Text>
          <Text style={styles.errorText}>
            This section doesn't have any exercises yet. Please try a different section.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
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
            key={`mc-${exercise.id}-${currentIndex}`}
            prompt={exercise.prompt || ''}
            options={exercise.options || []}
            correctAnswer={exercise.correctAnswer}
            audioToPlay={exercise.audioToPlay}
            russianText={exercise.prompt ? (exercise.prompt.match(/[""]([А-Яа-яЁё\s]+)[""]/)?.[1] || '') : undefined}
            onAnswer={(correct) => handleAnswer(correct, exercise.id, exercise.concept_id)}
          />
        );
      
      case 'MATCHING':
        return (
          <MatchingComponent
            key={`match-${exercise.id}-${currentIndex}`}
            leftColumnItems={exercise.leftColumnItems || []}
            rightColumnItems={exercise.rightColumnItems || []}
            correctPairs={exercise.correctPairs || {}}
            onComplete={(correct) => handleAnswer(correct, exercise.id, exercise.concept_id)}
          />
        );
      
      case 'FILL_IN_BLANK':
        return (
          <FillInTheBlankComponent
            key={`fill-${exercise.id}-${currentIndex}`}
            sentencePart1={exercise.sentencePart1 || ''}
            sentencePart2={exercise.sentencePart2 || ''}
            correctAnswer={exercise.correctAnswer}
            onAnswer={(correct) => handleAnswer(correct, exercise.id, exercise.concept_id)}
          />
        );
      
      case 'LISTEN_TYPE':
        return (
          <ListenTypeComponent
            key={`listen-${exercise.id}-${currentIndex}`}
            audioToPlay={exercise.audioToPlay}
            correctAnswer={exercise.correctAnswer}
            onAnswer={(correct) => handleAnswer(correct, exercise.id, exercise.concept_id)}
          />
        );
      
      default:
        return <Text>Unknown exercise type: {exercise.type}</Text>;
    }
  };

  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;
  const currentExercise = exercises.length > 0 && currentIndex >= 0 && currentIndex < exercises.length
    ? exercises[currentIndex]
    : null;
  const exerciseTypeName = currentExercise ? getExerciseTypeName(currentExercise.type) : '';

  return (
    <View style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {exercises.length > 0 ? `${currentIndex + 1} / ${exercises.length}` : '0 / 0'}
            </Text>
            {exerciseTypeName && (
              <Text style={styles.exerciseTypeText}>{exerciseTypeName}</Text>
            )}
          </View>
          {exercises.length > 0 && (
            <Text style={styles.timeRemainingText}>
              {getEstimatedTimeRemaining()}
            </Text>
          )}
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score.correct}/{score.total}</Text>
        </View>
      </View>

      {/* Exercise Area */}
      <ScrollView style={styles.exerciseContainer}>
        {isTransitioning ? (
          <View style={styles.transitionContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.transitionText}>Loading next exercise...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            {renderExercise()}
          </Animated.View>
        )}
      </ScrollView>

      {/* Feedback Banner */}
      {showFeedback && (
        <Animated.View
          style={[
            styles.feedbackBanner,
            isCorrect ? styles.correctBanner : styles.incorrectBanner,
            { opacity: feedbackOpacity }
          ]}
        >
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
        </Animated.View>
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
    color: '#333',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  transitionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  transitionText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  progressInfo: {
    alignItems: 'center',
    marginTop: 5,
  },
  exerciseTypeText: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  timeRemainingText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
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

export default LessonEngineScreen;

