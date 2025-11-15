import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import { RootTabParamList, RootStackParamList } from '../../App';
import { CHAPTERS } from '../data/content';
import { MissedQuestion } from '../types/models';

type ReviewScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Review'>,
  StackNavigationProp<RootStackParamList>
>;

interface ReviewScreenProps {
  navigation: ReviewScreenNavigationProp;
}

interface AssignmentGroup {
  key: string;
  chapterId?: number;
  questions: MissedQuestion[];
  displayName: string;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ navigation }) => {
  const { userData, getMissedQuestionsByAssignment } = useUser();
  
  const missedCount = userData.missed_questions.length;

  // Group missed questions by assignment
  const assignmentGroups = useMemo(() => {
    const grouped = getMissedQuestionsByAssignment();
    const groups: AssignmentGroup[] = [];

    Object.entries(grouped).forEach(([key, questions]) => {
      if (questions.length === 0) return;

      const firstQuestion = questions[0];
      const chapterId = firstQuestion.chapterId;

      // Get chapter name only (consolidates all sections)
      let displayName = 'Unknown Chapter';
      if (chapterId) {
        const chapter = CHAPTERS.find(ch => ch.chapter_id === chapterId);
        if (chapter) {
          displayName = `Chapter ${chapter.chapter_number}: ${chapter.title_english}`;
        }
      }

      groups.push({
        key,
        chapterId,
        questions,
        displayName,
      });
    });

    return groups.sort((a, b) => {
      // Sort by chapter ID only
      const chapterA = a.chapterId ?? 0;
      const chapterB = b.chapterId ?? 0;
      return chapterA - chapterB;
    });
  }, [userData.missed_questions, getMissedQuestionsByAssignment]);

  const handleStartReview = (group: AssignmentGroup) => {
    // Navigate to ReviewLessonScreen with the selected missed questions
    // Navigate to the Home stack first, then to ReviewLesson
    navigation.navigate('Home', {
      screen: 'ReviewLesson',
      params: {
        missedQuestions: group.questions,
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="refresh-circle" size={60} color="#4A90E2" />
          </View>
          <Text style={styles.title}>Review</Text>
          <Text style={styles.description}>
            {missedCount > 0 
              ? `You have ${missedCount} question${missedCount !== 1 ? 's' : ''} to review`
              : 'Great job! You have no missed questions to review.'}
          </Text>
        </View>

        {missedCount > 0 ? (
          <View style={styles.groupsContainer}>
            {assignmentGroups.map((group) => (
              <TouchableOpacity
                key={group.key}
                style={styles.groupCard}
                onPress={() => handleStartReview(group)}
              >
                <View style={styles.groupHeader}>
                  <Text style={styles.groupTitle}>{group.displayName}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{group.questions.length}</Text>
                  </View>
                </View>
                <Text style={styles.groupSubtitle}>
                  {group.questions.length} question{group.questions.length !== 1 ? 's' : ''} to review
                </Text>
                <View style={styles.groupFooter}>
                  <Text style={styles.startReviewText}>Start Review</Text>
                  <Ionicons name="arrow-forward" size={20} color="#4A90E2" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={80} color="#28A745" />
            <Text style={styles.emptyStateText}>
              Keep learning to add questions here!
            </Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
          <Text style={styles.infoText}>
            Questions you get wrong will appear here for focused practice. Review them by chapter to master the concepts.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  groupsContainer: {
    marginBottom: 20,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  groupSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  startReviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginRight: 6,
  },
  emptyState: {
    alignItems: 'center',
    marginVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#4A90E2',
  },
});

export default ReviewScreen;

