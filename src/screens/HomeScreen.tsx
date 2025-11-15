import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import { CHAPTERS } from '../data/content';
import LessonChoiceModal from '../components/LessonChoiceModal';
import { Chapter } from '../types/models';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeMain'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { userData, adminMode, toggleAdminMode } = useUser();
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleChapterPress = (chapter: Chapter) => {
    // In admin mode, all chapters are accessible
    // Otherwise, only unlocked chapters (current_chapter or below) are accessible
    if (adminMode || chapter.chapter_number <= userData.current_chapter) {
      if (chapter.sections && chapter.sections.length > 0) {
        // Navigate to section choice if chapter has sections
        navigation.navigate('SectionChoice', { chapter });
      } else {
        // Fallback to old lesson choice modal (shouldn't happen with chapters)
        setSelectedModule(chapter);
        setModalVisible(true);
      }
    }
  };

  const handleSelectMode = (mode: 'quick' | 'deep') => {
    setModalVisible(false);
    if (selectedModule) {
      navigation.navigate('LessonEngine', { 
        chapter: selectedModule, 
        mode 
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={28} color="#FF6B35" />
          <Text style={styles.streakText}>{userData.streak_count} day streak</Text>
        </View>
        <View style={styles.adminContainer}>
          <Text style={styles.adminLabel}>Admin</Text>
          <Switch
            value={adminMode}
            onValueChange={toggleAdminMode}
            trackColor={{ false: '#CCC', true: '#4A90E2' }}
            thumbColor={adminMode ? '#fff' : '#f4f3f4'}
          />
          {adminMode && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#28A745" />
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.pathContainer}
      >
        <Text style={styles.title}>Your Learning Path</Text>
        
        {CHAPTERS.map((chapter, index) => {
          const isUnlocked = adminMode || chapter.chapter_number <= userData.current_chapter;
          const isCompleted = !adminMode && chapter.chapter_number < userData.current_chapter;
          
          return (
            <View key={chapter.chapter_id} style={styles.moduleWrapper}>
              {index > 0 && (
                <View style={[
                  styles.connector,
                  isUnlocked && styles.connectorUnlocked
                ]} />
              )}
              
              <TouchableOpacity
                style={[
                  styles.moduleNode,
                  isUnlocked && styles.moduleNodeUnlocked,
                  isCompleted && styles.moduleNodeCompleted
                ]}
                onPress={() => handleChapterPress(chapter)}
                disabled={!isUnlocked}
              >
                {isCompleted && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={30} 
                    color="#28A745"
                    style={styles.checkmark}
                  />
                )}
                
                <View style={styles.moduleContent}>
                  <Text style={[
                    styles.moduleNumber,
                    isUnlocked && styles.moduleTextUnlocked
                  ]}>
                    Chapter {chapter.chapter_number}
                  </Text>
                  <Text style={[
                    styles.moduleTitle,
                    isUnlocked && styles.moduleTextUnlocked
                  ]}>
                    {chapter.title_english}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <LessonChoiceModal
        visible={modalVisible}
        module={selectedModule}
        onClose={() => setModalVisible(false)}
        onSelectMode={handleSelectMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
  },
  streakText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#F57C00',
  },
  adminContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    position: 'relative',
  },
  adminLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  adminBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },
  scrollView: {
    flex: 1,
  },
  pathContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  moduleWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  connector: {
    width: 5,
    height: 40,
    backgroundColor: '#D0D5DD',
    marginBottom: 10,
    borderRadius: 3,
  },
  connectorUnlocked: {
    backgroundColor: '#4A90E2',
  },
  moduleNode: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8EAF0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#D0D5DD',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleNodeUnlocked: {
    backgroundColor: '#4A90E2',
    borderColor: '#3B7AC7',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
  },
  moduleNodeCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  moduleContent: {
    alignItems: 'center',
  },
  moduleNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 5,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#999',
    textAlign: 'center',
  },
  moduleTextUnlocked: {
    color: 'white',
  },
});

export default HomeScreen;

