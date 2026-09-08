import BottomBar from "@/src/components/BottomBar";
import { useHabits } from "@/src/context/HabitContext";
import { colors } from "@/src/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import AppAlert from "@/src/components/AppAlert";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ---------- CONSTANTS ---------- */

const BOTTOM_BAR_HEIGHT = 74;

/* ---------- Component ---------- */

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Today");
  const [timeFilter, setTimeFilter] = useState("All");
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits, completeHabit, deleteHabit } = useHabits();

  /* ---------- FILTER LOGIC ---------- */

  const today = new Date().toISOString().split("T")[0];

  const activeHabits = habits.filter(
    (habit) => !habit.lastCompleted || !habit.lastCompleted.startsWith(today),
  );

  const completedHabits = habits.filter(
    (habit) => habit.lastCompleted && habit.lastCompleted.startsWith(today),
  );

  const filteredHabits =
    timeFilter === "All"
      ? activeHabits
      : activeHabits.filter((h) => h.timeOfDay === timeFilter);

  const handleDeletePress = (habit: any) => {
    setSelectedHabit(habit);
    setDeleteVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedHabit) return;

    try {
      await deleteHabit(selectedHabit._id || selectedHabit.id);

      setDeleteVisible(false);
      setSelectedHabit(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: BOTTOM_BAR_HEIGHT + insets.bottom + 80,
        }}
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

          {filteredHabits.map((habit) => {
            const habitId = habit._id || habit.id || "";

            return (
              <View
                key={habitId}
                style={[styles.card, { backgroundColor: habit.color }]}
              >
                {/* Habit information */}
                <TouchableOpacity
                  style={styles.habitContent}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/EditHabit",
                      params: {
                        id: habitId,
                      },
                    })
                  }
                >
                  <Text style={styles.cardIcon}>{habit.icon}</Text>

                  <Text style={styles.cardText}>{habit.name}</Text>
                </TouchableOpacity>

                {/* Actions */}
                <View style={styles.actions}>
                  {/* Complete */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => completeHabit(habitId)}
                  >
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>

                  {/* Edit */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.push({
                        pathname: "/EditHabit",
                        params: {
                          id: habitId,
                        },
                      })
                    }
                  >
                    <MaterialIcons
                      name="edit"
                      size={19}
                      color={colors.primary}
                    />
                  </TouchableOpacity>

                  {/* Delete */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeletePress(habit)}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={20}
                      color="#D32F2F"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* ---------- COMPLETED ---------- */}
        {completedHabits.length > 0 && (
          <>
            <Text style={styles.completedTitle}>Completed</Text>

            {completedHabits.map((habit) => (
              <View key={habit._id || habit.id} style={styles.completedCard}>
                <Text style={styles.completedIcon}>{habit.icon}</Text>
                <Text style={styles.completedText}>{habit.name}</Text>
                <View style={styles.check} />
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <AppAlert
        visible={deleteVisible}
        type="error"
        title="Delete Habit?"
        message={
          selectedHabit
            ? `Are you sure you want to delete "${selectedHabit.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setDeleteVisible(false);
          setSelectedHabit(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      {/* ---------- FLOATING ACTION BUTTON ---------- */}
      <TouchableOpacity
        style={[styles.fab, { bottom: BOTTOM_BAR_HEIGHT + insets.bottom + 16 }]}
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
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
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

  habitContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.65)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
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
