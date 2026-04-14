import { ScrollView, Text, TouchableOpacity } from "react-native";
import { colors } from "@/src/theme/colors";

type Props = {
  value: number;
  onChange: (day: number) => void;
};

export default function MonthlySelector({ value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {[...Array(31)].map((_, i) => {
        const day = i + 1;
        const isSelected = value === day;

        return (
          <TouchableOpacity
            key={day}
            onPress={() => onChange(day)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 8,
              backgroundColor: isSelected
                ? colors.primary
                : colors.inputBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: isSelected ? colors.white : colors.textPrimary,
                fontWeight: "600",
              }}
            >
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}