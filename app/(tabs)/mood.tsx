import BottomBar from "@/src/components/BottomBar";
import { colors } from "@/src/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/* ---------- CONSTANTS ---------- */

const BOTTOM_BAR_HEIGHT = 74;

const MOODS = [
  { key: "great", emoji: "😍", label: "Great" },
  { key: "good", emoji: "😊", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "notGood", emoji: "😢", label: "Not Good" },
  { key: "bad", emoji: "😠", label: "Bad" },
];

const FEELINGS = [
  "Happy",
  "Brave",
  "Motivated",
  "Creative",
  "Confident",
  "Calm",
  "Grateful",
  "Peaceful",
  "Excited",
  "Loved",
  "Hopeful",
  "Inspired",
  "Proud",
  "Euphoric",
  "Nostalgic",
];

/* ---------- HELPER FUNCTIONS ---------- */

const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const getMonthName = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const getDateKey = (date: Date, day: number): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${year}-${month}-${dayStr}`;
};

const getMoodEmoji = (mood: string) => {
  const moodObj = MOODS.find((m) => m.key === mood);
  return moodObj?.emoji || "💭";
};

/* ---------- COMPONENT ---------- */

export default function MoodStatScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState<
    Record<string, { mood: string; feeling?: string }>
  >({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setShowMoodPicker(true);
  };

  const handleSelectMood = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodPicker(false);
    setShowFeelingPicker(true);
  };

  const handleSelectFeeling = (feeling: string) => {
    if (selectedDay !== null && selectedMood) {
      const dateKey = getDateKey(currentDate, selectedDay);
      setMoodData((prev) => ({
        ...prev,
        [dateKey]: { mood: selectedMood, feeling },
      }));
    }
    setShowFeelingPicker(false);
    setShowMoodPicker(false);
    setSelectedDay(null);
    setSelectedMood(null);
  };

  const handleSkipFeeling = () => {
    if (selectedDay !== null && selectedMood) {
      const dateKey = getDateKey(currentDate, selectedDay);
      setMoodData((prev) => ({
        ...prev,
        [dateKey]: { mood: selectedMood },
      }));
    }
    setShowFeelingPicker(false);
    setShowMoodPicker(false);
    setSelectedDay(null);
    setSelectedMood(null);
  };

  const getMoodForDay = (day: number) => {
    const dateKey = getDateKey(currentDate, day);
    return moodData[dateKey]?.mood || null;
  };

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: BOTTOM_BAR_HEIGHT + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <Ionicons name="leaf" size={24} color={colors.primary} />
          <Text style={styles.title}>Mood Stat</Text>
          <TouchableOpacity>
            <MaterialIcons
              name="schedule"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* ---------- MONTH NAVIGATION ---------- */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <MaterialIcons name="chevron-left" size={28} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{getMonthName(currentDate)}</Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <MaterialIcons name="chevron-right" size={28} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* ---------- WEEKDAY LABELS ---------- */}
        <View style={styles.weekDaysRow}>
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <Text key={day} style={styles.weekDayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {/* ---------- CALENDAR GRID ---------- */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.emptyCell} />;
            }

            const mood = getMoodForDay(day);
            const dateKey = getDateKey(currentDate, day);
            const feeling = moodData[dateKey]?.feeling;
            const emoji = mood ? getMoodEmoji(mood) : "💭";
            const label = mood
              ? MOODS.find((m) => m.key === mood)?.label
              : "Mood";

            return (
              <TouchableOpacity
                key={day}
                style={styles.dayCell}
                onPress={() => handleSelectDay(day)}
              >
                <Text style={styles.dayEmoji}>{emoji}</Text>
                <Text style={styles.dayLabel}>{label}</Text>
                {feeling && <Text style={styles.dayFeeling}>{feeling}</Text>}
                <Text style={styles.dayNumber}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ---------- MOOD PICKER MODAL ---------- */}
      <Modal transparent visible={showMoodPicker} animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => {
            setShowMoodPicker(false);
            setSelectedDay(null);
          }}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How is your mood today?</Text>

            <View style={styles.moodGrid}>
              {MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.key}
                  style={styles.moodOption}
                  onPress={() => handleSelectMood(mood.key)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ---------- FEELING PICKER MODAL ---------- */}
      <Modal transparent visible={showFeelingPicker} animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => {
            setShowFeelingPicker(false);
          }}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedMood
                ? MOODS.find((m) => m.key === selectedMood)?.emoji
                : ""}{" "}
              How would you describe
            </Text>
            <Text style={styles.modalSubtitle}>your feelings?</Text>

            <ScrollView
              style={styles.feelingsScrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.feelingsGrid}>
                {FEELINGS.map((feeling, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.feelingOption}
                    onPress={() => handleSelectFeeling(feeling)}
                  >
                    <Text style={styles.feelingLabel}>{feeling}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleSkipFeeling}
            >
              <Text style={styles.confirmButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ---------- BOTTOM BAR ---------- */}
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  weekDayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    width: "14.28%",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginRight: 0,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyCell: {
    width: "14.28%",
    aspectRatio: 1,
    marginBottom: 16,
  },
  dayEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dayFeeling: {
    fontSize: 8,
    fontWeight: "400",
    color: colors.textMuted,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 28,
    textAlign: "center",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  moodOption: {
    width: "28%",
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.inputBg,
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 0,
  },
  feelingsScrollView: {
    maxHeight: 300,
    marginBottom: 20,
  },
  feelingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  feelingOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  feelingLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
});
