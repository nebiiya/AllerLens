/**
 * types/index.ts
 * --------------
 * Shared TypeScript types and interfaces used throughout the AllerLens app.
 * Centralizing them here avoids duplication and makes refactoring easier.
 */

// ── Allergen Definitions ──────────────────────────────────────────────────

/**
 * The 8 major allergen categories recognized by the app.
 * These match the checkboxes shown on the "Create Your Allergen Profile" screen.
 */
export type AllergenId =
  | 'milk'
  | 'peanuts'
  | 'eggs'
  | 'soybeans'
  | 'peanuts'
  | 'wheat'
  | 'fish'
  | 'tree nuts'
  | 'Crustacean shellfish';

/**
 * Display metadata for each allergen.
 * Used to render badge labels and emoji icons on the profile & result screens.
 */
export interface Allergen {
  id: AllergenId;
  label: string;   // Human-readable name, e.g. "Peanut"
  emoji: string;   // Emoji icon shown beside the label
}

/** Full list of supported allergens with their display data */
export const ALLERGENS: Allergen[] = [
  { id: 'milk',                 label: 'Milk',                 emoji: '🥛' },
  { id: 'Crustacean shellfish', label: 'Crustacean Shellfish', emoji: '🦐' },
  { id: 'eggs',                 label: 'Egg',                  emoji: '🥚' },
  { id: 'fish',                 label: 'Fish',                 emoji: '🐟' },
  { id: 'peanuts',              label: 'Peanut',               emoji: '🥜' },
  { id: 'soybeans',             label: 'Soybean',              emoji: '🫘' },
  { id: 'tree nuts',            label: 'Tree Nuts',            emoji: '🌰' },
  { id: 'wheat',                label: 'Wheat',                emoji: '🌾' },
];

// ── User Profile ──────────────────────────────────────────────────────────

/**
 * The user's allergen profile, collected during onboarding.
 * Stored in app state and passed between screens.
 */
export interface UserProfile {
  name: string;                          // Display name entered by user
  selectedAllergens: Set<AllergenId>;    // Which allergens the user has
}

// ── Scan / Analysis Results ───────────────────────────────────────────────

/**
 * Result of an ingredient scan.
 * Passed from ProcessingScreen → result screens.
 */
export type ScanVerdict = 'SAFE' | 'WARNING';

export interface ScanResult {
  verdict: ScanVerdict;
  /** Allergens that were found in the scanned ingredient list */
  detectedAllergens: AllergenId[];
  /** Raw ingredient text or image URI that was analyzed */
  sourceRef: string;
}

// ── Navigation Param Lists ────────────────────────────────────────────────

/**
 * Type-safe route parameter definitions for React Navigation.
 * Each key is a screen name; the value describes what params it accepts.
 * Use `undefined` when a screen takes no params.
 */
export type RootStackParamList = {
  Splash: undefined;
  CreateProfile: undefined;
  EnterName: { selectedAllergens: AllergenId[] };
  Home: { profile: { name: string; selectedAllergens: AllergenId[] } };
  Camera: { profile: { name: string; selectedAllergens: AllergenId[] } };
  Processing: {
    profile: { name: string; selectedAllergens: AllergenId[] };
    imageUri: string;
  };
  Profile: { profile: { name: string; selectedAllergens: AllergenId[] } };
  SafeResult: {stats: any};
  WarningResult: { detectedAllergens: AllergenId[]; stats: any};
};
