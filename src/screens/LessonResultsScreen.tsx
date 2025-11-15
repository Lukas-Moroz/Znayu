import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootTabParamList } from '../../App';

type LessonResultsScreenRouteProp = RouteProp<RootStackParamList, 'LessonResults'>;
type LessonResultsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'LessonResults'>,
  BottomTabNavigationProp<RootTabParamList>
>;

interface LessonResultsScreenProps {
  route: LessonResultsScreenRouteProp;
  navigation: LessonResultsScreenNavigationProp;
}

const LessonResultsScreen: React.FC<LessonResultsScreenProps> = ({ route, navigation }) => {
  const { score, module, chapter, mode } = route.params;
  
  const percentage = Math.round((score.correct / score.total) * 100);
  const isPerfect = percentage === 100;
  const isGood = percentage >= 80;

  const getMessage = (): string => {
    if (isPerfect) return "Perfect! 🌟";
    if (isGood) return "Great job! 🎉";
    if (percentage >= 60) return "Good effort! 👍";
    return "Keep practicing! 💪";
  };

  const getEncouragement = (): string => {
    if (isPerfect) return "You're mastering Russian!";
    if (isGood) return "You're making excellent progress!";
    if (percentage >= 60) return "You're on the right track!";
    return "Review and try again - you've got this!";
  };

  const handleNavigateToReview = () => {
    // Navigate to Review tab
    const parent = navigation.getParent();
    if (parent) {
      (parent as BottomTabNavigationProp<RootTabParamList>).navigate('Review');
    }
  };

  const handleNavigateToHome = () => {
    // Navigate to Home tab  
    const parent = navigation.getParent();
    if (parent) {
      (parent as BottomTabNavigationProp<RootTabParamList>).navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons 
            name={isPerfect ? "trophy" : isGood ? "ribbon" : "star"} 
            size={80} 
            color={isPerfect ? "#FFD700" : isGood ? "#4A90E2" : "#FF9500"} 
          />
        </View>

        {/* Results Title */}
        <Text style={styles.title}>{getMessage()}</Text>
        <Text style={styles.subtitle}>{getEncouragement()}</Text>

        {/* Score Circle */}
        <View style={styles.scoreCircle}>
          <Text style={styles.scorePercentage}>{percentage}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{score.correct}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.incorrectNumber]}>
              {score.total - score.correct}
            </Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{score.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Module/Chapter Info */}
        {chapter || module ? (
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleText}>
              {chapter 
                ? `Chapter ${chapter.chapter_number}: ${chapter.title_english}`
                : `Module ${module!.module_number}: ${module!.title_english}`
              }
            </Text>
            <Text style={styles.modeText}>
              {mode === 'quick' ? '⚡ Quick Practice' : '📚 Deep Dive'}
            </Text>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {score.total - score.correct > 0 && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={handleNavigateToReview}
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={[styles.reviewButtonText, { marginLeft: 8 }]}>Review Mistakes</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNavigateToHome}
          >
            <Text style={styles.primaryButtonText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={24} color="white" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 8,
    borderColor: '#4A90E2',
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4A90E2',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#28A745',
    marginBottom: 5,
  },
  incorrectNumber: {
    color: '#DC3545',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  moduleInfo: {
    backgroundColor: '#E8F4FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  moduleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 5,
  },
  modeText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
  },
  reviewButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9500',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LessonResultsScreen;

