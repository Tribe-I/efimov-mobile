import { useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen";
import AboutScreen from "./src/screens/AboutScreen";
import { COLORS } from "./src/theme";

type Screen = "home" | "about";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setScreen("home")}
          style={[styles.tab, screen === "home" && styles.tabActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: screen === "home" }}
        >
          <Text style={[styles.tabText, screen === "home" && styles.tabTextActive]}>
            Главная
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setScreen("about")}
          style={[styles.tab, screen === "about" && styles.tabActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: screen === "about" }}
        >
          <Text style={[styles.tabText, screen === "about" && styles.tabTextActive]}>
            О приложении
          </Text>
        </Pressable>
      </View>
      {screen === "home" ? <HomeScreen /> : <AboutScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderColor: COLORS.line,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },
  tabActive: {
    backgroundColor: COLORS.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.muted,
  },
  tabTextActive: {
    color: "#ffffff",
  },
});
