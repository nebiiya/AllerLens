/**
 * AppNavigator.tsx
 * ----------------
 * Defines the entire navigation structure for AllerLens using
 * React Navigation's Stack Navigator.
 *
 * Screen order / flow:
 *
 *   Onboarding (Flow 1):
 *     Splash → CreateProfile → EnterName
 *
 *   Main App (Flow 2):
 *     Home ↔ Camera → Processing → SafeResult | WarningResult
 *     Home ↔ Profile
 *
 * All screens share the same stack so we can use navigation.replace()
 * to clear onboarding screens from history once the user reaches Home.
 *
 * The header is hidden globally (headerShown: false) because each
 * screen manages its own header / top-bar UI.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen imports
import SplashScreen         from '../screens/SplashScreen';
import CreateProfileScreen  from '../screens/CreateProfileScreen';
import EnterNameScreen      from '../screens/EnterNameScreen';
import HomeScreen           from '../screens/HomeScreen';
import CameraScreen         from '../screens/CameraScreen';
import ProcessingScreen     from '../screens/ProcessingScreen';
import ProfileScreen        from '../screens/ProfileScreen';
import SafeResultScreen     from '../screens/SafeResultScreen';
import WarningResultScreen  from '../screens/WarningResultScreen';

// Type definitions for the param list
import { RootStackParamList } from '../types';

// ── Stack Navigator ───────────────────────────────────────────────────────────

/**
 * createNativeStackNavigator is typed with our RootStackParamList so that
 * TypeScript enforces correct params when calling navigation.navigate().
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

// ── Component ─────────────────────────────────────────────────────────────────

const AppNavigator: React.FC = () => {
  return (
    /**
     * NavigationContainer is the root wrapper required by React Navigation.
     * It holds the navigation state and links the navigator to the app.
     */
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,       // All screens use custom headers
          animation: 'slide_from_right',  // Standard horizontal slide transition
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {/* ── Onboarding Flow ─────────────────────────────────────────── */}

        {/** Splash / Intro — auto-advances to CreateProfile */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/** Step 1: Select allergens */}
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />

        {/** Step 2: Enter display name */}
        <Stack.Screen name="EnterName" component={EnterNameScreen} />

        {/* ── Main App Flow ────────────────────────────────────────────── */}

        {/** Hub screen with two scan entry-points */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/** Camera / gallery picker */}
        <Stack.Screen name="Camera" component={CameraScreen} />

        {/** Analysis loading screen */}
        <Stack.Screen
          name="Processing"
          component={ProcessingScreen}
          options={{ gestureEnabled: false }}  // Prevent swipe-back during processing
        />

        {/** Read-only allergen profile view */}
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* ── Result Screens ───────────────────────────────────────────── */}

        {/** Green "safe" verdict */}
        <Stack.Screen
          name="SafeResult"
          component={SafeResultScreen}
          options={{ gestureEnabled: false }}  // Prevent going back to processing
        />

        {/** Red "warning" verdict with detected allergen list */}
        <Stack.Screen
          name="WarningResult"
          component={WarningResultScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
