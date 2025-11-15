import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings, AccentColor, ThemeMode } from '../context/SettingsContext';

const ProfileScreen: React.FC = () => {
  const {
    settings,
    updateThemeMode,
    updateAccentColor,
    updateDyslexiaSettings,
    updateReviewSettings,
    resetSettings,
  } = useSettings();

  const accentColors: { color: AccentColor; name: string; hex: string }[] = [
    { color: 'blue', name: 'Blue', hex: '#4A90E2' },
    { color: 'green', name: 'Green', hex: '#28A745' },
    { color: 'purple', name: 'Purple', hex: '#6C63FF' },
    { color: 'orange', name: 'Orange', hex: '#FF9500' },
    { color: 'red', name: 'Red', hex: '#DC3545' },
  ];

  const fontSizeOptions = [
    { label: 'Small', value: 0.9 },
    { label: 'Normal', value: 1.0 },
    { label: 'Large', value: 1.2 },
    { label: 'Extra Large', value: 1.4 },
  ];

  const spacingOptions = [
    { label: 'None', value: 0 },
    { label: 'Small', value: 1 },
    { label: 'Medium', value: 2 },
    { label: 'Large', value: 4 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="person-circle" size={60} color="#4A90E2" />
        </View>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your learning experience</Text>
      </View>

      {/* Theme Settings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="color-palette" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Theme & Colors</Text>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Theme Mode</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.themeMode === 'light' && styles.themeButtonActive,
              ]}
              onPress={() => updateThemeMode('light')}
            >
              <Ionicons
                name="sunny"
                size={20}
                color={settings.themeMode === 'light' ? '#4A90E2' : '#666'}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  settings.themeMode === 'light' && styles.themeButtonTextActive,
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.themeMode === 'dark' && styles.themeButtonActive,
              ]}
              onPress={() => updateThemeMode('dark')}
            >
              <Ionicons
                name="moon"
                size={20}
                color={settings.themeMode === 'dark' ? '#4A90E2' : '#666'}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  settings.themeMode === 'dark' && styles.themeButtonTextActive,
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Accent Color</Text>
          <View style={styles.colorGrid}>
            {accentColors.map(({ color, name, hex }) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  settings.accentColor === color && styles.colorOptionActive,
                ]}
                onPress={() => updateAccentColor(color)}
              >
                <View style={[styles.colorCircle, { backgroundColor: hex }]}>
                  {settings.accentColor === color && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </View>
                <Text style={styles.colorLabel}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Dyslexia Settings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="accessibility" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Accessibility</Text>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Font Size</Text>
          <View style={styles.optionsRow}>
            {fontSizeOptions.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.optionButton,
                  settings.dyslexia.fontSize === value && styles.optionButtonActive,
                ]}
                onPress={() => updateDyslexiaSettings({ fontSize: value })}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    settings.dyslexia.fontSize === value && styles.optionButtonTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingLabel}>OpenDyslexic Font</Text>
              <Text style={styles.settingDescription}>
                Use a font designed to help with dyslexia
              </Text>
            </View>
            <Switch
              value={settings.dyslexia.fontFamily === 'openDyslexic'}
              onValueChange={(value) =>
                updateDyslexiaSettings({ fontFamily: value ? 'openDyslexic' : 'system' })
              }
              trackColor={{ false: '#CCC', true: '#4A90E2' }}
              thumbColor={settings.dyslexia.fontFamily === 'openDyslexic' ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Letter Spacing</Text>
          <View style={styles.optionsRow}>
            {spacingOptions.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.optionButton,
                  settings.dyslexia.letterSpacing === value && styles.optionButtonActive,
                ]}
                onPress={() => updateDyslexiaSettings({ letterSpacing: value })}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    settings.dyslexia.letterSpacing === value && styles.optionButtonTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Word Spacing</Text>
          <View style={styles.optionsRow}>
            {spacingOptions.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.optionButton,
                  settings.dyslexia.wordSpacing === value && styles.optionButtonActive,
                ]}
                onPress={() => updateDyslexiaSettings({ wordSpacing: value })}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    settings.dyslexia.wordSpacing === value && styles.optionButtonTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Review Customization */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="refresh-circle" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Review Customization</Text>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingDescription}>
            Choose how you want to organize your review sessions
          </Text>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingLabel}>Group by Sections</Text>
              <Text style={styles.settingDescription}>
                Review questions organized by section
              </Text>
            </View>
            <Switch
              value={settings.review.groupBySections}
              onValueChange={(value) => updateReviewSettings({ groupBySections: value })}
              trackColor={{ false: '#CCC', true: '#4A90E2' }}
              thumbColor={settings.review.groupBySections ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingLabel}>Group by Question Type</Text>
              <Text style={styles.settingDescription}>
                Review questions organized by exercise type
              </Text>
            </View>
            <Switch
              value={settings.review.groupByQuestionType}
              onValueChange={(value) => updateReviewSettings({ groupByQuestionType: value })}
              trackColor={{ false: '#CCC', true: '#4A90E2' }}
              thumbColor={settings.review.groupByQuestionType ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingLabel}>Overall Practice</Text>
              <Text style={styles.settingDescription}>
                Review all questions together (default)
              </Text>
            </View>
            <Switch
              value={settings.review.groupByOverall}
              onValueChange={(value) => updateReviewSettings({ groupByOverall: value })}
              trackColor={{ false: '#CCC', true: '#4A90E2' }}
              thumbColor={settings.review.groupByOverall ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Reset Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
          <Ionicons name="refresh" size={20} color="#DC3545" />
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIconContainer: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingRowContent: {
    flex: 1,
    marginRight: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  themeButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  themeButtonTextActive: {
    color: '#4A90E2',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorOption: {
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 12,
  },
  colorOptionActive: {
    // Visual indicator handled by checkmark
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorLabel: {
    fontSize: 12,
    color: '#666',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: '#4A90E2',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  optionButtonTextActive: {
    color: 'white',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DC3545',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC3545',
    marginLeft: 8,
  },
});

export default ProfileScreen;

