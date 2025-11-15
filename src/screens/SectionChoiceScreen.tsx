import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Module, Section, Chapter } from '../types/models';
import { RootStackParamList } from '../../App';

type SectionChoiceScreenRouteProp = RouteProp<RootStackParamList, 'SectionChoice'>;
type SectionChoiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SectionChoice'>;

interface SectionChoiceScreenProps {
  route: SectionChoiceScreenRouteProp;
  navigation: SectionChoiceScreenNavigationProp;
}

const SectionChoiceScreen: React.FC<SectionChoiceScreenProps> = ({ route, navigation }) => {
  const { module, chapter } = route.params;
  const entity = chapter || module; // Use chapter if available, otherwise fall back to module
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSectionPress = (section: Section) => {
    // If it's a letter learning section, navigate directly to alphabet learning
    if (section.section_type === 'LETTER_LEARNING') {
      navigation.navigate('AlphabetLearning', {
        section,
        chapter: chapter || undefined,
      });
    } else {
      // For other section types, show mode selection
      setSelectedSection(section);
      setModalVisible(true);
    }
  };

  const handleSelectMode = (mode: 'quick' | 'deep') => {
    setModalVisible(false);
    navigation.navigate('LessonEngine', {
      module: module || undefined,
      chapter: chapter || undefined,
      section: selectedSection,
      mode,
    });
  };

  const getSectionIcon = (sectionType: string): string => {
    switch (sectionType) {
      case 'GRAMMAR':
        return 'book';
      case 'VOCABULARY':
        return 'chatbubbles';
      case 'SPELLING':
        return 'pencil';
      case 'LISTENING':
        return 'headset';
      case 'MIXED_REVIEW':
        return 'shuffle';
      case 'LETTER_LEARNING':
        return 'text';
      default:
        return 'document-text';
    }
  };

  const getSectionColor = (sectionType: string): string => {
    switch (sectionType) {
      case 'GRAMMAR':
        return '#6C63FF';
      case 'VOCABULARY':
        return '#4A90E2';
      case 'SPELLING':
        return '#28A745';
      case 'LISTENING':
        return '#FF6B35';
      case 'MIXED_REVIEW':
        return '#9C27B0';
      case 'LETTER_LEARNING':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            {chapter ? `Chapter ${chapter.chapter_number}` : entity?.title_english || ''}
          </Text>
          {(chapter?.title_russian || (module as any)?.title_russian) && (
            <Text style={styles.headerSubtitle}>
              {chapter?.title_russian || (module as any)?.title_russian}
            </Text>
          )}
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Section List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.instructionText}>Choose a section to practice:</Text>

        {entity?.sections.map((section, index) => {
          const sectionColor = getSectionColor(section.section_type);
          const sectionIcon = getSectionIcon(section.section_type);

          return (
            <TouchableOpacity
              key={section.section_id}
              style={styles.sectionCard}
              onPress={() => handleSectionPress(section)}
            >
              <View style={[styles.sectionIconContainer, { backgroundColor: sectionColor }]}>
                <Ionicons name={sectionIcon as any} size={32} color="white" />
              </View>

              <View style={styles.sectionContent}>
                <Text style={styles.sectionName}>{section.section_name}</Text>
                <Text style={styles.sectionType}>{section.section_type.replace('_', ' ')}</Text>

                <View style={styles.sectionStats}>
                  {section.section_type === 'LETTER_LEARNING' ? (
                    <View style={styles.statItem}>
                      <Ionicons name="text-outline" size={16} color="#666" />
                      <Text style={[styles.statText, { marginLeft: 4 }]}>
                        {section.letters?.length || 0} letters
                      </Text>
                    </View>
                  ) : (
                    <>
                      <View style={styles.statItem}>
                        <Ionicons name="book-outline" size={16} color="#666" />
                        <Text style={[styles.statText, { marginLeft: 4 }]}>
                          {section.associated_lexemes.length} words
                        </Text>
                      </View>
                      {section.associated_grammar.length > 0 && (
                        <View style={styles.statItem}>
                          <Ionicons name="school-outline" size={16} color="#666" />
                          <Text style={[styles.statText, { marginLeft: 4 }]}>
                            {section.associated_grammar.length} rules
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lesson Mode Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Practice Mode</Text>
            <Text style={styles.modalSubtitle}>{selectedSection?.section_name}</Text>

            <TouchableOpacity style={styles.modeButton} onPress={() => handleSelectMode('quick')}>
              <View style={styles.modeIconContainer}>
                <Ionicons name="flash" size={32} color="#4A90E2" />
              </View>
              <View style={styles.modeTextContainer}>
                <Text style={styles.modeTitle}>Quick Practice</Text>
                <Text style={styles.modeDescription}>5-7 exercises • Focus on recognition</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modeButton} onPress={() => handleSelectMode('deep')}>
              <View style={styles.modeIconContainer}>
                <Ionicons name="school" size={32} color="#6C63FF" />
              </View>
              <View style={styles.modeTextContainer}>
                <Text style={styles.modeTitle}>Deep Dive</Text>
                <Text style={styles.modeDescription}>10-12 exercises • Comprehensive practice</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionContent: {
    flex: 1,
  },
  sectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  sectionStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 80, // Increased to account for tab bar (60px) + safe area
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  modeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
});

export default SectionChoiceScreen;

