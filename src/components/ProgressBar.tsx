import { View, StyleSheet } from "react-native";

export default function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${(step / total) * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    backgroundColor: "#E8F5E8",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 20,
  },
  bar: {
    height: "100%",
    backgroundColor: "#2E7D32",
  },
});
