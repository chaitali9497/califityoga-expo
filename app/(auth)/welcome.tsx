import * as Google from "expo-auth-session/providers/google";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
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
      //  Send token to backend here
    }
  }, [response]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8FBF8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {/* Logo */}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* Content */}
          <View style={styles.card}>
            <Text style={styles.title}>Let’s Get Started</Text>
            <Text style={styles.subtitle}>
              Build healthy habits with Califitoga
            </Text>

            {/* Google Button */}
            <Pressable
              onPress={() => promptAsync()}
              style={({ pressed }) => [
                styles.socialButton,
                {
                  backgroundColor: pressed ? "#EEF7EE" : "#FFFFFF",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={styles.socialText}>🔍 Continue with Google</Text>
            </Pressable>

            {/* Facebook (UI only) */}
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                {
                  backgroundColor: pressed ? "#EEF7EE" : "#FFFFFF",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={styles.socialText}>📘 Continue with Facebook</Text>
            </Pressable>

            {/* Divider */}
            <Text style={styles.or}>or</Text>

            {/* Auth Buttons */}
            <Link href="./signup" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  {
                    backgroundColor: pressed ? "#1B5E20" : "#2E7D32",
                  },
                ]}
              >
                <Text style={styles.primaryText}>Create Account</Text>
              </Pressable>
            </Link>

            <Link href="./login" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  {
                    backgroundColor: pressed ? "#E8F5E8" : "#FFFFFF",
                  },
                ]}
              >
                <Text style={styles.secondaryText}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>Privacy Policy · Terms of Service</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  socialButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8F5E8",
  },

  socialText: {
    color: "#2E7D32",
    fontWeight: "600",
  },

  or: {
    textAlign: "center",
    marginVertical: 10,
    color: "#999",
  },

  primaryBtn: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  secondaryBtn: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#2E7D32",
  },

  secondaryText: {
    color: "#2E7D32",
    fontWeight: "600",
  },

  footer: {
    marginTop: 20,
    color: "#8A9B8A",
    fontSize: 13,
  },
});
