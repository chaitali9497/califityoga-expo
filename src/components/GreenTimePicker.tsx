import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { colors } from "@/src/theme/colors";

/* ---------- Types ---------- */

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
};

type Mode = "hour" | "minute";

/* ---------- Constants ---------- */

const CLOCK_SIZE = 220;
const RADIUS = 90;
const CENTER = CLOCK_SIZE / 2;

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

/* ---------- Component ---------- */

export default function GreenMaterialTimePicker({
  visible,
  onClose,
  onConfirm,
}: Props) {
  const [mode, setMode] = useState<Mode>("hour");
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(15);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  const time = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${period}`;

  /* ---------- Hand angle ---------- */
  const angle =
    mode === "hour"
      ? (hour % 12) * 30
      : (minute / 5) * 30;

  const values = mode === "hour" ? HOURS : MINUTES;

  /* ---------- Selection logic ---------- */
  const handleSelect = (value: number) => {
    if (mode === "hour") {
      setHour(value);
      setMode("minute"); // ✅ AUTO SWITCH TO MINUTES
    } else {
      setMinute(value);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* ---------- HEADER ---------- */}
          <View style={styles.header}>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <TouchableOpacity onPress={() => setMode("hour")}>
                <Text
                  style={[
                    styles.timeText,
                    mode === "hour" && styles.activeTime,
                  ]}
                >
                  {hour.toString().padStart(2, "0")}
                </Text>
              </TouchableOpacity>

              <Text style={styles.timeText}>:</Text>

              <TouchableOpacity onPress={() => setMode("minute")}>
                <Text
                  style={[
                    styles.timeText,
                    mode === "minute" && styles.activeTime,
                  ]}
                >
                  {minute.toString().padStart(2, "0")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* AM / PM */}
            <View style={styles.periodRow}>
              {(["AM", "PM"] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={[
                    styles.periodBtn,
                    period === p && styles.periodActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.periodText,
                      period === p && styles.periodTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ---------- CLOCK ---------- */}
          <View style={styles.clock}>
            {/* HAND */}
            <View
              style={[
                styles.hand,
                {
                  transform: [
                    { translateY: RADIUS / 2 },
                    { rotate: `${angle}deg` },
                    { translateY: -RADIUS / 2 },
                  ],
                },
              ]}
            />

            <View style={styles.centerDot} />

            {values.map((value, i) => {
              const theta = (i * 30 - 90) * (Math.PI / 180);
              const x = CENTER + RADIUS * Math.cos(theta) - 22;
              const y = CENTER + RADIUS * Math.sin(theta) - 22;

              const selected =
                mode === "hour"
                  ? value === hour
                  : value === minute;

              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleSelect(value)}
                  style={[
                    styles.clockNumber,
                    { left: x, top: y },
                    selected && styles.selectedNumber,
                  ]}
                >
                  <Text
                    style={[
                      styles.clockText,
                      selected && styles.selectedText,
                    ]}
                  >
                    {value.toString().padStart(2, "0")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ---------- ACTIONS ---------- */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.actionText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onConfirm(time);
                onClose();
              }}
            >
              <Text style={styles.actionText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: 320,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
  },

  header: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    alignItems: "center",
  },

  timeText: {
    fontSize: 36,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },

  activeTime: {
    color: colors.white,
    textDecorationLine: "underline",
  },

  periodRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 16,
  },

  periodBtn: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 6,
  },

  periodActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  periodText: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },

  periodTextActive: {
    color: colors.white,
  },

  clock: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    alignSelf: "center",
    marginVertical: 24,
  },

  hand: {
    position: "absolute",
    width: 2,
    height: RADIUS,
    backgroundColor: colors.primary,
    left: CENTER - 1,
    top: CENTER - RADIUS,
    borderRadius: 1,
  },

  centerDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    left: CENTER - 5,
    top: CENTER - 5,
    zIndex: 2,
  },

  clockNumber: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedNumber: {
    backgroundColor: colors.primary,
  },

  clockText: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  selectedText: {
    color: colors.white,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    gap: 28,
  },

  actionText: {
    color: colors.primary,
    fontWeight: "600",
  },
});
