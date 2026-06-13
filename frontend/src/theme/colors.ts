/**
 * colors.ts
 * ---------
 * Centralized color palette for AllerLens.
 * Derived from the Figma design's three-swatch template:
 *   - CREAM  : off-white background used on splash, home, and result screens
 *   - TEAL   : primary brand/action color for buttons, badges, and accents
 *   - DARK   : dark background used on profile setup and camera screens
 *
 * Import this file wherever color values are needed so that a single edit
 * propagates app-wide.
 */

const Colors = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  /** Warm off-white — used on Splash, Home, and Result screens */
  cream: '#F8F4EB',

  /** Deep dark teal-black — used on Profile setup and Camera screens */
  dark: '#1E2829',

  // ── Brand / Primary ───────────────────────────────────────────────────────
  /** Main brand teal — buttons, allergen badges, logo accent */
  teal: '#4A9EAD',

  /** Slightly lighter teal for hover/pressed states */
  tealLight: '#5BB8C8',

  // ── Semantic ──────────────────────────────────────────────────────────────
  /** Safe verdict — green checkmark background */
  safe: '#4CAF50',

  /** Warning verdict — red alert background */
  warning: '#E53935',

  // ── Text ─────────────────────────────────────────────────────────────────
  /** Primary text on dark backgrounds */
  textLight: '#FFFFFF',

  /** Primary text on light/cream backgrounds */
  textDark: '#1E2829',

  /** Muted/secondary text */
  textMuted: '#7A8A8B',

  // ── UI Elements ───────────────────────────────────────────────────────────
  /** Bottom tab bar background */
  tabBar: '#1E2829',

  /** Active tab icon */
  tabActive: '#4A9EAD',

  /** Inactive tab icon */
  tabInactive: '#7A8A8B',

  /** Input field background on dark screens */
  inputDark: '#2C3B3D',

  /** Reminder / alert banner background */
  reminderBg: '#E53935',
} as const;

export default Colors;
