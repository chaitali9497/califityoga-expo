import BottomBar from "@/src/components/BottomBar";
import { useHabits } from "@/src/context/HabitContext";
import { colors } from "@/src/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/* ---------- CONSTANTS ---------- */

const BOTTOM_BAR_HEIGHT = 74;

/* ---------- Component ---------- */

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Today");
  const [timeFilter, setTimeFilter] = useState("All");

  const router = useRouter();
  const { habits, completeHabit } = useHabits();

  /* ---------- FILTER LOGIC ---------- */

  const activeHabits = habits.filter((h) => !h.lastCompleted);
  const completedHabits = habits.filter((h) => h.lastCompleted);

  const filteredHabits =
    timeFilter === "All"
      ? activeHabits
      : activeHabits.filter((h) => h.timeOfDay === timeFilter);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: BOTTOM_BAR_HEIGHT + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
        </View>

        {/* ---------- TOP TABS ---------- */}
        <View style={styles.tabs}>
          {["Today", "Weekly", "Overall"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---------- TIME FILTER ---------- */}
        <View style={styles.filters}>
          {["All", "Morning", "Afternoon", "Evening"].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setTimeFilter(f)}
              style={[styles.filter, timeFilter === f && styles.filterActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  timeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---------- ACTIVE HABITS ---------- */}
        <View style={styles.section}>
          {filteredHabits.length === 0 && (
            <Text style={styles.emptyText}>No habits for this time ⏳</Text>
          )}

          {filteredHabits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              onPress={() => completeHabit(habit.id)}
              activeOpacity={0.85}
              style={[styles.card, { backgroundColor: habit.color }]}
            >
              <Text style={styles.cardIcon}>{habit.icon}</Text>
              <Text style={styles.cardText}>{habit.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---------- COMPLETED ---------- */}
        {completedHabits.length > 0 && (
          <>
            <Text style={styles.completedTitle}>Completed</Text>

            {completedHabits.map((habit) => (
              <View key={habit.id} style={styles.completedCard}>
                <Text style={styles.completedIcon}>{habit.icon}</Text>
                <Text style={styles.completedText}>{habit.name}</Text>
                <View style={styles.check} />
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* ---------- FLOATING ACTION BUTTON ---------- */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/CreateRegularHabit")}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ---------- BOTTOM BAR ---------- */}
      <BottomBar />
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 10,
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  /* ---------- Tabs ---------- */

  tabs: {
    flexDirection: "row",
    marginBottom: 14,
  },

  tab: {
    marginRight: 18,
    paddingBottom: 6,
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },

  tabText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },

  tabTextActive: {
    color: colors.primary,
  },

  /* ---------- Filters ---------- */

  filters: {
    flexDirection: "row",
    marginBottom: 20,
  },

  filter: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.white,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  filterTextActive: {
    color: colors.white,
  },

  /* ---------- Cards ---------- */

  section: {
    gap: 12,
    marginBottom: 20,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  cardIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  cardText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },

  /* ---------- Completed ---------- */

  completedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },

  completedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  completedIcon: {
    fontSize: 18,
    marginRight: 12,
  },

  completedText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
  },

  /* ---------- FAB ---------- */

  fab: {
    position: "absolute",
    right: 24,
    bottom: BOTTOM_BAR_HEIGHT + 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",

    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
