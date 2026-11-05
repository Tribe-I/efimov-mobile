import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ScrollViewInstance,
} from "react-native";

import { QUESTIONS } from "../data/questions";
import { levelFor } from "../data/levels";
import { COLORS, RADIUS, SCALE_LABELS, SCALE_SEGMENTS } from "../theme";

const TOTAL = QUESTIONS.length;

type Answers = (number | null)[];

function calcScore(answers: Answers): number | null {
  const answered = answers.filter((v) => v !== null);
  if (answered.length === 0) return null;
  const sum = answered.reduce((acc, v) => acc + (v ?? 0), 0);
  return (sum / answered.length) * 2.5;
}

export default function HomeScreen() {
  const [answers, setAnswers] = useState<Answers>(Array(TOTAL).fill(null));
  const [scaleWidth, setScaleWidth] = useState(0);
  const scrollRef = useRef<ScrollViewInstance>(null);

  const answeredCount = answers.filter((v) => v !== null).length;
  const score = calcScore(answers);
  const done = answeredCount === TOTAL;
  const level = score === null ? null : levelFor(score);

  const select = (qi: number, oi: number) => {
    setAnswers((prev) => {
      const next = prev.slice();
      next[qi] = oi;
      return next;
    });
  };

  const restart = () => {
    setAnswers(Array(TOTAL).fill(null));
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const markerLeft =
    score === null || scaleWidth === 0
      ? null
      : (Math.min(100, score * 10) / 100) * scaleWidth;

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Шапка лендинга */}
      <View style={styles.header}>
        <Text style={styles.brand}>Командометр · самооценка для руководителя</Text>
        <Text style={styles.h1}>Система контроля качества процессов управления командой</Text>
        <Text style={styles.lead}>
          13 вопросов по мотивам матрицы Sierra: церемонии, Jira, планирование, люди.
          Выберите в каждом вопросе вариант, который честнее всего описывает вашу команду
          сейчас. Ответы никуда не отправляются — весь подсчёт происходит на устройстве.
        </Text>
      </View>

      {/* Дашборд (на мобильном — над опросом, как в лендинге на узком экране) */}
      <View style={styles.dashboard}>
        <Text style={styles.dashLabel}>Итоговый балл</Text>
        <Text style={styles.dashScore}>
          {score === null ? "—" : score.toFixed(1)}
          <Text style={styles.dashScoreSmall}> / 10</Text>
        </Text>
        <Text style={styles.dashDraft}>
          {answeredCount === 0
            ? "ответьте на вопросы — балл появится здесь"
            : done
              ? "итоговый балл"
              : `предварительно — по ${answeredCount} ответам`}
        </Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(answeredCount / TOTAL) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Отвечено {answeredCount} из {TOTAL}
        </Text>

        <Text style={styles.dashLabel}>Уровень процессов команды</Text>
        <Text style={[styles.levelName, level ? { color: level.color } : null]}>
          {level ? level.name : "…"}
        </Text>
        <Text style={styles.levelDesc}>
          {level ? level.desc : "Здесь появится «титул» вашей команды."}
        </Text>

        <View style={styles.scaleWrap}>
          <View style={styles.scale} onLayout={(e: LayoutChangeEvent) => setScaleWidth(e.nativeEvent.layout.width)}>
            {SCALE_SEGMENTS.map((color) => (
              <View key={color} style={[styles.scaleSegment, { backgroundColor: color }]} />
            ))}
            {markerLeft !== null && (
              <View style={[styles.marker, { left: markerLeft }]} />
            )}
          </View>
          <View style={styles.scaleLabels}>
            {SCALE_LABELS.map((label) => (
              <Text key={label} style={styles.scaleLabel}>
                {label}
              </Text>
            ))}
          </View>
        </View>

        {done && level && (
          <View style={styles.result}>
            <Text style={styles.verdict}>
              Ваш уровень — <Text style={styles.verdictStrong}>{level.name}</Text>. {level.next}
            </Text>
            <Pressable
              onPress={restart}
              style={({ pressed }) => [styles.restart, pressed && styles.restartPressed]}
              accessibilityRole="button"
              accessibilityLabel="Пройти заново"
            >
              <Text style={styles.restartText}>Пройти заново</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.hint}>
          Шкала по мотивам матрицы: 1–2 — есть ли система, 3–4 — структура, 5–6 —
          управляемость, 7–8 — результат, 9–10 — системность и саморазвитие.
        </Text>
      </View>

      {/* Вопросы */}
      {QUESTIONS.map((q, qi) => (
        <View key={q.title} style={styles.qCard}>
          <View style={styles.qHead}>
            <Text style={styles.qNum}>
              {qi + 1} / {TOTAL}
            </Text>
            <Text style={styles.qTitle}>{q.title}</Text>
          </View>
          {q.options.map((text, oi) => {
            const selected = answers[qi] === oi;
            return (
              <Pressable
                key={oi}
                onPress={() => select(qi, oi)}
                style={[styles.option, selected && styles.optionSelected]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* Подвал */}
      <View style={styles.footer}>
        <Text style={styles.footerLine}>
          <Text style={styles.footerStrong}>Виктор Ефимов</Text> · CPO · 2026
        </Text>
        <Text style={styles.footerLine}>Сделано вместе с AI-агентом · по мотивам матрицы «Sierra — Развитие»</Text>
        <Text style={styles.footerLine}>Версия 1.0 · 2026-11-05</Text>
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
  header: {
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
    lineHeight: 29,
    color: COLORS.text,
    marginBottom: 8,
  },
  lead: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
  },
  dashboard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS,
    padding: 20,
    marginBottom: 16,
  },
  dashLabel: {
    fontSize: 13,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  dashScore: {
    fontSize: 44,
    fontWeight: "800",
    lineHeight: 48,
    color: COLORS.text,
  },
  dashScoreSmall: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.muted,
  },
  dashDraft: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.bg,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.accent,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 18,
  },
  levelName: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.4,
    color: COLORS.text,
  },
  levelDesc: {
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 16,
  },
  scaleWrap: {
    marginBottom: 4,
  },
  scale: {
    flexDirection: "row",
    height: 6,
    borderRadius: 999,
    overflow: "visible",
    marginTop: 8,
    marginBottom: 10,
  },
  scaleSegment: {
    flex: 1,
    height: 6,
  },
  marker: {
    position: "absolute",
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.text,
    borderWidth: 3,
    borderColor: "#ffffff",
    marginLeft: -10,
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },
  result: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.line,
    marginTop: 14,
    paddingTop: 14,
  },
  verdict: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    marginBottom: 12,
  },
  verdictStrong: {
    color: COLORS.accent,
    fontWeight: "700",
  },
  restart: {
    borderRadius: 14,
    backgroundColor: COLORS.text,
    paddingVertical: 13,
    alignItems: "center",
  },
  restartPressed: {
    opacity: 0.88,
  },
  restartText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  hint: {
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.muted,
    marginTop: 14,
  },
  qCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS,
    padding: 20,
    marginBottom: 16,
  },
  qHead: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 14,
  },
  qNum: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted,
  },
  qTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  optionSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentSoft,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#c8c8ce",
    marginTop: 1,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  optionText: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 20,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.text,
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
