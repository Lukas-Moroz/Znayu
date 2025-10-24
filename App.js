import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import PacksScreen from './src/screens/PacksScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import LessonEngineScreen from './src/screens/LessonEngineScreen';
import LessonResultsScreen from './src/screens/LessonResultsScreen';

// Import Context
import { UserProvider } from './src/context/UserContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Packs') {
                iconName = focused ? 'cube' : 'cube-outline';
              } else if (route.name === 'Review') {
                iconName = focused ? 'refresh-circle' : 'refresh-circle-outline';
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
        </Tab.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}