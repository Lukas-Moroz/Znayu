import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const ReviewScreen = ({ navigation }) => {
  const { userData } = useUser();
  
  const missedCount = userData.missed_question_ids.length;

  const handleStartReview = () => {
    if (missedCount > 0) {
      navigation.navigate('ReviewLesson');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="refresh-circle" size={100} color="#4A90E2" />
        </View>

        <Text style={styles.title}>Review</Text>
        
        {missedCount > 0 ? (
          <>
            <Text style={styles.description}>
              You have {missedCount} question{missedCount !== 1 ? 's' : ''} to review
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{missedCount}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={handleStartReview}
            >
              <Text style={styles.reviewButtonText}>Start Review</Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.description}>
              Great job! You have no missed questions to review.
            </Text>
            
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={80} color="#28A745" />
              <Text style={styles.emptyStateText}>
                Keep learning to add questions here!
              </Text>
            </View>
          </>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
          <Text style={styles.infoText}>
            Questions you get wrong will appear here for focused practice
          </Text>
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
    padding: 20,
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
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  statBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  reviewButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 10,
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
    marginTop: 40,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#4A90E2',
  },
});

export default ReviewScreen;