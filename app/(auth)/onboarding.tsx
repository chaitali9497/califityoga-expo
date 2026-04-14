import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

/* ---------- SLIDES ---------- */

const slides = [
  {
    id: 1,
    title: "Welcome to Califitoga",
    subtitle:
      "Your holistic fitness companion for strength, balance, and wellness.",
    image: require("../../assets/images/yoga.png"),
  },
  {
    id: 2,
    title: "Explore Powerful Features",
    subtitle:
      "Track progress, stay motivated, and build healthy habits every day.",
    image: require("../../assets/images/office-stretching.png"),
  },
  {
    id: 3,
    title: "Unlock Your Full Potential",
    subtitle:
      "Start your journey towards a healthier and stronger you today.",
    image: require("../../assets/images/handstand.png"),
  },
];

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  /* ---------- VIEWABILITY ---------- */

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0]?.index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  /* ---------- SAFE SCROLL (WEB FIX) ---------- */

  const scrollTo = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
  };

  /* ---------- ACTIONS ---------- */

  const next = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollTo(nextIndex);
      setCurrentIndex(nextIndex);
    } else {
      router.replace("/(auth)/welcome");
    }
  };

  const skipToEnd = () => {
    const lastIndex = slides.length - 1;
    scrollTo(lastIndex);
    setCurrentIndex(lastIndex);
  };

  /* ---------- RENDER ITEM ---------- */

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        {/* TOP GREEN SECTION */}
        <View style={styles.topContainer}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>

        {/* WHITE CARD */}
        <View style={styles.bottomCard}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={() => {}}
      />

      {/* ---------- INDICATOR ---------- */}
      <View style={styles.indicatorWrapper}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: currentIndex === i ? 20 : 8,
                backgroundColor:
                  currentIndex === i ? "#2E7D32" : "#C8E6C9",
              },
            ]}
          />
        ))}
      </View>

      {/* ---------- FOOTER ---------- */}
      <View style={styles.footer}>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={skipToEnd} hitSlop={10}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity style={styles.button} onPress={next}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1
              ? "Get Started"
              : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  slide: {
    width,
    flex: 1,
  },

  topContainer: {
    height: height * 0.6,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },

  image: {
    width: width * 0.7,
    height: width * 0.7,
    maxWidth: 300,
    maxHeight: 300,
  },

  bottomCard: {
    position: "absolute",
    bottom: height * 0.18,
    width: "100%",
    height: height * 0.25,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 32,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F7A1F",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: "#5F6F5F",
    textAlign: "center",
    lineHeight: 24,
  },

  indicatorWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 120 : 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  footer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 24,
    width: "100%",
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  skip: {
    fontSize: 16,
    color: "#7CB342",
    fontWeight: "500",
    padding: 8,
  },

  button: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    minWidth: 140,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
