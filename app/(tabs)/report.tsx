import { useHabits } from "@/src/context/HabitContext";
import { colors } from "@/src/theme";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { getReport } from "@/src/services/reportService";
import { getMoods } from "@/src/services/moodService";
import Svg, { Line, Path, Circle } from "react-native-svg";

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
  type ReportData = {
    totalHabits: number;
    completedToday: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    perfectDays: number;
  };

  const { habits } = useHabits();
  const [selectedTab, setSelectedTab] = useState<TabKey>("THIS_WEEK");
  const { user } = useAuth();
  const [report, setReport] = useState<ReportData | null>(null);
  type MoodEntry = {
  _id?: string;
  date: string;
  mood: string;
  feeling?: string;
  note?: string;
};

const [moods, setMoods] = useState<MoodEntry[]>([]);

useEffect(() => {
  const loadData = async () => {
    try {
      const [reportData, moodData] = await Promise.all([
        getReport(),
        getMoods(),
      ]);

      setReport(reportData);
      setMoods(Array.isArray(moodData) ? moodData : []);
    } catch (error) {
      console.error("Failed to load report data", error);
    }
  };

  loadData();
}, []);

  const stats = {
    streak: report?.currentStreak || 0,
    completionRate: report?.completionRate || 0,
    totalHabits: report?.totalHabits || 0,
    perfectDays: report?.perfectDays || 0,
    longestStreak: report?.longestStreak || 0,
  };

  // Mock data for charts
// Real chart data from completionHistory
const last7Days = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - index));
  return date.toISOString().split("T")[0];
});

const chartData = last7Days.map((day) => {
  let count = 0;

  habits.forEach((habit) => {
    const completedOnDay =
      habit.completionHistory?.some((entry) => {
        const completedDate =
          new Date(entry)
            .toISOString()
            .split("T")[0];

        return completedDate === day;
      }) || false;

    if (completedOnDay) count += 1;
  });

  return count;
});

const maxValue = Math.max(...chartData, 1);

// Completion rate chart can still stay simple for now
const completionRateData = last7Days.map(() => stats.completionRate);

  const renderStatCard = (
    label: string,
    value: string | number,
    unit?: string
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
        <Text style={{ fontSize: 24, fontWeight: "700", color: colors.textPrimary }}>
          {value}
        </Text>
        {unit && (
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 4 }}>
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
                    backgroundColor: isHighlighted ? colors.primary : colors.border,
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
  {last7Days.map((day) => {
    const label = new Date(day).toLocaleDateString("en-US", {
      weekday: "short",
    });

    return (
      <Text
        key={day}
        style={{
          fontSize: 10,
          color: colors.textMuted,
          flex: 1,
          textAlign: "center",
        }}
      >
        {label[0]}
      </Text>
    );
  })}
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
          <Svg width="100%" height="100%" viewBox={`0 0 ${width - 32} 120`}>
            {/* Grid lines */}
            <Line x1="0" y1="30" x2={width - 32} y2="30" stroke={colors.border} strokeWidth="1" />
            <Line x1="0" y1="60" x2={width - 32} y2="60" stroke={colors.border} strokeWidth="1" />

            {/* Path */}
            <Path d={`M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`} stroke={colors.primary} strokeWidth="2" fill="none" />

            {/* Fill area */}
            <Path d={`M ${points[0].x},${points[0].y} L ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L ${points[points.length - 1].x},120 L 0,120 Z`} fill={`${colors.primary}40`} />

            {/* Points */}
            {points.map((point, i) => (
              <Circle key={i} cx={point.x} cy={point.y} r="4" fill={i === points.length - 1 ? colors.primary : colors.background} stroke={colors.primary} strokeWidth="2" />
            ))}
          </Svg>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <Text key={i} style={{ fontSize: 10, color: colors.textMuted }}>{day}</Text>
          ))}
        </View>
      </View>
    );
  };

  const renderCalendarStats = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const firstDay = new Date(year, month, 1).getDay();

    // Sunday-first layout
    const offset = firstDay;

    // only render actual used cells
    const totalCells = offset + daysInMonth;

    // collect completed dates only for current month/year
    const completedDays = new Set(
      habits.flatMap((habit) =>
        habit.completionHistory
          ?.map((date) => new Date(date))
          .filter((d) => d.getFullYear() === year && d.getMonth() === month)
          .map((d) => d.getDate()) || []
      )
    );

    return (
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        {/* Week labels */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          {["Su", "M", "T", "W", "Th", "F", "Sa"].map((day) => (
            <Text key={day} style={{ fontSize: 10, color: colors.textMuted, width: (width - 56) / 7, textAlign: "center", fontWeight: "600" }}>{day}</Text>
          ))}
        </View>

        {/* Calendar box */}
        <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {Array.from({ length: totalCells }, (_, idx) => {
              const dayNumber = idx - offset + 1;

              const isDay = dayNumber >= 1 && dayNumber <= daysInMonth;

              const isCompleted = isDay && completedDays.has(dayNumber);

              const isToday = isDay && dayNumber === today;

              return (
                <View key={idx} style={{ width: (width - 56) / 7, aspectRatio: 1, justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
                  {isDay ? (
                    <View style={{ width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center", backgroundColor: isToday ? colors.primary : isCompleted ? `${colors.primary}20` : "transparent", borderWidth: isToday ? 0 : isCompleted ? 1.5 : 1, borderColor: isToday ? colors.primary : isCompleted ? colors.primary : colors.border }}>
                      <Text style={{ fontSize: 12, fontWeight: isToday || isCompleted ? "700" : "500", color: isToday ? colors.white : isCompleted ? colors.primary : colors.textMuted }}>{dayNumber}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

 const renderMoodChart = () => {
  const moodLabels = ["Terrible", "Bad", "Okay", "Good", "Great"];
  const moodEmojiMap: Record<string, string> = {
    Terrible: "😢",
    Bad: "😕",
    Okay: "😐",
    Good: "🙂",
    Great: "😊",
  };

  const moodCounts = {
    Terrible: 0,
    Bad: 0,
    Okay: 0,
    Good: 0,
    Great: 0,
  };

  moods.forEach((entry) => {
    const mood = entry.mood?.trim();
    if (
      mood === "Terrible" ||
      mood === "Bad" ||
      mood === "Okay" ||
      mood === "Good" ||
      mood === "Great"
    ) {
      moodCounts[mood]++;
    }
  });

  const moodData = moodLabels.map(
    (label) => moodCounts[label as keyof typeof moodCounts]
  );

  const maxMood = Math.max(...moodData, 1);

  return (
    <View
      style={{
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
      }}
    >
      {moodData.every((value) => value === 0) ? (
        <Text
          style={{
            fontSize: 13,
            color: colors.textMuted,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          No mood data yet
        </Text>
      ) : (
        <>
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
                <View
                  key={index}
                  style={{ alignItems: "center" }}
                >
                  <View
                    style={{
                      width: 30,
                      height: height || 4,
                      backgroundColor: colors.primary,
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  />
                  <Text style={{ fontSize: 20 }}>
                    {moodEmojiMap[moodLabels[index]]}
                  </Text>
                </View>
              );
            })}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {moodLabels.map((label) => (
              <Text
                key={label}
                style={{
                  fontSize: 10,
                  color: colors.textMuted,
                }}
              >
                {label}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.textPrimary }}>
            {user?.name ? `${user.name}'s Report` : "Report"}
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
          {renderStatCard("Longest Streak", stats.longestStreak, "days")}
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
                backgroundColor: selectedTab === key ? colors.primary : colors.inputBg,
              }}
            >
              <Text style={{ fontSize: 12, color: selectedTab === key ? colors.white : colors.textSecondary, fontWeight: "500" }}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Habits Completed Chart */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textPrimary }}>Habits Completed</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>{selectedTab} ↓</Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderBarChart()}
      </View>

      {/* Habit Completion Rate */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textPrimary }}>Habit Completion Rate</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>Last 6 Months ↓</Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderLineChart()}
      </View>

      {/* Calendar Stats */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textPrimary }}>Calendar Stats</Text>
        </View>
        {renderCalendarStats()}
      </View>

      {/* Mood Chart */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textPrimary }}>Mood Chart</Text>
        </View>
        {renderMoodChart()}
      </View>
    </ScrollView>
  );
}
