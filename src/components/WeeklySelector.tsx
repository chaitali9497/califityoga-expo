import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/src/theme/colors";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklySelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (days: string[]) => void;
}) {
  const toggle = (day: string) => {
    onChange(
      value.includes(day)
        ? value.filter((d) => d !== day)
        : [...value, day]
    );
  };

  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      {DAYS.map((d) => (
        <TouchableOpacity
          key={d}
          onPress={() => toggle(d)}
          style={{
            padding: 10,
            borderRadius: 16,
            backgroundColor: value.includes(d)
              ? colors.primary
              : colors.inputBg,
          }}
        >
          <Text style={{ color: value.includes(d) ? "#fff" : "#555" }}>
            {d}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
