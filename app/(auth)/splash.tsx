import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    // Wait until auth state is initialized, then route accordingly
    if (isLoading) return;

    if (isLoggedIn) {
      router.replace("/(tabs)/home");
      return;
    }

    const t = setTimeout(() => {
      router.replace("/(auth)/onboarding");
    }, 1200);

    return () => clearTimeout(t);
  }, [isLoading, isLoggedIn]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#2E7D32" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
});
