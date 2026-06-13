/**
 * BottomTabBar.tsx
 * ----------------
 * Custom bottom navigation bar shown on the main app screens (Home, Camera, Profile).
 * It has three tabs matching the Figma design:
 *   🏠  Home   — navigates to HomeScreen
 *   📷  Camera — navigates to CameraScreen
 *   👤  Profile — navigates to ProfileScreen
 *
 * Props:
 *  - activeTab  : which tab is currently highlighted ('home' | 'camera' | 'profile')
 *  - onTabPress : callback with the tapped tab key so the parent can navigate
 *  - profile    : user profile passed through to navigation targets
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Colors from '../theme/colors';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TabKey = 'home' | 'camera' | 'profile';

interface BottomTabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

// ── Tab Definitions ───────────────────────────────────────────────────────────

/** Static list of tab metadata — icon (emoji) + label + key */
const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: 'home',    icon: '🏠', label: 'Home'    },
  { key: 'camera',  icon: '📷', label: 'Scan'    },
  { key: 'profile', icon: '👤', label: 'Profile' },
];

// ── Component ─────────────────────────────────────────────────────────────────

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            {/* Icon */}
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>

            {/* Label */}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>

            {/* Active indicator dot */}
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBar,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#2C3B3D',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,   // Muted when inactive
  },
  iconActive: {
    opacity: 1,     // Full brightness when active
  },
  label: {
    fontSize: 11,
    color: Colors.tabInactive,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.tabActive,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.teal,
    marginTop: 2,
  },
});

export default BottomTabBar;
