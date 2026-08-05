import { colors } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AppAlert from "@/src/components/AppAlert";
import MonthlyMultiDatePicker from "@/src/components/MonthlyMultiDatePicker";
import MonthlySelector from "@/src/components/MonthlySelector";
import WeeklySelector from "@/src/components/WeeklySelector";
import { Habit } from "@/src/types/Habit";

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

type HabitFormProps = {
  initialValues?: Habit;
  title: string;
  submitLabel: string;
  onSubmit: (habit: Habit) => Promise<void>;
};

export default function HabitForm({
  initialValues,
  title,
  submitLabel,
  onSubmit,
}: HabitFormProps) {
  const [habitType, setHabitType] = useState<"Regular" | "OneTime">(
    initialValues?.habitType || "Regular",
  );
  const [habitName, setHabitName] = useState(initialValues?.name || "");
  const [icon, setIcon] = useState(initialValues?.icon || ICONS[0]);
  const [color, setColor] = useState(initialValues?.color || COLORS[0]);
  const [repeat, setRepeat] = useState<"Daily" | "Weekly" | "Monthly">(
    initialValues?.repeat || "Daily",
  );
  const [weeklyDays, setWeeklyDays] = useState<string[]>(
    initialValues?.weeklyDays || [],
  );
  const [monthlyMode, setMonthlyMode] = useState<"Single" | "Multiple">(
    initialValues?.monthlyDates?.length
      ? "Multiple"
      : initialValues?.monthlyDate
        ? "Single"
        : "Multiple",
  );
  const [monthlyDates, setMonthlyDates] = useState<number[]>(
    initialValues?.monthlyDates || [],
  );
  const [monthlyDate, setMonthlyDate] = useState(
    initialValues?.monthlyDate || 1,
  );
  const [time, setTime] = useState<"Morning" | "Afternoon" | "Evening">(
    initialValues?.timeOfDay || "Morning",
  );
  const [reminderTime, setReminderTime] = useState(
    initialValues?.reminderTime || "",
  );
  const [showIconModal, setShowIconModal] = useState(false);
  const [search, setSearch] = useState("");
  const [tempIcon, setTempIcon] = useState(icon);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialValues) return;

    setHabitType(initialValues.habitType || "Regular");
    setHabitName(initialValues.name || "");
    setIcon(initialValues.icon || ICONS[0]);
    setColor(initialValues.color || COLORS[0]);
    setRepeat(initialValues.repeat || "Daily");
    setWeeklyDays(initialValues.weeklyDays || []);
    setMonthlyMode(
      initialValues.monthlyDates?.length
        ? "Multiple"
        : initialValues.monthlyDate
          ? "Single"
          : "Multiple",
    );
    setMonthlyDates(initialValues.monthlyDates || []);
    setMonthlyDate(initialValues.monthlyDate || 1);
    setTime(initialValues.timeOfDay || "Morning");
    setReminderTime(initialValues.reminderTime || "");
  }, [initialValues]);

  useEffect(() => {
    setTempIcon(icon);
  }, [icon]);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "warning" | "error" | "info";
    title: string;
    message: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const closeAlert = () => {
    setAlertConfig((current) => ({ ...current, visible: false }));
  };

  const handleSave = async () => {
    if (!habitName.trim()) {
      setAlertConfig({
        visible: true,
        type: "warning",
        title: "Missing Habit Name",
        message: "Please enter a habit name.",
        confirmText: "Got it",
        onConfirm: closeAlert,
      });
      return;
    }

    if (repeat === "Weekly" && weeklyDays.length === 0) {
      setAlertConfig({
        visible: true,
        type: "warning",
        title: "Missing Days",
        message: "Select at least one day for a weekly habit.",
        confirmText: "OK",
        onConfirm: closeAlert,
      });
      return;
    }

    if (
      repeat === "Monthly" &&
      monthlyMode === "Multiple" &&
      monthlyDates.length === 0
    ) {
      setAlertConfig({
        visible: true,
        type: "warning",
        title: "Missing Dates",
        message: "Select at least one date for a monthly habit.",
        confirmText: "OK",
        onConfirm: closeAlert,
      });
      return;
    }

    const habit: Habit = {
      ...initialValues,
      id: initialValues?.id,
      _id: initialValues?._id,
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
      reminderTime: reminderTime || undefined,
      streak: initialValues?.streak ?? 0,
      longestStreak: initialValues?.longestStreak,
      lastCompleted: initialValues?.lastCompleted ?? null,
      completionHistory: initialValues?.completionHistory,
    };

    setSaving(true);
    try {
      await onSubmit(habit);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.segment}>
          {[
            { value: "Regular", label: "Regular Habit" },
            { value: "OneTime", label: "One-Time Task" },
          ].map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setHabitType(type.value as any)}
              style={[
                styles.segmentInactive,
                habitType === type.value && styles.segmentActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentInactiveText,
                  habitType === type.value && styles.segmentActiveText,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          value={habitName}
          onChangeText={setHabitName}
          placeholder="Study Art"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

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

        <Text style={styles.label}>Repeat</Text>
        <View style={styles.row}>
          {["Daily", "Weekly", "Monthly"].map((item) => (
            <TouchableOpacity
              key={item}
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

        <Text style={styles.label}>Do it at</Text>
        <View style={styles.row}>
          {["Morning", "Afternoon", "Evening"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTime(t as any)}
              style={[styles.timeBtn, time === t && styles.timeActive]}
            >
              <Text style={[styles.timeText, time === t && styles.activeText]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Reminder Time</Text>
        <TextInput
          value={reminderTime}
          onChangeText={setReminderTime}
          placeholder="08:00"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.saveBtn,
            (!habitName.trim() || saving) && { opacity: 0.5 },
          ]}
          disabled={!habitName.trim() || saving}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>
            {saving ? `${submitLabel}...` : submitLabel}
          </Text>
        </TouchableOpacity>
      </ScrollView>

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

      <AppAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={() => {
          alertConfig.onConfirm?.();
          closeAlert();
        }}
        onCancel={() => {
          alertConfig.onCancel?.();
          closeAlert();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
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
