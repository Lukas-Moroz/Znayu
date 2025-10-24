import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { VOCAB_PACKS } from '../data/content';

const PacksScreen = () => {
  const { userData, toggleVocabPack } = useUser();

  const isPackActive = (packId) => {
    return userData.active_vocab_packs.includes(packId);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vocabulary Packs</Text>
        <Text style={styles.subtitle}>
          Add thematic vocabulary to your lessons
        </Text>
      </View>

      <View style={styles.packsContainer}>
        {VOCAB_PACKS.map((pack) => {
          const isActive = isPackActive(pack.pack_id);
          const isLocked = userData.current_module < pack.prerequisite_module;

          return (
            <View 
              key={pack.pack_id} 
              style={[
                styles.packCard,
                isLocked && styles.packCardLocked
              ]}
            >
              <View style={styles.packIcon}>
                <Ionicons 
                  name={pack.icon || "cube"} 
                  size={32} 
                  color={isLocked ? "#CCC" : "#4A90E2"} 
                />
              </View>

              <View style={styles.packInfo}>
                <Text style={[
                  styles.packName,
                  isLocked && styles.packTextLocked
                ]}>
                  {pack.pack_name}
                </Text>
                
                <Text style={[
                  styles.packDescription,
                  isLocked && styles.packTextLocked
                ]}>
                  {pack.description || `${pack.word_count} words`}
                </Text>

                {isLocked && (
                  <View style={styles.lockBadge}>
                    <Ionicons name="lock-closed" size={14} color="#999" />
                    <Text style={styles.lockText}>
                      Unlock at Module {pack.prerequisite_module}
                    </Text>
                  </View>
                )}
              </View>

              <Switch
                value={isActive}
                onValueChange={() => toggleVocabPack(pack.pack_id)}
                disabled={isLocked}
                trackColor={{ false: '#CCC', true: '#4A90E2' }}
                thumbColor={isActive ? '#fff' : '#f4f3f4'}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
        <Text style={styles.infoText}>
          Active packs will add their vocabulary to your lessons and review sessions
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  packsContainer: {
    padding: 20,
  },
  packCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packCardLocked: {
    opacity: 0.6,
  },
  packIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  packDescription: {
    fontSize: 14,
    color: '#666',
  },
  packTextLocked: {
    color: '#999',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  lockText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#4A90E2',
  },
});

export default PacksScreen;