import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";


export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
 
  
  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')} // Update this path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Let&apos;s Get Started!</Text>
        <Text style={styles.subtitle}>Let&apos;s dive in into your account</Text>

        {/* Social Buttons */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>G  Continue with Google</Text>
          </TouchableOpacity>

          

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>📱  Continue with Facebook</Text>
          </TouchableOpacity>

         
        </View>

        {/* Auth Buttons */}
       <View style={styles.authButtons}>
  <Link href="./signup" asChild>
    <TouchableOpacity style={styles.signUpButton}>
      <Text style={styles.signUpText}>Sign up</Text>
    </TouchableOpacity>
  </Link>

  <Link href="./login" asChild>
    <TouchableOpacity style={styles.signInButton}>
      <Text style={styles.signInText}>Sign in</Text>
    </TouchableOpacity>
  </Link>
</View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Privacy Policy · Terms of Service</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  logo: {
    width: 150,
    height: 150,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F7A1F",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7C6B",
    textAlign: "center",
    marginBottom: 40,
  },
  socialButtons: {
    marginBottom: 30,
  },
  socialButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2E7D32",
  },
  authButtons: {
    alignItems: "center",
  },
  signUpButton: {
    height: 56,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  signInButton: {
    height: 56,
    width: "100%",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  signInText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#8A9B8A",
    textAlign: "center",
  },
});
