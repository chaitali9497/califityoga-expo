import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

type LoaderProps = {
  visible: boolean;
  message?: string;
};

export default function Loader({
  visible,
  message = "Loading...",
}: LoaderProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#2E7D32" />

          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    width: 280,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
});
