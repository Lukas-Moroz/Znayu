import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'red';
export type ReviewGrouping = 'sections' | 'questionType' | 'overall';

export interface DyslexiaSettings {
  fontSize: number; // Multiplier (1.0 = normal, 1.2 = 20% larger, etc.)
  fontFamily: 'system' | 'openDyslexic';
  letterSpacing: number; // Additional spacing in points
  wordSpacing: number; // Additional spacing in points
}

export interface ReviewSettings {
  groupBySections: boolean;
  groupByQuestionType: boolean;
  groupByOverall: boolean;
}

export interface AppSettings {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  dyslexia: DyslexiaSettings;
  review: ReviewSettings;
}

interface SettingsContextType {
  settings: AppSettings;
  updateThemeMode: (mode: ThemeMode) => void;
  updateAccentColor: (color: AccentColor) => void;
  updateDyslexiaSettings: (settings: Partial<DyslexiaSettings>) => void;
  updateReviewSettings: (settings: Partial<ReviewSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  themeMode: 'light',
  accentColor: 'blue',
  dyslexia: {
    fontSize: 1.0,
    fontFamily: 'system',
    letterSpacing: 0,
    wordSpacing: 0,
  },
  review: {
    groupBySections: false,
    groupByQuestionType: false,
    groupByOverall: true, // Default to overall practice
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const updateThemeMode = (mode: ThemeMode) => {
    setSettings(prev => ({ ...prev, themeMode: mode }));
  };

  const updateAccentColor = (color: AccentColor) => {
    setSettings(prev => ({ ...prev, accentColor: color }));
  };

  const updateDyslexiaSettings = (newSettings: Partial<DyslexiaSettings>) => {
    setSettings(prev => ({
      ...prev,
      dyslexia: { ...prev.dyslexia, ...newSettings },
    }));
  };

  const updateReviewSettings = (newSettings: Partial<ReviewSettings>) => {
    setSettings(prev => ({
      ...prev,
      review: { ...prev.review, ...newSettings },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateThemeMode,
        updateAccentColor,
        updateDyslexiaSettings,
        updateReviewSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

