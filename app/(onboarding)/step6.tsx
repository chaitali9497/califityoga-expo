import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import Signature from "react-native-signature-canvas";

import ProgressBar from "@/src/components/ProgressBar";
import { colors } from "@/src/theme/colors";

export default function Step6() {
  const router = useRouter();
  const signatureRef = useRef<any>(null);
  const [signed, setSigned] = useState(false);

  const finishOnboarding = () => {
    // Optional: save signature before navigating
    signatureRef.current?.readSignature();
    router.replace("/(tabs)/home");
  };

  const clearSignature = () => {
    signatureRef.current?.clearSignature();
    setSigned(false);
  };

  return (
    <View style={styles.container}>
      <ProgressBar step={6} total={6} />

      <Text style={styles.title}>Let’s make a contract ✍️</Text>

      <Text style={styles.subtitle}>
        Review and sign your personal commitment to building healthy,
        consistent habits with Califitoga.
      </Text>

      <View style={styles.contractBox}>
        <Text style={styles.bullet}>• Track habits daily 🗓️</Text>
        <Text style={styles.bullet}>• Prioritize health & balance 💚</Text>
        <Text style={styles.bullet}>• Focus on progress, not perfection 🔁</Text>
        <Text style={styles.bullet}>• Be patient with myself 💪</Text>
      </View>

      <Text style={styles.signLabel}>Sign using your finger</Text>

      <View style={styles.signatureBox}>
        <Signature
          ref={signatureRef}
          backgroundColor="white"
          penColor={colors.primary}
          onBegin={() => setSigned(true)}   
          webStyle={signatureWebStyle}
        />
      </View>

      <TouchableOpacity onPress={clearSignature}>
        <Text style={styles.clearText}>Clear signature</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By finishing, you agree to this commitment.
      </Text>

      <TouchableOpacity
        style={[styles.cta, !signed && styles.ctaDisabled]}
        disabled={!signed}
        onPress={finishOnboarding}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const signatureWebStyle = `
  .m-signature-pad {
    box-shadow: none;
    border: none;
  }
  .m-signature-pad--footer {
    display: none;
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },

  contractBox: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 24,
  },

  bullet: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 10,
    lineHeight: 20,
  },

  signLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },

  signatureBox: {
    height: 160,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.white,
    overflow: "hidden",
  },

  clearText: {
    textAlign: "right",
    marginTop: 6,
    fontSize: 12,
    color: colors.primary,
  },

  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 12,
  },

  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    elevation: 4,
  },

  ctaDisabled: {
    backgroundColor: colors.border,
  },

  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
