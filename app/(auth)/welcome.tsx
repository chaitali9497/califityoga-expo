import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_EXPO_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication) {
        console.log("Google Token:", authentication.accessToken);
      }
      // Send token to your backend here
    }
  }, [response]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 20,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Let’s Get Started</Text>
          <Text style={styles.subtitle}>
            Build healthy habits with Califitoga
          </Text>

          {/* Continue with Google */}
          <Pressable
            onPress={() => promptAsync()}
            disabled={!request}
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.socialText}>🔍 Continue with Google</Text>
          </Pressable>

          {/* Sign Up */}
          <Pressable
            onPress={() => router.push("./signup")}
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.socialText}>📝 Sign Up</Text>
          </Pressable>

          {/* Login */}
          <Pressable
            onPress={() => router.push("./login")}
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.socialText}>🔐 Login</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Privacy Policy · Terms of Service</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FBF8",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: 120,
    height: 120,
    marginTop: 20,
    marginBottom: 10,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginTop: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    // Android shadow
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F7A1F",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7C6B",
    textAlign: "center",
    marginBottom: 25,
  },

  // Same design for all three buttons
  socialButton: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2E7D32",
    backgroundColor: "#2E7D32",
  },

  buttonPressed: {
    backgroundColor: "#1B5E20",
    transform: [{ scale: 0.97 }],
  },

  socialText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },

  footer: {
    marginTop: 24,
    marginBottom: 20,
    color: "#8A9B8A",
    fontSize: 13,
    textAlign: "center",
  },
});
