import { colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface MenuItemProps {
  icon: string;
  label: string;
  value?: string;
  showArrow?: boolean;
  onPress?: () => void;
  color?: string;
  isDanger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  value,
  showArrow = true,
  onPress,
  color = "Ionicons",
  isDanger = false,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={isDanger ? colors.danger : colors.primary}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: isDanger ? colors.danger : colors.textPrimary,
            }}
          >
            {label}
          </Text>
          {value && (
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              {value}
            </Text>
          )}
        </View>
        {showArrow && (
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function AccountScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      {/* Header */}
      <View
        style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}
      >
        <Text
          style={{ fontSize: 28, fontWeight: "700", color: colors.textPrimary }}
        >
          Account
        </Text>
      </View>

      {/* Profile Card */}
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 16,
          backgroundColor: colors.white,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 28 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.textPrimary,
              }}
            >
              John Doe
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 4,
              }}
            >
              john.doe@example.com
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: colors.inputBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscription Status */}
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 24,
          backgroundColor: colors.primary,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 4,
              }}
            >
              Current Plan
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.white,
              }}
            >
              Free Plan
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.white,
              }}
            >
              Upgrade
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Sections */}

      {/* Preferences */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.textMuted,
            paddingHorizontal: 16,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          Preferences
        </Text>
        <View
          style={{
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <TouchableOpacity activeOpacity={0.7}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: "500",
                  color: colors.textPrimary,
                }}
              >
                Notifications
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: colors.border,
                  true: `${colors.primary}40`,
                }}
                thumbColor={
                  notificationsEnabled ? colors.primary : colors.textMuted
                }
              />
            </View>
          </TouchableOpacity>

          <MenuItem
            icon="moon-outline"
            label="Dark Mode"
            showArrow={false}
            color="Ionicons"
          />

          <MenuItem
            icon="globe-outline"
            label="Language"
            value="English"
            onPress={() => {}}
            color="Ionicons"
          />

          <MenuItem
            icon="palette-outline"
            label="App Theme"
            value="Default"
            onPress={() => {}}
            color="Ionicons"
          />
        </View>
      </View>

      {/* Account Settings */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.textMuted,
            paddingHorizontal: 16,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          Account Settings
        </Text>
        <View
          style={{
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <MenuItem
            icon="person-outline"
            label="Personal Info"
            value="Edit your profile"
            onPress={() => {}}
            color="Ionicons"
          />
          <MenuItem
            icon="card-outline"
            label="Billing & Subscriptions"
            value="View plans"
            onPress={() => {}}
            color="Ionicons"
          />
          <MenuItem
            icon="shield-outline"
            label="Account & Security"
            value="Password & security"
            onPress={() => {}}
            color="Ionicons"
          />
          <MenuItem
            icon="phone-portrait-outline"
            label="Connected Devices"
            value="Manage devices"
            onPress={() => {}}
            color="Ionicons"
          />
        </View>
      </View>

      {/* Support & Legal */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.textMuted,
            paddingHorizontal: 16,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          Support & Legal
        </Text>
        <View
          style={{
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
            color="Ionicons"
          />
          <MenuItem
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={() => {}}
            color="Ionicons"
          />
          <MenuItem
            icon="document-outline"
            label="Terms of Service"
            onPress={() => {}}
            color="Ionicons"
          />
          <MenuItem
            icon="information-circle-outline"
            label="About"
            value="v1.0.0"
            onPress={() => {}}
            color="Ionicons"
          />
        </View>
      </View>

      {/* Data & Cache */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.textMuted,
            paddingHorizontal: 16,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          Data & Cache
        </Text>
        <View
          style={{
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <MenuItem
            icon="trash-outline"
            label="Clear Cache"
            value="0 MB"
            onPress={() => {
              Alert.alert("Clear Cache", "Cache cleared successfully!");
            }}
            color="Ionicons"
          />
          <MenuItem
            icon="download-outline"
            label="Download My Data"
            onPress={() => {}}
            color="Ionicons"
          />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginHorizontal: 16,
          marginBottom: 40,
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderRadius: 8,
          padding: 12,
          borderWidth: 1,
          borderColor: colors.danger,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.danger}
            style={{ marginRight: 12 }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: "600",
              color: colors.danger,
            }}
          >
            Logout
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.danger} />
        </View>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
              paddingBottom: 32,
            }}
          >
            {/* Title */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.danger,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Logout?
            </Text>

            {/* Message */}
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Are you sure you want to logout?
            </Text>

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.textSecondary,
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmLogout}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.white,
                    textAlign: "center",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
