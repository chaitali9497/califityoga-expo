import { colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import MonthlyMultiDatePicker from "@/src/components/MonthlyMultiDatePicker";
import MonthlySelector from "@/src/components/MonthlySelector";
import WeeklySelector from "@/src/components/WeeklySelector";
import { useHabits } from "@/src/context/HabitContext";
import { Habit } from "@/src/types/Habit";

/* ---------- ICONS ---------- */
const ICONS = [
  "🎨",
  "🏀",
  "🏆",
  "⏳",
  "📚",
  "🧘",
  "🏃",
  "💧",
  "🥗",
  "💪",
  "🧠",
  "🎧",
  "✍️",
  "📖",
  "🌱",
  "🔥",
  "🕒",
  "🎯",
  "☀️",
  "🌙",
  "🎮",
  "🎵",
  "🎯",
  "📈",
  "🧩",
  "🛏️",
  "🪴",
  "📝",
  "📅",
  "⏰",
];

/* ---------- COLORS ---------- */
const COLORS = [
  "#FEF3C7",
  "#FED7AA",
  "#A8A29E",
  "#BCAAA4",
  "#FCA5A5",
  "#FBCFE8",
  "#F472B6",
  "#C4B5FD",
  "#C7D2FE",
  "#93C5FD",
  "#9CA3AF",
  "#99F6E4",
  "#BBF7D0",
  "#A7F3D0",
  "#22C55E",
];

export default function CreateRegularHabit() {
  const router = useRouter();
  const { addHabit } = useHabits();
  const [monthlyMode, setMonthlyMode] = useState<"Single" | "Multiple">(
    "Multiple",
  );

  const [habitType, setHabitType] = useState<"Regular" | "OneTime">("Regular");
  const [habitName, setHabitName] = useState("");

  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);

  const [repeat, setRepeat] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [monthlyDates, setMonthlyDates] = useState<number[]>([]);
  const [monthlyDate, setMonthlyDate] = useState(1);

  const [time, setTime] = useState<"Morning" | "Afternoon" | "Evening">(
    "Morning",
  );

  /* ---------- ICON MODAL ---------- */
  const [showIconModal, setShowIconModal] = useState(false);
  const [search, setSearch] = useState("");
  const [tempIcon, setTempIcon] = useState(icon);

  const saveHabit = () => {
    if (!habitName.trim()) return;

    if (repeat === "Weekly" && weeklyDays.length === 0) {
      alert("Select at least one day");
      return;
    }

    if (
      repeat === "Monthly" &&
      monthlyMode === "Multiple" &&
      monthlyDates.length === 0
    ) {
      alert("Select at least one date");
      return;
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: habitName.trim(),
      icon,
      color,
      habitType,
      repeat,
      weeklyDays: repeat === "Weekly" ? weeklyDays : undefined,
      monthlyDate:
        repeat === "Monthly" && monthlyMode === "Single"
          ? monthlyDate
          : undefined,
      monthlyDates:
        repeat === "Monthly" && monthlyMode === "Multiple"
          ? monthlyDates
          : undefined,
      timeOfDay: time,
      streak: 0,
    };

    console.log("Saving habit:", habit);

    addHabit(habit);
    router.back();
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Habit</Text>
        </View>

        {/* HABIT TYPE */}
        <View style={styles.segment}>
          {["Regular", "OneTime"].map((type, index) => (
            <TouchableOpacity
              key={`${type}-${index}`}
              onPress={() => setHabitType(type as any)}
              style={[
                styles.segmentInactive,
                habitType === type && styles.segmentActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentInactiveText,
                  habitType === type && styles.segmentActiveText,
                ]}
              >
                {type === "Regular" ? "Regular Habit" : "One-Time Task"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* HABIT NAME */}
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          value={habitName}
          onChangeText={setHabitName}
          placeholder="Study Art"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        {/* ICON */}
        <View style={styles.iconHeader}>
          <Text style={styles.label}>Icon</Text>
          <TouchableOpacity onPress={() => setShowIconModal(true)}>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconGrid}>
          {ICONS.slice(0, 5).map((i, index) => (
            <TouchableOpacity
              key={`${i}-${index}`}
              onPress={() => setIcon(i)}
              style={[styles.iconBox, icon === i && styles.selectedBox]}
            >
              <Text style={styles.iconText}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* COLOR */}
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorGrid}>
          {COLORS.map((c, index) => {
            const isSelected = color === c;
            return (
              <TouchableOpacity
                key={`${c}-${index}`}
                onPress={() => setColor(c)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  isSelected && styles.selectedColorCircle,
                ]}
              >
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* REPEAT */}
        <Text style={styles.label}>Repeat</Text>
        <View style={styles.row}>
          {["Daily", "Weekly", "Monthly"].map((item, index) => (
            <TouchableOpacity
              key={`${item}-${index}`}
              onPress={() => setRepeat(item as any)}
              style={[styles.repeatBtn, repeat === item && styles.repeatActive]}
            >
              <Text
                style={[
                  styles.repeatText,
                  repeat === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {repeat === "Weekly" && (
          <>
            <Text style={styles.label}>Select Days</Text>
            <WeeklySelector value={weeklyDays} onChange={setWeeklyDays} />
          </>
        )}
        {repeat === "Monthly" && (
          <>
            <Text style={styles.label}>Monthly Type</Text>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setMonthlyMode("Multiple")}
                style={[
                  styles.repeatBtn,
                  monthlyMode === "Multiple" && styles.repeatActive,
                ]}
              >
                <Text
                  style={[
                    styles.repeatText,
                    monthlyMode === "Multiple" && styles.activeText,
                  ]}
                >
                  On these days
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMonthlyMode("Single")}
                style={[
                  styles.repeatBtn,
                  monthlyMode === "Single" && styles.repeatActive,
                ]}
              >
                <Text
                  style={[
                    styles.repeatText,
                    monthlyMode === "Single" && styles.activeText,
                  ]}
                >
                  One day
                </Text>
              </TouchableOpacity>
            </View>

            {monthlyMode === "Multiple" && (
              <>
                {monthlyDates.length > 0 && (
                  <Text
                    style={{ color: colors.textSecondary, marginBottom: 8 }}
                  >
                    Every month on {monthlyDates.join(", ")}
                  </Text>
                )}

                <MonthlyMultiDatePicker
                  selectedDates={monthlyDates}
                  onChange={setMonthlyDates}
                />
              </>
            )}

            {monthlyMode === "Single" && (
              <MonthlySelector value={monthlyDate} onChange={setMonthlyDate} />
            )}
          </>
        )}

        {/* TIME */}
        <Text style={styles.label}>Do it at</Text>
        <View style={styles.row}>
          {["Morning", "Afternoon", "Evening"].map((t, index) => (
            <TouchableOpacity
              key={`${t}-${index}`}
              onPress={() => setTime(t as any)}
              style={[styles.timeBtn, time === t && styles.timeActive]}
            >
              <Text style={[styles.timeText, time === t && styles.activeText]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SAVE */}
        <TouchableOpacity
          style={[styles.saveBtn, !habitName.trim() && { opacity: 0.5 }]}
          disabled={!habitName.trim()}
          onPress={saveHabit}
        >
          <Text style={styles.saveText}>Save Habit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ICON MODAL */}
      <Modal visible={showIconModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Icon</Text>

            <View style={styles.searchBox}>
              <TextInput
                placeholder="Search icon"
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <ScrollView style={{ maxHeight: 280 }}>
              <View style={styles.iconGrid}>
                {ICONS.filter((i) => i.includes(search)).map((i, index) => (
                  <TouchableOpacity
                    key={`${i}-${index}`}
                    onPress={() => setTempIcon(i)}
                    style={[
                      styles.iconBox,
                      tempIcon === i && styles.selectedBox,
                    ]}
                  >
                    <Text style={styles.iconText}>{i}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setShowIconModal(false)}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.okBtn}
                onPress={() => {
                  setIcon(tempIcon);
                  setShowIconModal(false);
                }}
              >
                <Text style={{ color: colors.white, fontWeight: "600" }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 22,
    color: colors.textPrimary,
    gap: 8,
    paddingRight: 22,
  },

  segment: {
    flexDirection: "row",
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  segmentActive: { backgroundColor: colors.primary },
  segmentInactive: { flex: 1, paddingVertical: 10, borderRadius: 12 },
  segmentActiveText: {
    color: colors.white,
    fontWeight: "600",
    textAlign: "center",
  },
  segmentInactiveText: { textAlign: "center", color: colors.textSecondary },

  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 14,
    marginBottom: 6,
    fontWeight: "600",
  },

  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  iconHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAll: { color: colors.primary, fontWeight: "600" },

  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconText: { fontSize: 20 },
  selectedBox: { borderColor: colors.primary, borderWidth: 2 },

  colorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedColorCircle: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  checkContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    // backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  row: { flexDirection: "row", gap: 10, marginTop: 6 },

  repeatBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
  },
  repeatActive: { backgroundColor: colors.primary },
  repeatText: { color: colors.textSecondary },

  timeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: colors.inputBg,
    alignItems: "center",
  },
  timeActive: { backgroundColor: colors.primary },
  timeText: { color: colors.textSecondary },

  activeText: { color: colors.white, fontWeight: "600" },

  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 30,
    marginBottom: 40,
  },
  saveText: { color: colors.white, textAlign: "center", fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 14,
  },
  searchBox: {
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  okBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
