import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { COLORS, RADIUS } from "../theme";

const LANDING_URL = "https://tribe-i.ru/efimov/landing/";
const COMMIT_HASH = process.env.EXPO_PUBLIC_COMMIT ?? "dev";

export default function AboutScreen() {
  const openLanding = () => {
    Linking.openURL(LANDING_URL);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.brand}>Командометр · самооценка для руководителя</Text>
        <Text style={styles.h1}>О приложении</Text>
        <Text style={styles.text}>
          Мобильная версия опроса самооценки процессов управления командой — тот же
          «Командометр», что живёт на лендинге, теперь на телефоне.
        </Text>

        <View style={styles.factRow}>
          <Text style={styles.factLabel}>Название</Text>
          <Text style={styles.factValue}>Командометр</Text>
        </View>
        <View style={styles.factRow}>
          <Text style={styles.factLabel}>Сборка</Text>
          <Text style={styles.commit}>{COMMIT_HASH}</Text>
        </View>

        <Pressable
          onPress={openLanding}
          style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
          accessibilityRole="link"
          accessibilityLabel="Открыть веб-версию Командометра"
        >
          <Text style={styles.linkButtonText}>Открыть веб-версию</Text>
        </Pressable>
        <Text style={styles.linkNote}>
          Ссылка открывается в браузере телефона; само приложение сетевых запросов
          не делает.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLine}>
          <Text style={styles.footerStrong}>Виктор Ефимов</Text> · CPO · 2026
        </Text>
        <Text style={styles.footerLine}>Сделано вместе с AI-агентом · по мотивам матрицы «Sierra — Развитие»</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS,
    padding: 20,
    marginBottom: 16,
  },
  brand: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: COLORS.accent,
    backgroundColor: COLORS.accentSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 12,
    overflow: "hidden",
  },
  h1: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    marginBottom: 20,
  },
  factRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: COLORS.line,
    gap: 12,
  },
  factLabel: {
    fontSize: 13,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  factValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "right",
  },
  commit: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Menlo",
    color: COLORS.accent,
    textAlign: "right",
  },
  linkButton: {
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: COLORS.text,
    paddingVertical: 13,
    alignItems: "center",
  },
  linkButtonPressed: {
    opacity: 0.88,
  },
  linkButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  linkNote: {
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.muted,
    marginTop: 10,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerLine: {
    fontSize: 13.5,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: "center",
  },
  footerStrong: {
    color: COLORS.text,
    fontWeight: "700",
  },
});
