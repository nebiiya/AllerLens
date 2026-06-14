/**
 * AllergenBadge.tsx
 * -----------------
 * A small pill/chip that displays a single allergen with its emoji icon and label.
 * Used on:
 *  - CreateProfileScreen  : selectable checkbox-style badges
 *  - ProfileScreen        : read-only display of the user's saved allergens
 *  - WarningResultScreen  : highlights detected allergens in the scan result
 *
 * Props:
 *  - allergen    : the Allergen object to display (id, label, emoji)
 *  - selected    : whether the badge is toggled on (teal fill) or off (outlined)
 *  - onPress     : optional tap handler — omit for non-interactive (read-only) use
 *  - variant     : 'selectable' shows a checkbox tick; 'display' is read-only
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Colors from '../theme/colors';
import { Allergen } from '../types';

// ── Prop Types ────────────────────────────────────────────────────────────────

interface AllergenBadgeProps {
  allergen: Allergen;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'selectable' | 'display';
}

// ── Component ─────────────────────────────────────────────────────────────────

const AllergenBadge: React.FC<AllergenBadgeProps> = ({
  allergen,
  selected = false,
  onPress,
  variant = 'selectable',
}) => {
  const isSelectable = variant === 'selectable' && !!onPress;

  // Determine background: teal when selected/display, dark outline when unselected
  const badgeStyle = [
    styles.badge,
    selected ? styles.badgeSelected : styles.badgeUnselected,
  ];

  const content = (
    <View style={styles.inner}>
      {/* Emoji icon on the left */}
      <Text style={styles.emoji}>{allergen.emoji}</Text>

      {/* Allergen name */}
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
        {allergen.label}
      </Text>

      {/* Checkmark tick shown only in selectable mode when selected */}
      {variant === 'selectable' && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}
    </View>
  );

  // Wrap in TouchableOpacity only when interactive
  if (isSelectable) {
    return (
      <TouchableOpacity
        style={badgeStyle}
        onPress={onPress}
        activeOpacity={0.75}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={`${allergen.label} allergen`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={badgeStyle}>{content}</View>;
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 5,
    width: '100%',
  },
  badgeSelected: {
    backgroundColor: Colors.teal,
  },
  badgeUnselected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.tealLight,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  labelSelected: {
    color: Colors.textLight,
  },
  labelUnselected: {
    color: Colors.textLight,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.textLight,
    borderColor: Colors.textLight,
  },
  checkmark: {
    color: Colors.teal,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default AllergenBadge;
