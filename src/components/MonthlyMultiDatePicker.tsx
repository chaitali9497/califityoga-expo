import { View, Text, TouchableOpacity } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { colors } from "@/src/theme/colors";

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type Props = {
  selectedDates: number[];
  onChange: Dispatch<SetStateAction<number[]>>;
};

export default function MonthlyMultiDatePicker({
  selectedDates,
  onChange,
}: Props) {
  const toggleDate = (day: number) => {
    onChange(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Week Header */}
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {WEEK_DAYS.map(d => (
          <Text
            key={d}
            style={{
              flex: 1,
              textAlign: "center",
              color: colors.textSecondary,
              fontWeight: "600",
            }}
          >
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {[...Array(31)].map((_, i) => {
          const day = i + 1;
          const isSelected = selectedDates.includes(day);

          return (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDate(day)}
              style={{
                width: "14.28%",
                height: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isSelected
                    ? colors.primary
                    : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: isSelected
                      ? colors.white
                      : colors.textPrimary,
                    fontWeight: "600",
                  }}
                >
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}