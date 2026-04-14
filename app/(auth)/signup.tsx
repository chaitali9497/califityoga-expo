import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

const handleSignUp = () => {
  if (!agree) return;

  setLoading(true);

  // Simulated API call
  setTimeout(() => {
    setLoading(false);
    router.replace("/(onboarding)/step1");
  }, 2000);
};


  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Join Habitly Today ✨</Text>
      <Text style={styles.subtitle}>
        Start your habit journey with Habitly. It's quick, easy, and free!
      </Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputBox}>
        <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputBox}>
        <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setAgree(!agree)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, agree && styles.checkboxActive]}>
          {agree && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
        <Text style={styles.termsText}>
          I agree to Habitly{" "}
          <Text style={styles.link}>Terms & Conditions</Text>.
        </Text>
      </TouchableOpacity>

      {/* Sign In */}
      <Text style={styles.signInText}>
        Already have an account?{" "}
        <Text style={styles.link}>Sign in</Text>
      </Text>

      {/* OR */}
      <View style={styles.orRow}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Social */}
      <TouchableOpacity style={styles.socialBtn}>
        <Ionicons name="logo-google" size={18} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialBtn}>
        <Ionicons name="logo-apple" size={18} />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      {/* CTA */}
      <TouchableOpacity
        style={[
          styles.signUpBtn,
          (!email || !password || !agree) && { opacity: 0.6 },
        ]}
        disabled={!email || !password || !agree}
        onPress={handleSignUp}
      >
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>

      {/* Loader */}
      <Modal transparent visible={loading}>
        <View style={styles.overlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Sign up...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  backBtn: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: 24,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: colors.textPrimary,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  link: {
    color: colors.primary,
    fontWeight: "600",
  },
  signInText: {
    textAlign: "center",
    marginBottom: 16,
    color: colors.textSecondary,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    marginHorizontal: 10,
    color: colors.textMuted,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    height: 48,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  socialText: {
    marginLeft: 8,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  signUpBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signUpText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: colors.white,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontWeight: "500",
    color: colors.textPrimary,
  },
});
