/**
 * EnterNameScreen.tsx
 * -------------------
 * Second onboarding step — the user enters their display name.
 * Shows an avatar placeholder and a text input field.
 *
 * Design:
 *  - Dark (#1E2829) background
 *  - Circular avatar placeholder (initials or person icon)
 *  - Single text input for the user's name
 *  - Teal "Proceed" button, disabled until a non-empty name is entered
 *
 * Navigation:
 *  CreateProfile → EnterName → Home (passes full profile object)
 *
 * Route Params received:
 *  - selectedAllergens: AllergenId[] — chosen in the previous screen
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Colors from "../theme/colors";
import { RootStackParamList } from "../types";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, "EnterName">;

// ── Component ─────────────────────────────────────────────────────────────────

const EnterNameScreen: React.FC<Props> = ({ navigation, route }) => {
  /** Allergens forwarded from CreateProfileScreen */
  const { selectedAllergens } = route.params;

  /** User's typed display name */
  const [name, setName] = useState<string>("");

  /**
   * Build the complete profile object and navigate to the Home screen.
   * We trim whitespace so "  " doesn't count as a valid name.
   */
  const handleProceed = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    navigation.navigate("Home", {
      profile: {
        name: trimmedName,
        selectedAllergens,
      },
    });
  };

  const canProceed = name.trim().length > 0;

  /**
   * Derive initials from the typed name for the avatar placeholder.
   * Shows up to 2 characters (first + last initial).
   */
  const getInitials = (): string => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "👤";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      {/* KeyboardAvoidingView pushes content up when the keyboard opens */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        {/* ── Back Button ───────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* ── Avatar Placeholder ────────────────────────────────────────── */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.avatarHint}>Your profile picture</Text>
        </View>

        {/* ── Name Input ────────────────────────────────────────────────── */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Maria Santos"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleProceed}
            accessibilityLabel="Enter your name"
          />
        </View>

        {/* ── Proceed Button ────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            !canProceed && styles.proceedButtonDisabled,
          ]}
          onPress={handleProceed}
          disabled={!canProceed}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Proceed to home"
          accessibilityState={{ disabled: !canProceed }}
        >
          <Text style={styles.proceedText}>Proceed →</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 28,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  backText: {
    color: Colors.teal,
    fontSize: 15,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.tealLight,
  },
  avatarText: {
    color: Colors.textLight,
    fontSize: 34,
    fontWeight: "700",
  },
  avatarHint: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.inputDark,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textLight,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  proceedButton: {
    backgroundColor: Colors.teal,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  proceedButtonDisabled: {
    backgroundColor: Colors.inputDark,
  },
  proceedText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default EnterNameScreen;
