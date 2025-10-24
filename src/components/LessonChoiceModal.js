import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LessonChoiceModal = ({ visible, module, onClose, onSelectMode }) => {
  if (!module) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>

          <Text style={styles.moduleTitle}>Module {module.module_number}</Text>
          <Text style={styles.moduleName}>{module.title_english}</Text>

          <View style={styles.divider} />

          <Text style={styles.choiceTitle}>Choose Your Practice Mode</Text>

          {/* Quick Practice Option */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => onSelectMode('quick')}
          >
            <View style={styles.modeIconContainer}>
              <Ionicons name="flash" size={40} color="#FF9500" />
            </View>
            <View style={styles.modeContent}>
              <Text style={styles.modeName}>Quick Practice</Text>
              <Text style={styles.modeDescription}>
                5-7 exercises • On-the-go review • Matching & Fill-in-blank
              </Text>
              <View style={styles.modeBadge}>
                <Ionicons name="time-outline" size={16} color="#FF9500" />
                <Text style={styles.badgeText}>~5 minutes</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#CCC" />
          </TouchableOpacity>

          {/* Deep Dive Option */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => onSelectMode('deep')}
          >
            <View style={[styles.modeIconContainer, styles.deepDiveIcon]}>
              <Ionicons name="school" size={40} color="#4A90E2" />
            </View>
            <View style={styles.modeContent}>
              <Text style={styles.modeName}>Deep Dive</Text>
              <Text style={styles.modeDescription}>
                10-12 exercises • Grammar explanations • All exercise types
              </Text>
              <View style={[styles.modeBadge, styles.deepDiveBadge]}>
                <Ionicons name="book-outline" size={16} color="#4A90E2" />
                <Text style={[styles.badgeText, styles.deepDiveText]}>
                  ~10 minutes
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              Both modes count toward your daily streak
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 5,
  },
  moduleName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modeCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  modeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  deepDiveIcon: {
    backgroundColor: '#E8F4FF',
  },
  modeContent: {
    flex: 1,
  },
  modeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  modeDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  deepDiveBadge: {
    backgroundColor: '#E8F4FF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9500',
    marginLeft: 5,
  },
  deepDiveText: {
    color: '#4A90E2',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#666',
  },
});

export default LessonChoiceModal;