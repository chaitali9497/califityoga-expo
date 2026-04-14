import { colors } from "@/src/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  {
    key: "Home",
    label: "Home",
    icon: "home-outline",
    lib: "Ionicons",
    route: "/(tabs)/home" as const,
  },
  {
    key: "Mood",
    label: "Mood Stat",
    icon: "emoticon-outline",
    lib: "MaterialCommunityIcons",
    route: "/(tabs)/mood" as const,
  },
  {
    key: "Report",
    label: "Report",
    icon: "bar-chart-2",
    lib: "Feather",
    route: "/(tabs)/report" as const,
  },
  {
    key: "Habits",
    label: "My Habits",
    icon: "apps-outline",
    lib: "Ionicons",
    route: "/(tabs)/myHabits" as const,
  },
  {
    key: "Account",
    label: "Account",
    icon: "person-outline",
    lib: "Ionicons",
    route: "/(tabs)/account" as const,
  },
] as const;

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const activeTab = useMemo(() => {
    if (pathname.includes("/home")) return "Home";
    if (pathname.includes("/mood")) return "Mood";
    if (pathname.includes("/report")) return "Report";
    if (pathname.includes("/myHabits")) return "Habits";
    if (pathname.includes("/account")) return "Account";
    return "Home";
  }, [pathname]);

  const handleTabPress = (tabKey: string) => {
    const tab = TABS.find((t) => t.key === tabKey);
    if (tab) {
      router.push(tab.route);
    }
  };

  const renderIcon = (tab: any, active: boolean) => {
    const color = active ? colors.primary : colors.textMuted;
    const size = 22;

    switch (tab.lib) {
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons name={tab.icon} size={size} color={color} />
        );
      case "Feather":
        return <Feather name={tab.icon} size={size} color={color} />;
      default:
        return <Ionicons name={tab.icon} size={size} color={color} />;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {TABS.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => handleTabPress(tab.key)}
          >
            {renderIcon(tab, active)}
            <Text
              style={[
                styles.label,
                { color: active ? colors.primary : colors.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingHorizontal: 0,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },
});
