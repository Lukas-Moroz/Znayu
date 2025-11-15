import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import PacksScreen from './src/screens/PacksScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LessonEngineScreen from './src/screens/LessonEngineScreen';
import LessonResultsScreen from './src/screens/LessonResultsScreen';
import AlphabetLearningScreen from './src/screens/AlphabetLearningScreen';
import SectionChoiceScreen from './src/screens/SectionChoiceScreen';
import ReviewLessonScreen from './src/screens/ReviewLessonScreen';

// Import Context
import { UserProvider } from './src/context/UserContext';
import { SettingsProvider } from './src/context/SettingsContext';

// Import Types
import { Module, Section, Chapter, MissedQuestion } from './src/types/models';

// Import TTS
import { initializeTTS } from './src/utils/ttsPlayer';
import { initializeAudio } from './src/utils/audioPlayer';

// Define navigation param lists
export type RootStackParamList = {
  HomeMain: undefined;
  AlphabetLearning: { section?: Section; chapter?: Chapter } | undefined;
  SectionChoice: { module?: Module; chapter?: Chapter };
  LessonEngine: { module?: Module; chapter?: Chapter; section?: Section | null; mode: 'quick' | 'deep' };
  LessonResults: { score: { correct: number; total: number }; module?: Module; chapter?: Chapter; mode: 'quick' | 'deep' };
  ReviewLesson: { missedQuestions: MissedQuestion[] };
};

export type RootTabParamList = {
  Home: undefined;
  Packs: undefined;
  Review: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AlphabetLearning" 
        component={AlphabetLearningScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SectionChoice" 
        component={SectionChoiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LessonEngine" 
        component={LessonEngineScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LessonResults" 
        component={LessonResultsScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }}
      />
      <Stack.Screen 
        name="ReviewLesson" 
        component={ReviewLessonScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  // Initialize TTS and Audio on app start
  useEffect(() => {
    const init = async () => {
      try {
        await initializeAudio();
        await initializeTTS();
      } catch (error) {
        console.error('Error initializing audio/TTS:', error);
      }
    };
    init();
  }, []);

  return (
    <SettingsProvider>
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Packs') {
                iconName = focused ? 'cube' : 'cube-outline';
              } else if (route.name === 'Review') {
                iconName = focused ? 'refresh-circle' : 'refresh-circle-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: 'gray',
            headerShown: true,
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeStack}
            options={{ 
              title: 'Your Path',
              headerShown: false 
            }}
          />
          <Tab.Screen 
            name="Packs" 
            component={PacksScreen}
            options={{ title: 'Vocab Packs' }}
          />
          <Tab.Screen 
            name="Review" 
            component={ReviewScreen}
            options={{ title: 'Review' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </UserProvider>
    </SettingsProvider>
  );
}

