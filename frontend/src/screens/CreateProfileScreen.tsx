/**
 * CreateProfileScreen.tsx
 * -----------------------
 * "Create Your Allergen Profile" — the first onboarding step.
 * The user selects which allergens apply to them by tapping badge toggles.
 * At least one allergen must be selected before continuing.
 *
 * Design:
 *  - Dark (#1E2829) background
 *  - Teal AllergenBadge list (checkboxes) for all 7 major allergens
 *  - Teal "Submit" button enabled once ≥1 allergen is selected
 *
 * Navigation:
 *  Splash → CreateProfile → EnterName (passes selectedAllergens[])
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Colors from '../theme/colors';
import { ALLERGENS, AllergenId, RootStackParamList } from '../types';
import AllergenBadge from '../components/AllergenBadge';

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProfile'>;

// ── Component ─────────────────────────────────────────────────────────────────

const CreateProfileScreen: React.FC<Props> = ({ navigation }) => {

  /**
   * Track which allergens the user has selected.
   * Using a Set provides O(1) lookup for the selected state of each badge.
   */
  const [selected, setSelected] = useState<Set<AllergenId>>(new Set());

  /**
   * Toggle a single allergen in/out of the selection set.
   * We create a new Set each time to trigger a re-render.
   */
  const toggleAllergen = (id: AllergenId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /** Submit navigates to EnterName, passing the selection as a plain array */
  const handleSubmit = () => {
    navigation.navigate('EnterName', {
      selectedAllergens: Array.from(selected),
    });
  };

  const canSubmit = selected.size > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Your</Text>
        <Text style={styles.titleBold}>Allergen Profile</Text>
        <Text style={styles.subtitle}>
          Select all allergens that apply to you
        </Text>
      </View>

      {/* ── Allergen List ─────────────────────────────────────────────── */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {ALLERGENS.map((allergen) => (
          <AllergenBadge
            key={allergen.id}
            allergen={allergen}
            selected={selected.has(allergen.id)}
            onPress={() => toggleAllergen(allergen.id)}
            variant="selectable"
          />
        ))}
      </ScrollView>

      {/* ── Submit Button ─────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Submit allergen profile"
          accessibilityState={{ disabled: !canSubmit }}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    color: Colors.textLight,
    fontWeight: '400',
  },
  titleBold: {
    fontSize: 26,
    color: Colors.teal,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  list: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 16,
    gap: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: Colors.teal,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.inputDark,
  },
  submitText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default CreateProfileScreen;
