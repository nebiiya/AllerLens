/**
 * ProfileScreen.tsx
 * -----------------
 * Displays the user's saved allergen profile.
 * Shows their name, avatar initials, and a read-only list of allergen badges.
 * Also shows a reminder banner about always double-checking labels.
 *
 * Design:
 *  - Cream (#F8F4EB) background (matches Home)
 *  - Avatar with initials + user name
 *  - Read-only AllergenBadge list in teal
 *  - Red reminder banner at the bottom
 *  - Custom BottomTabBar
 *
 * Navigation:
 *  Home/Camera → Profile
 *
 * Route Params received:
 *  - profile: { name, selectedAllergens }
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Colors from "../theme/colors";
import { RootStackParamList, ALLERGENS } from "../types";
import AllergenBadge from "../components/AllergenBadge";
import BottomTabBar from "../components/BottomTabBar";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

// ── Component ─────────────────────────────────────────────────────────────────

const ProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile } = route.params;

  /**
   * Filter the full allergen list down to only those in the user's profile.
   * We look up by id to ensure we always get the full display metadata.
   */
  const userAllergens = ALLERGENS.filter((a) =>
    profile.selectedAllergens.includes(a.id),
  );

  /** Bottom tab handler */
  const handleTabPress = (tab: string) => {
    if (tab === "home") {
      navigation.navigate("Home", { profile });
    } else if (tab === "camera") {
      navigation.navigate("Camera", { profile });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        <Text style={styles.screenTitle}>Allergen Profile</Text>

        {/* ── User Identity Card ───────────────────────────────────────── */}
        <View style={styles.identityCard}>
          {/* Avatar with initial */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.allergenCount}>
            {userAllergens.length} allergen
            {userAllergens.length !== 1 ? "s" : ""} tracked
          </Text>
        </View>

        {/* ── Allergen List ─────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Allergens</Text>
          <Text style={styles.sectionSubtitle}>Here are your allergens:</Text>
        </View>

        <View style={styles.allergenList}>
          {userAllergens.map((allergen) => (
            <AllergenBadge
              key={allergen.id}
              allergen={allergen}
              selected // Always shown as "selected" (read-only teal)
              variant="display"
            />
          ))}
        </View>

        {/* ── Reminder Banner ───────────────────────────────────────────── */}
        <View style={styles.reminderBanner}>
          <Text style={styles.reminderTitle}>⚠️ REMINDER</Text>
          <Text style={styles.reminderText}>
            Some allergens from your selected allergens to look out for. Be
            careful when you encounter any of these in your food — always
            double-check ingredient labels even after a safe result.
          </Text>
        </View>
      </ScrollView>

      {/* ── Bottom Tab Bar ────────────────────────────────────────────── */}
      <BottomTabBar activeTab="profile" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: Colors.dark,
    marginBottom: 20,
  },

  // Identity card
  identityCard: {
    alignItems: "center",
    backgroundColor: Colors.dark,
    borderRadius: 20,
    paddingVertical: 28,
    marginBottom: 28,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: Colors.textLight,
    fontSize: 28,
    fontWeight: "700",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textLight,
    marginBottom: 4,
  },
  allergenCount: {
    fontSize: 15,
    color: Colors.textMuted,
  },

  // Section header
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },

  // Allergen list
  allergenList: {
    gap: 6,
    marginBottom: 50,
  },

  // Reminder
  reminderBanner: {
    backgroundColor: Colors.reminderBg,
    borderRadius: 14,
    padding: 16,
  },
  reminderTitle: {
    color: Colors.textLight,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 6,
  },
  reminderText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ProfileScreen;
