import AppAlert from "@/src/components/AppAlert";
import BottomBar from "@/src/components/BottomBar";
import { useAuth } from "@/src/context/AuthContext";
import { useHabits } from "@/src/context/HabitContext";
import { clearFirstLogin, getFirstLogin } from "@/src/store/authStorage";
import { colors } from "@/src/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOTTOM_BAR_HEIGHT = 74;

export default function HomeScreen() {
  const [timeFilter, setTimeFilter] = useState("All");
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuth();
  const { habits, completeHabit, deleteHabit } = useHabits();

  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLogin = async () => {
      const firstLogin = await getFirstLogin();

      setIsNewUser(firstLogin);

      if (firstLogin) {
        await clearFirstLogin();
      }
    };

    checkFirstLogin();
  }, []);

  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  const completedHabits = useMemo(
    () =>
      habits.filter(
        (habit) =>
          habit.lastCompleted && habit.lastCompleted.startsWith(todayKey),
      ),
    [habits, todayKey],
  );

  const activeHabits = useMemo(
    () =>
      habits.filter(
        (habit) =>
          !habit.lastCompleted || !habit.lastCompleted.startsWith(todayKey),
      ),
    [habits, todayKey],
  );

  const filteredHabits = useMemo(() => {
    if (timeFilter === "All") return activeHabits;

    return activeHabits.filter((habit) => habit.timeOfDay === timeFilter);
  }, [activeHabits, timeFilter]);

  const totalHabits = habits.length;

  const progress = totalHabits > 0 ? completedHabits.length / totalHabits : 0;

  const progressPercent = Math.round(progress * 100);

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

  const dateText = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const hour = today.getHours();

  let timeGreeting = "Good night";
  let greetingEmoji = "🌙";

  if (hour >= 5 && hour < 12) {
    timeGreeting = "Good morning";
    greetingEmoji = "☀️";
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = "Good afternoon";
    greetingEmoji = "🌤️";
  } else if (hour >= 17 && hour < 21) {
    timeGreeting = "Good evening";
    greetingEmoji = "🌿";
  }

  const userName = user?.name?.trim() || "there";

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: BOTTOM_BAR_HEIGHT + insets.bottom + 90,
        }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallGreeting}>
              {isNewUser
                ? "Welcome to CALIFITOGA 🌱"
                : `${timeGreeting}, ${userName} ${greetingEmoji}`}
            </Text>

            <Text style={styles.title}>
              {isNewUser
                ? `Hi ${userName}, let's get started`
                : "Let's make today count"}
            </Text>

            <Text style={styles.date}>{dateText}</Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileEmoji}>🌱</Text>
          </View>
        </View>

        {/* PROGRESS CARD */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>TODAY'S PROGRESS</Text>

              <Text style={styles.progressTitle}>
                {completedHabits.length} of {totalHabits} habits
              </Text>
            </View>

            <View style={styles.progressCircle}>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>

          <Text style={styles.progressMessage}>
            {totalHabits === 0
              ? "Start your journey by adding your first habit."
              : progressPercent === 100
                ? "Amazing! You completed everything today 🎉"
                : progressPercent >= 50
                  ? "You're doing great. Keep the momentum going! 💚"
                  : "Small steps lead to big changes. Keep going! 🌱"}
          </Text>
        </View>

        {/* STREAK */}
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Text style={styles.streakEmoji}>🔥</Text>
          </View>

          <View style={styles.streakContent}>
            <Text style={styles.streakTitle}>Build your streak</Text>

            <Text style={styles.streakText}>
              Complete your habits today and keep your momentum alive.
            </Text>
          </View>

          <MaterialIcons
            name="chevron-right"
            size={22}
            color={colors.textMuted}
          />
        </View>

        {/* HABITS HEADER */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Today's Habits</Text>

            <Text style={styles.sectionSubtitle}>One step at a time</Text>
          </View>

          <TouchableOpacity onPress={() => router.push("/CreateRegularHabit")}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* TIME FILTER */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {["All", "Morning", "Afternoon", "Evening"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setTimeFilter(filter)}
              style={[
                styles.filter,
                timeFilter === filter && styles.filterActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  timeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ACTIVE HABITS */}
        <View style={styles.habitsContainer}>
          {filteredHabits.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🌱</Text>

              <Text style={styles.emptyTitle}>Nothing here yet</Text>

              <Text style={styles.emptyText}>
                Add a habit and start building your routine.
              </Text>

              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push("/CreateRegularHabit")}
              >
                <Text style={styles.emptyButtonText}>Add Your First Habit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredHabits.map((habit) => {
              const habitId = habit._id || habit.id || "";

              return (
                <View key={habitId} style={styles.habitCard}>
                  <TouchableOpacity
                    style={styles.habitMain}
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
                    <View
                      style={[
                        styles.habitIcon,
                        {
                          backgroundColor: habit.color || colors.primary,
                        },
                      ]}
                    >
                      <Text style={styles.habitEmoji}>
                        {habit.icon || "📝"}
                      </Text>
                    </View>

                    <View style={styles.habitInfo}>
                      <Text style={styles.habitName} numberOfLines={1}>
                        {habit.name}
                      </Text>

                      <Text style={styles.habitMeta}>
                        {habit.timeOfDay || "Anytime"} •{" "}
                        {habit.repeat || "Daily"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.habitActions}>
                    <TouchableOpacity
                      style={styles.editButton}
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
                        size={18}
                        color={colors.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => completeHabit(habitId)}
                    >
                      <MaterialIcons
                        name="check"
                        size={21}
                        color={colors.white}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletePress(habit)}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={19}
                        color={colors.danger}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* COMPLETED */}
        {completedHabits.length > 0 && (
          <View style={styles.completedSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Completed today</Text>

                <Text style={styles.sectionSubtitle}>Look at you go ✨</Text>
              </View>

              <View style={styles.completedCount}>
                <Text style={styles.completedCountText}>
                  {completedHabits.length}
                </Text>
              </View>
            </View>

            {completedHabits.map((habit) => (
              <View key={habit._id || habit.id} style={styles.completedCard}>
                <View style={styles.completedIcon}>
                  <Text>{habit.icon || "📝"}</Text>
                </View>

                <Text style={styles.completedText} numberOfLines={1}>
                  {habit.name}
                </Text>

                <View style={styles.completedCheck}>
                  <MaterialIcons name="check" size={15} color={colors.white} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* MOTIVATION */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>🌿</Text>

          <Text style={styles.motivationTitle}>Small steps. Big changes.</Text>

          <Text style={styles.motivationText}>
            Consistency is more powerful than perfection.
          </Text>
        </View>
      </ScrollView>

      {/* DELETE ALERT */}
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

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: BOTTOM_BAR_HEIGHT + insets.bottom + 16,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => router.push("/CreateRegularHabit")}
      >
        <MaterialIcons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 5,
    fontWeight: "500",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },

  profileEmoji: {
    fontSize: 24,
  },

  progressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.primary,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  progressTitle: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 5,
  },

  progressCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },

  progressPercent: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginTop: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.white,
  },

  progressMessage: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 13,
  },

  streakCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 15,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },

  streakIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  streakEmoji: {
    fontSize: 22,
  },

  streakContent: {
    flex: 1,
  },

  streakTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  streakText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 17,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },

  addText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  filters: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  filter: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
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

  habitsContainer: {
    paddingHorizontal: 20,
  },

  habitCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  habitMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  habitIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  habitEmoji: {
    fontSize: 21,
  },

  habitInfo: {
    flex: 1,
  },

  habitName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  habitMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },

  habitActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  editButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },

  completeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },

  emptyButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  emptyButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },

  completedSection: {
    marginTop: 20,
  },

  completedCount: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },

  completedCountText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  completedCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },

  completedIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F8F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  completedText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },

  completedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  motivationCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#F1F8F2",
    alignItems: "center",
  },

  motivationEmoji: {
    fontSize: 26,
    marginBottom: 8,
  },

  motivationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  motivationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: "center",
  },

  fab: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
