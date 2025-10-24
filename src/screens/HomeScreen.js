import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { MODULES } from '../data/content';
import LessonChoiceModal from '../components/LessonChoiceModal';

const HomeScreen = ({ navigation }) => {
  const { userData } = useUser();
  const [selectedModule, setSelectedModule] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModulePress = (module) => {
    if (module.module_number <= userData.current_module) {
      setSelectedModule(module);
      setModalVisible(true);
    }
  };

  const handleSelectMode = (mode) => {
    setModalVisible(false);
    navigation.navigate('LessonEngine', { 
      module: selectedModule, 
      mode 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={28} color="#FF6B35" />
          <Text style={styles.streakText}>{userData.streak_count} day streak</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.pathContainer}
      >
        <Text style={styles.title}>Your Learning Path</Text>
        
        {MODULES.map((module, index) => {
          const isUnlocked = module.module_number <= userData.current_module;
          const isCompleted = module.module_number < userData.current_module;
          
          return (
            <View key={module.module_id} style={styles.moduleWrapper}>
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
                onPress={() => handleModulePress(module)}
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
                    Module {module.module_number}
                  </Text>
                  <Text style={[
                    styles.moduleTitle,
                    isUnlocked && styles.moduleTextUnlocked
                  ]}>
                    {module.title_english}
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    width: 4,
    height: 40,
    backgroundColor: '#CCC',
    marginBottom: 10,
  },
  connectorUnlocked: {
    backgroundColor: '#4A90E2',
  },
  moduleNode: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#CCC',
    position: 'relative',
  },
  moduleNodeUnlocked: {
    backgroundColor: '#4A90E2',
    borderColor: '#2E5C8A',
  },
  moduleNodeCompleted: {
    backgroundColor: '#28A745',
    borderColor: '#1E7A35',
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
                