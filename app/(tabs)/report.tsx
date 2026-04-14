import { useHabits } from "@/src/context/HabitContext";
import { colors } from "@/src/theme";
import React, { useMemo, useState } from "react";
import {
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const TABS = {
  TODAY: "Today",
  THIS_WEEK: "This Week",
  THIS_MONTH: "This Month",
  LAST_MONTH: "Last Month",
  LAST_6_MONTHS: "Last 6 Months",
  ALL_TIME: "All Time",
} as const;

type TabKey = keyof typeof TABS;

export default function ReportScreen() {
  const { habits } = useHabits();
  const [selectedTab, setSelectedTab] = useState<TabKey>("THIS_WEEK");

  const stats = useMemo(() => {
    const currentDate = new Date();
    const completionRate =
      habits.length > 0
        ? Math.round(
            (habits.filter((h) => h.lastCompleted).length / habits.length) *
              100,
          )
        : 0;
    const totalCompletions = habits.reduce(
      (sum, h) => sum + (h.streak || 0),
      0,
    );
    const perfectDays = Math.floor(
      totalCompletions / Math.max(habits.length, 1),
    );

    return {
      streak:
        habits.length > 0
          ? Math.max(...habits.map((h) => h.streak || 0), 0)
          : 0,
      completionRate,
      totalHabits: habits.length,
      perfectDays,
    };
  }, [habits]);

  // Mock data for charts
  const chartData = [
    7, 5, 8, 6, 9, 7, 8, 6, 9, 8, 7, 6, 8, 5, 9, 7, 8, 6, 7, 8, 9, 6,
  ];
  const maxValue = Math.max(...chartData);
  const completionRateData = [70, 72, 68, 75, 78, 72, 75];

  const renderStatCard = (
    label: string,
    value: string | number,
    unit?: string,
  ) => (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text
          style={{ fontSize: 24, fontWeight: "700", color: colors.textPrimary }}
        >
          {value}
        </Text>
        {unit && (
          <Text
            style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 4 }}
          >
            {unit}
          </Text>
        )}
      </View>
    </View>
  );

  const renderBarChart = () => {
    const displayData = chartData.slice(0, 14); // Show 2 weeks

    return (
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: 200,
            marginBottom: 12,
          }}
        >
          {displayData.map((value, index) => {
            const height = (value / maxValue) * 150;
            const isHighlighted = index === displayData.length - 1;

            return (
              <View key={index} style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: "60%",
                    height,
                    backgroundColor: isHighlighted
                      ? colors.primary
                      : colors.border,
                    borderRadius: 4,
                  }}
                />
              </View>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 4,
          }}
        >
          <Text style={{ fontSize: 10, color: colors.textMuted }}>S</Text>
          <Text style={{ fontSize: 10, color: colors.textMuted }}>M</Text>
          <Text style={{ fontSize: 10, color: colors.textMuted }}>T</Text>
          <Text style={{ fontSize: 10, color: colors.textMuted }}>W</Text>
          <Text style={{ fontSize: 10, color: colors.textMuted }}>T</Text>
          <Text style={{ fontSize: 10, color: colors.textMuted }}>F</Text>
          <Text style={{ fontSize: 10, color: colors.textMuted }}>S</Text>
        </View>
      </View>
    );
  };

  const renderLineChart = () => {
    const points = completionRateData.map((val, i) => ({
      x: (i / (completionRateData.length - 1)) * (width - 32),
      y: 120 - (val / 100) * 100,
    }));

    return (
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <View
          style={{
            height: 120,
            marginBottom: 12,
            backgroundColor: "rgba(46, 204, 113, 0.05)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${width - 32} 120`}>
            {/* Grid lines */}
            <line
              x1="0"
              y1="30"
              x2={width - 32}
              y2="30"
              stroke={colors.border}
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="60"
              x2={width - 32}
              y2="60"
              stroke={colors.border}
              strokeWidth="1"
            />

            {/* Path */}
            <path
              d={`M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`}
              stroke={colors.primary}
              strokeWidth="2"
              fill="none"
            />

            {/* Fill area */}
            <path
              d={`M ${points[0].x},${points[0].y} L ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L ${points[points.length - 1].x},120 L 0,120 Z`}
              fill={`${colors.primary}40`}
            />

            {/* Points */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={
                  i === points.length - 1 ? colors.primary : colors.background
                }
                stroke={colors.primary}
                strokeWidth="2"
              />
            ))}
          </svg>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <Text key={i} style={{ fontSize: 10, color: colors.textMuted }}>
              {day}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderCalendarStats = () => {
    const daysInMonth = 31; // December
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const completedDays = daysArray.filter(() => Math.random() > 0.4); // Mock data

    return (
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.textMuted }}>
            ◀ December 2024 ▶
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Text
              key={day}
              style={{
                fontSize: 10,
                color: colors.textMuted,
                width: (width - 32) / 7,
                textAlign: "center",
              }}
            >
              {day.substring(0, 1)}
            </Text>
          ))}
        </View>
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {daysArray.map((day) => {
              const isCompleted = completedDays.includes(day);
              return (
                <View
                  key={day}
                  style={{
                    width: (width - 32 - 24) / 7,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: isCompleted ? colors.primary : colors.border,
                    backgroundColor: isCompleted
                      ? `${colors.primary}20`
                      : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: isCompleted ? colors.primary : colors.textMuted,
                    }}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderMoodChart = () => {
    const moods = ["😢", "😕", "😐", "🙂", "😊"];
    const moodData = [2, 3, 5, 8, 6]; // Mock data
    const maxMood = Math.max(...moodData);

    return (
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 24 }}>
        <View
          style={{
            height: 150,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-around",
          }}
        >
          {moodData.map((value, index) => {
            const height = (value / maxMood) * 120;
            return (
              <View key={index} style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 30,
                    height,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />
                <Text style={{ fontSize: 20 }}>{moods[index]}</Text>
              </View>
            );
          })}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {["Su", "M", "T", "W", "Th", "F", "Sa"].map((day, i) => {
            if (i < moodData.length) {
              return (
                <Text
                  key={day}
                  style={{ fontSize: 10, color: colors.textMuted }}
                >
                  {day}
                </Text>
              );
            }
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Header */}
      <View
        style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: colors.textPrimary,
            }}
          >
            Report
          </Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 24, color: colors.textSecondary }}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          {renderStatCard("Current Streak", stats.streak, "days")}
          {renderStatCard("Completion Rate", `${stats.completionRate}%`)}
        </View>
        <View style={{ flexDirection: "row" }}>
          {renderStatCard("Habits Completed", stats.totalHabits)}
          {renderStatCard("Perfect Days", stats.perfectDays)}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.entries(TABS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedTab(key as TabKey)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 6,
                marginRight: 8,
                backgroundColor:
                  selectedTab === key ? colors.primary : colors.inputBg,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color:
                    selectedTab === key ? colors.white : colors.textSecondary,
                  fontWeight: "500",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Habits Completed Chart */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.textPrimary,
              }}
            >
              Habits Completed
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                {selectedTab} ↓
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderBarChart()}
      </View>

      {/* Habit Completion Rate */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.textPrimary,
              }}
            >
              Habit Completion Rate
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                Last 6 Months ↓
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderLineChart()}
      </View>

      {/* Calendar Stats */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.textPrimary,
            }}
          >
            Calendar Stats
          </Text>
        </View>
        {renderCalendarStats()}
      </View>

      {/* Mood Chart */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.textPrimary,
            }}
          >
            Mood Chart
          </Text>
        </View>
        {renderMoodChart()}
      </View>
    </ScrollView>
  );
}
