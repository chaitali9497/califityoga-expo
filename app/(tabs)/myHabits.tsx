import { useHabits } from "@/src/context/HabitContext";
import { colors } from "@/src/theme";
import { Habit } from "@/src/types/Habit";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Dimensions,
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const HABIT_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#14B8A6", // Teal
];

const HABIT_ICONS = [
  "📚",
  "🏃",
  "💪",
  "🧘",
  "🍎",
  "💤",
  "📖",
  "🏋️",
  "🎯",
  "💧",
  "🧠",
  "🎨",
];

const sortOptions = [
  "All Habits",
  "Daily",
  "Weekly",
  "Monthly",
  "Completed Today",
];

export default function MyHabitsScreen() {
  const router = useRouter();
  const { habits } = useHabits();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("All Habits");
  const [showOptions, setShowOptions] = useState(false);

  const filteredHabits = useMemo(() => {
    let filtered = habits.filter((habit) =>
      habit.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (selectedSort !== "All Habits") {
      if (selectedSort === "Completed Today") {
        const today = new Date().toDateString();
        filtered = filtered.filter((h) => {
          const lastCompleted = h.lastCompleted
            ? new Date(h.lastCompleted).toDateString()
            : null;
          return lastCompleted === today;
        });
      } else {
        filtered = filtered.filter((h) => h.repeat === selectedSort);
      }
    }

    return filtered;
  }, [habits, searchQuery, selectedSort]);

  const habitStats = useMemo(() => {
    const completed = habits.filter((h) => {
      if (!h.lastCompleted) return false;
      const lastCompletedDate = new Date(h.lastCompleted).toDateString();
      const today = new Date().toDateString();
      return lastCompletedDate === today;
    }).length;

    return {
      total: habits.length,
      completed,
    };
  }, [habits]);

  const renderHabitCard = ({ item: habit }: { item: Habit }) => {
    const habitColor =
      habit.color || HABIT_COLORS[habits.indexOf(habit) % HABIT_COLORS.length];
    const isCompletedToday = habit.lastCompleted
      ? new Date(habit.lastCompleted).toDateString() ===
        new Date().toDateString()
      : false;

    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/(tabs)/CreateRegularHabit" })}
        style={{ marginHorizontal: 16, marginBottom: 12 }}
      >
        <View
          style={{
            backgroundColor: habitColor,
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontSize: 24,
                marginRight: 12,
              }}
            >
              {habit.icon ||
                HABIT_ICONS[habits.indexOf(habit) % HABIT_ICONS.length]}
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 4,
                }}
              >
                {habit.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.8)",
                    marginRight: 8,
                  }}
                >
                  🔥 {habit.streak}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {habit.repeat}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.3)",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 12,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontWeight: "700",
              }}
            >
              {isCompletedToday ? "✓" : "○"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const emptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 120,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 8 }}>📝</Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.textPrimary,
          marginBottom: 4,
        }}
      >
        No Habits Yet
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 16,
        }}
      >
        Create your first habit to get started
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/CreateRegularHabit")}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontWeight: "600",
            fontSize: 14,
          }}
        >
          Create Habit
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: colors.textPrimary,
              }}
            >
              My Habits
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              {habitStats.completed} of {habitStats.total} completed today
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowOptions(!showOptions)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: colors.inputBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            placeholder="Search habits..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              paddingVertical: 10,
              fontSize: 14,
              color: colors.textPrimary,
            }}
          />
        </View>
      </View>

      {/* Sort Options */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: 12 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelectedSort(option)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 6,
              marginRight: 8,
              backgroundColor:
                selectedSort === option ? colors.primary : colors.inputBg,
              borderWidth: 1,
              borderColor:
                selectedSort === option ? colors.primary : colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color:
                  selectedSort === option ? colors.white : colors.textSecondary,
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Habit List */}
      {filteredHabits.length === 0 &&
      searchQuery === "" &&
      selectedSort === "All Habits" ? (
        emptyState()
      ) : filteredHabits.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 120,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
            }}
          >
            No habits found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHabits}
          renderItem={renderHabitCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Habit Button - Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/CreateRegularHabit")}
        style={{
          position: "absolute",
          bottom: 90,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            color: colors.white,
            fontWeight: "300",
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
