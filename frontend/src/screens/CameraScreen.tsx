/**
 * CameraScreen.tsx
 * ----------------
 * Allows the user to capture or pick an image of an ingredient label.
 * Presents two options:
 *   1. "Take a Photo"     — opens the device camera
 *   2. "Upload from Gallery" — opens the media library picker
 *
 * After selecting an image, the screen navigates to ProcessingScreen,
 * passing the image URI and user profile for allergen analysis.
 *
 * Design:
 *  - Dark (#1E2829) background
 *  - Two large teal action buttons stacked vertically
 *  - Custom BottomTabBar
 *
 * Navigation:
 *  Home → Camera → Processing
 *
 * Route Params received:
 *  - profile: { name, selectedAllergens }
 *
 * Requires Expo permissions:
 *  - expo-camera          (camera access)
 *  - expo-image-picker    (gallery access)
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Colors from "../theme/colors";
import { RootStackParamList } from "../types";
import BottomTabBar from "../components/BottomTabBar";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, "Camera">;

// ── Component ─────────────────────────────────────────────────────────────────

const CameraScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile } = route.params;

  /** Shows a loading spinner while the image picker is launching */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Requests camera permission and opens the device camera.
   * On success, navigates to ProcessingScreen with the captured image URI.
   */
  const handleTakePhoto = async () => {
    setIsLoading(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera Access Required",
          "Please allow camera access in your device settings to use this feature.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"], // v16+ API — replaces deprecated MediaTypeOptions.Images
        quality: 0.85, // Balance between quality and file size
        allowsEditing: true, // Let user crop before proceeding
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        // Navigate to processing with the captured image URI
        navigation.navigate("Processing", {
          profile,
          imageUri: result.assets[0].uri,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Could not open camera. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Requests media library permission and opens the gallery picker.
   * On success, navigates to ProcessingScreen with the chosen image URI.
   */
  const handleUploadFromGallery = async () => {
    setIsLoading(true);
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Gallery Access Required",
          "Please allow photo library access in your device settings.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // v16+ API — replaces deprecated MediaTypeOptions.Images
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        navigation.navigate("Processing", {
          profile,
          imageUri: result.assets[0].uri,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Could not open gallery. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /** Bottom tab handler — navigates away from Camera if another tab is tapped */
  const handleTabPress = (tab: string) => {
    if (tab === "home") {
      navigation.navigate("Home", { profile });
    } else if (tab === "profile") {
      navigation.navigate("Profile", { profile });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      <View style={styles.container}>
        {/* ── Header ────────────────────────────────────────────────────── */}
        <Text style={styles.header}>Scan Ingredients</Text>
        <Text style={styles.subheader}>
          Take a photo or upload an image of the ingredient label
        </Text>

        {/* ── Image Placeholder Preview ─────────────────────────────────── */}
        <View style={styles.previewBox}>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.teal} />
          ) : (
            <>
              <Text style={styles.previewIcon}>📋</Text>
              <Text style={styles.previewText}>No image selected</Text>
            </>
          )}
        </View>

        {/* ── Action Buttons ────────────────────────────────────────────── */}
        <View style={styles.buttonsContainer}>
          {/* Option 1: Camera */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTakePhoto}
            disabled={isLoading}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Take a photo"
          >
            <Text style={styles.buttonIcon}>📷</Text>
            <Text style={styles.buttonLabel}>Take a Photo</Text>
          </TouchableOpacity>

          {/* Option 2: Gallery */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleUploadFromGallery}
            disabled={isLoading}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Upload from gallery"
          >
            <Text style={styles.buttonIcon}>🖼️</Text>
            <Text style={styles.buttonLabel}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Bottom Tab Bar ────────────────────────────────────────────── */}
      <BottomTabBar activeTab="camera" onTabPress={handleTabPress} />
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
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textLight,
    marginBottom: 8,
  },
  subheader: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 28,
    lineHeight: 20,
  },

  // Image preview box
  previewBox: {
    flex: 1,
    backgroundColor: "#2C3B3D",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 2,
    borderColor: Colors.inputDark,
    borderStyle: "dashed",
  },
  previewIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.4,
  },
  previewText: {
    color: Colors.textMuted,
    fontSize: 14,
  },

  // Action buttons
  buttonsContainer: {
    gap: 14,
    paddingBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.teal,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
  },
  buttonIcon: {
    fontSize: 22,
  },
  buttonLabel: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CameraScreen;
