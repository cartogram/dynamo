"use client";

// import { C1Chat } from "@thesysai/genui-sdk";
// import "@crayonai/react-ui/styles/index.css";

// export default function Home() {
//   return <C1Chat apiUrl="/api/chat" />;
// }

import React, { useState, useEffect, useRef, useCallback } from "react";

// ============================================
// THEME CONFIGURATION
// ============================================

const theme = {
  // Colors
  colors: {
    // Primary palette
    primary: "#0066cc",
    primaryHover: "#0052a3",
    primaryLight: "#f0f9ff",

    // Neutral palette
    white: "#ffffff",
    black: "#000000",

    // Gray scale
    gray50: "#f8fafc",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1e293b",
    gray900: "#0f172a",

    // Semantic colors
    success: "#10b981",
    warning: "#fbbf24",
    error: "#ef4444",
    errorLight: "#fee2e2",

    // Dark theme colors
    dark: {
      bg: "#1a1a2e",
      bgAlt: "#252540",
      bgInput: "#2a2a4a",
      border: "#3a3a5c",
      text: "#a0a0b0",
      textLight: "#c0c0d0",
      accent: "#4a4a7a",
    },

    // High contrast colors
    highContrast: {
      bg: "#000000",
      bgAlt: "#1a1a1a",
      text: "#ffffff",
      accent: "#ffcc00",
      success: "#00cc66",
    },

    // Warm accent colors (for conflict resolution)
    warm: {
      accent: "rgba(255, 200, 150, 1)",
      accentMuted: "rgba(255, 180, 100, 1)",
    },

    // Dyslexia-friendly colors
    dyslexia: {
      bg: "#fdf6e3",
      bgAlt: "#fff8e7",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      base: "'Inter', -apple-system, sans-serif",
      mono: "'JetBrains Mono', monospace",
      dyslexia: "'OpenDyslexic', 'Comic Sans MS', 'Verdana', sans-serif",
    },
    fontSize: {
      xs: "12px",
      sm: "13px",
      base: "14px",
      md: "15px",
      lg: "16px",
      xl: "18px",
      "2xl": "20px",
      "3xl": "24px",
      "4xl": "28px",
      "5xl": "32px",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.4",
      base: "1.6",
      relaxed: "1.8",
      loose: "2",
    },
    letterSpacing: {
      tight: "0",
      base: "0.03em",
      wide: "0.05em",
    },
  },

  // Spacing
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "40px",
  },

  // Border radius
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 40px rgba(0,0,0,0.15)",
    xl: "0 20px 60px rgba(0,0,0,0.2)",
  },

  // Transitions
  transitions: {
    fast: "0.15s ease",
    base: "0.2s ease",
    slow: "0.3s ease",
    slower: "0.4s ease",
  },

  // Z-index
  zIndex: {
    base: 1,
    dropdown: 100,
    modal: 1000,
    tooltip: 2000,
  },
};

// ============================================
// BASE STYLES
// ============================================

const baseStyles = {
  // Layout containers
  sidebar: {
    width: "360px",
    background: theme.colors.gray900,
    color: theme.colors.white,
    padding: theme.spacing["2xl"],
    overflowY: "auto",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
  },

  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  centeredContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.colors.gray50,
    padding: theme.spacing["2xl"],
  },

  // Cards and panels
  card: {
    background: theme.colors.gray100,
    borderRadius: theme.radius.lg,
    padding: theme.spacing["2xl"],
    border: `1px solid ${theme.colors.gray200}`,
  },

  cardDark: {
    background: theme.colors.gray800,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.gray700}`,
  },

  // Buttons
  buttonPrimary: {
    padding: `${theme.spacing.md} ${theme.spacing["2xl"]}`,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    background: theme.colors.primary,
    color: theme.colors.white,
    border: "none",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    transition: `all ${theme.transitions.base}`,
  },

  buttonSecondary: {
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    background: "transparent",
    color: theme.colors.gray700,
    border: `1px solid ${theme.colors.gray300}`,
    borderRadius: theme.radius.md,
    cursor: "pointer",
    transition: `all ${theme.transitions.base}`,
  },

  buttonGhost: {
    padding: theme.spacing.md,
    background: "transparent",
    color: theme.colors.gray500,
    border: "none",
    cursor: "pointer",
    fontSize: theme.typography.fontSize.base,
  },

  buttonSidebar: {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: theme.typography.fontSize.base,
    background: theme.colors.gray800,
    color: theme.colors.white,
    border: "2px solid transparent",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    textAlign: "left",
    transition: `all ${theme.transitions.base}`,
  },

  buttonSidebarActive: {
    background: theme.colors.primary,
    border: `2px solid #60a5fa`,
  },

  // Form elements
  input: {
    width: "100%",
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.lg,
    border: `1px solid ${theme.colors.gray300}`,
    borderRadius: theme.radius.md,
    fontFamily: "inherit",
    lineHeight: theme.typography.lineHeight.base,
  },

  textarea: {
    width: "100%",
    minHeight: "180px",
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.lg,
    border: `1px solid ${theme.colors.gray300}`,
    borderRadius: theme.radius.md,
    resize: "vertical",
    lineHeight: theme.typography.lineHeight.base,
    fontFamily: "inherit",
  },

  select: {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: theme.typography.fontSize.lg,
    border: `1px solid ${theme.colors.gray300}`,
    borderRadius: theme.radius.md,
    background: theme.colors.white,
    minWidth: "180px",
  },

  // Labels and text
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
    display: "block",
    color: theme.colors.gray700,
  },

  labelSmall: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray500,
    marginBottom: theme.spacing.md,
    display: "block",
  },

  heading: {
    fontSize: theme.typography.fontSize["3xl"],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing["2xl"],
    color: theme.colors.gray900,
  },

  headingSmall: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },

  textMuted: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray500,
  },

  textSmall: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray400,
  },

  // Chat elements
  chatBubbleUser: {
    maxWidth: "85%",
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderRadius: `${theme.radius.xl} ${theme.radius.sm} ${theme.radius.xl} ${theme.radius.xl}`,
    background: theme.colors.primary,
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.base,
  },

  chatBubbleAssistant: {
    maxWidth: "85%",
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderRadius: `${theme.radius.sm} ${theme.radius.xl} ${theme.radius.xl} ${theme.radius.xl}`,
    background: theme.colors.gray100,
    color: theme.colors.gray900,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.base,
  },

  chatInput: {
    flex: 1,
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    fontSize: theme.typography.fontSize.md,
    border: `1px solid ${theme.colors.gray300}`,
    borderRadius: theme.radius.full,
    outline: "none",
  },

  chatSendButton: {
    padding: `${theme.spacing.md} ${theme.spacing["2xl"]}`,
    background: theme.colors.primary,
    color: theme.colors.white,
    border: "none",
    borderRadius: theme.radius.full,
    fontWeight: theme.typography.fontWeight.semibold,
    cursor: "pointer",
  },

  chatSendButtonDisabled: {
    background: theme.colors.gray300,
    cursor: "not-allowed",
  },

  // Popups and modals
  popup: {
    position: "fixed",
    bottom: theme.spacing["2xl"],
    right: theme.spacing["2xl"],
    background: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing["2xl"],
    maxWidth: "380px",
    boxShadow: theme.shadows.xl,
    border: `1px solid ${theme.colors.gray200}`,
    zIndex: theme.zIndex.modal,
  },

  // Progress bar
  progressBar: {
    height: "4px",
    background: theme.colors.gray200,
    borderRadius: "2px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: theme.colors.primary,
    transition: `width ${theme.transitions.slow}`,
  },

  // Step indicator
  stepIndicator: {
    background: theme.colors.primary,
    color: theme.colors.white,
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
  },

  // Tags/badges
  tag: {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    background: theme.colors.gray800,
    borderRadius: theme.radius.xl,
    fontSize: theme.typography.fontSize.sm,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  // Thinking panel
  thinkingPanel: {
    background: theme.colors.dark.bg,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing["2xl"],
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
  },

  conflictBox: {
    background: "rgba(251, 191, 36, 0.1)",
    border: "1px solid rgba(251, 191, 36, 0.3)",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  // Slider
  slider: {
    width: "100%",
    cursor: "pointer",
  },

  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
  },
};

// CSS animations as a string to inject
const cssAnimations = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .typing-animation {
    display: inline-block;
    animation: pulse 1s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

// ============================================
// CONFIGURATION DATA
// ============================================

const preferenceInfo = {
  tremors: {
    label: "Motor tremors",
    description: "Difficulty with precise clicking and small targets",
    icon: "🖐️",
    adaptations: [
      "Minimum 48px touch targets",
      "200ms click delay on destructive actions",
      "Increased spacing between elements",
    ],
  },
  lowVision: {
    label: "Low vision",
    description: "Need larger text and higher contrast",
    icon: "👁️",
    adaptations: [
      "Minimum 20px font size",
      "High contrast (7:1 ratio)",
      "Bold visual indicators",
    ],
  },
  colorBlind: {
    label: "Color blindness",
    description: "Difficulty distinguishing certain colors",
    icon: "🎨",
    adaptations: [
      "Icons paired with all colors",
      "Patterns for status indicators",
      "Avoiding red/green combinations",
    ],
  },
  cognitiveLoad: {
    label: "Cognitive overload sensitivity",
    description: "Prefer simplified interfaces with less information",
    icon: "🧠",
    adaptations: [
      "Step-by-step flow",
      "Hidden secondary actions",
      "Clear visual hierarchy",
    ],
  },
  screenReader: {
    label: "Screen reader user",
    description: "Rely on semantic HTML and clear labels",
    icon: "🔊",
    adaptations: [
      "Semantic HTML structure",
      "ARIA live regions",
      "Skip navigation links",
    ],
  },
  photosensitivity: {
    label: "Light sensitivity",
    description: "Prefer darker themes and reduced brightness",
    icon: "🌙",
    adaptations: ["Dark theme", "Reduced brightness", "Muted accent colors"],
  },
  dyslexia: {
    label: "Dyslexia",
    description: "Benefit from specific fonts and spacing",
    icon: "📖",
    adaptations: [
      "Dyslexia-friendly font",
      "Increased line height (1.8)",
      "Extra letter spacing",
    ],
  },
  adhd: {
    label: "ADHD",
    description: "Prefer focused interfaces with minimal distractions",
    icon: "🎯",
    adaptations: [
      "Minimal UI elements",
      "Clear focus states",
      "Reduced animations",
    ],
  },
};

const preferenceConflicts = {
  "lowVision+photosensitivity": {
    prefs: ["lowVision", "photosensitivity"],
    description:
      "Low vision typically requires high contrast, but photosensitivity requires reduced brightness.",
    resolution:
      "I'll use a dark theme with moderate contrast (5:1 ratio) and warm accent colors instead of bright whites.",
    adjustments: {
      contrastLevel: 0.6,
      useDarkTheme: true,
      useWarmAccents: true,
    },
  },
  "cognitiveLoad+screenReader": {
    prefs: ["cognitiveLoad", "screenReader"],
    description:
      "Simplified interfaces might remove context that screen readers need.",
    resolution:
      "I'll keep the visual interface simple while maintaining full semantic structure and ARIA labels.",
    adjustments: { visuallySimple: true, semanticallyComplete: true },
  },
  "adhd+lowVision": {
    prefs: ["adhd", "lowVision"],
    description:
      "ADHD benefits from minimal UI, but low vision needs prominent visual elements.",
    resolution:
      "I'll use a focused layout with fewer elements, but make each element larger and more distinct.",
    adjustments: { minimalElements: true, largeElements: true },
  },
};

const discoveryQuestions = [
  {
    id: "clicking",
    question:
      "When using interfaces, do you sometimes click things you didn't mean to?",
    options: [
      { label: "Often", value: "often", infers: ["tremors"] },
      { label: "Sometimes", value: "sometimes", infers: [] },
      { label: "Rarely", value: "rarely", infers: [] },
    ],
  },
  {
    id: "brightness",
    question: "How do you feel about bright screens and high contrast?",
    options: [
      {
        label: "I need high contrast to see clearly",
        value: "need-high",
        infers: ["lowVision"],
      },
      {
        label: "Bright screens bother my eyes",
        value: "bothers",
        infers: ["photosensitivity"],
      },
      { label: "No strong preference", value: "neutral", infers: [] },
    ],
  },
  {
    id: "complexity",
    question: "When faced with a complex interface, how do you feel?",
    options: [
      {
        label: "Overwhelmed - I prefer simple step-by-step",
        value: "overwhelmed",
        infers: ["cognitiveLoad"],
      },
      {
        label: "Distracted - Hard to focus on what matters",
        value: "distracted",
        infers: ["adhd"],
      },
      { label: "Fine - I can navigate complexity", value: "fine", infers: [] },
    ],
  },
  {
    id: "reading",
    question: "Do you have any challenges with reading text on screens?",
    options: [
      {
        label: "Text sometimes appears jumbled or moves",
        value: "jumbled",
        infers: ["dyslexia"],
      },
      {
        label: "I need larger text to read comfortably",
        value: "larger",
        infers: ["lowVision"],
      },
      {
        label: "I use a screen reader",
        value: "screenreader",
        infers: ["screenReader"],
      },
      { label: "No issues", value: "none", infers: [] },
    ],
  },
  {
    id: "colors",
    question: "Do you have difficulty distinguishing certain colors?",
    options: [
      {
        label: "Yes, especially reds and greens",
        value: "yes",
        infers: ["colorBlind"],
      },
      { label: "No", value: "no", infers: [] },
    ],
  },
  {
    id: "energy",
    question: "How are you feeling right now?",
    options: [
      { label: "😴 Low energy today", value: "low", temporalState: "low" },
      {
        label: "⚡ Focused and ready",
        value: "focused",
        temporalState: "focused",
      },
      {
        label: "😣 A bit overwhelmed",
        value: "overwhelmed",
        temporalState: "overwhelmed",
      },
      { label: "😊 Normal", value: "normal", temporalState: "normal" },
    ],
  },
];

const userProfiles = {
  1: {
    name: "User 1: Maria",
    description: "Motor tremors + Low vision",
    presets: { tremors: true, lowVision: true },
  },
  2: {
    name: "User 2: James",
    description: "ADHD + Cognitive load sensitivity",
    presets: { adhd: true, cognitiveLoad: true },
  },
  3: {
    name: "User 3: Sophie",
    description: "Dyslexia + Photosensitivity",
    presets: { dyslexia: true, photosensitivity: true },
  },
  4: {
    name: "User 4: Alex",
    description: "Low vision + Photosensitivity (conflict)",
    presets: { lowVision: true, photosensitivity: true },
  },
  5: {
    name: "User 5: Custom",
    description: "Discover through questions",
    presets: {},
  },
};

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
];

// ============================================
// HOOKS
// ============================================

const useBehaviorTracking = () => {
  const [behaviorMetrics, setBehaviorMetrics] = useState({
    missedClicks: 0,
    corrections: 0,
    hesitations: 0,
    totalClicks: 0,
    totalKeystrokes: 0,
    lastInteraction: Date.now(),
  });

  const [suggestions, setSuggestions] = useState([]);
  const missedClickThreshold = useRef(3);
  const correctionThreshold = useRef(5);

  const trackClick = useCallback(
    (wasAccurate) => {
      setBehaviorMetrics((prev) => {
        const newMetrics = {
          ...prev,
          totalClicks: prev.totalClicks + 1,
          missedClicks: wasAccurate ? prev.missedClicks : prev.missedClicks + 1,
          lastInteraction: Date.now(),
        };
        if (
          newMetrics.missedClicks >= missedClickThreshold.current &&
          !suggestions.includes("enlargeTargets")
        ) {
          setSuggestions((s) => [...s, "enlargeTargets"]);
        }
        return newMetrics;
      });
    },
    [suggestions]
  );

  const trackCorrection = useCallback(() => {
    setBehaviorMetrics((prev) => {
      const newMetrics = {
        ...prev,
        corrections: prev.corrections + 1,
        totalKeystrokes: prev.totalKeystrokes + 1,
        lastInteraction: Date.now(),
      };
      if (
        newMetrics.corrections >= correctionThreshold.current &&
        !suggestions.includes("offerVoiceInput")
      ) {
        setSuggestions((s) => [...s, "offerVoiceInput"]);
      }
      return newMetrics;
    });
  }, [suggestions]);

  const dismissSuggestion = useCallback((suggestion) => {
    setSuggestions((s) => s.filter((item) => item !== suggestion));
  }, []);

  const resetMetrics = useCallback(() => {
    setBehaviorMetrics({
      missedClicks: 0,
      corrections: 0,
      hesitations: 0,
      totalClicks: 0,
      totalKeystrokes: 0,
      lastInteraction: Date.now(),
    });
    setSuggestions([]);
  }, []);

  return {
    behaviorMetrics,
    suggestions,
    trackClick,
    trackCorrection,
    dismissSuggestion,
    resetMetrics,
  };
};

// ============================================
// ADAPTIVE STYLE GENERATION
// ============================================

const generateAdaptiveStyles = (
  preferences,
  temporalState,
  adjustments,
  runtimeAdjustments
) => {
  const t = theme;

  // Get adjustment values with defaults
  const contrastLevel = adjustments?.contrastLevel ?? 0.6;
  const targetSize = adjustments?.targetSize ?? 1;
  const complexity = adjustments?.complexity ?? 0.3;
  const letterSpacingValue = adjustments?.letterSpacing ?? 0.05;

  let styles = {
    container: {
      minHeight: "100vh",
      padding: t.spacing["3xl"],
      fontFamily: t.typography.fontFamily.base,
      background: t.colors.white,
      color: t.colors.gray900,
      transition: `all ${t.transitions.slower}`,
      lineHeight: t.typography.lineHeight.base,
    },
    card: { ...baseStyles.card },
    input: { ...baseStyles.textarea },
    button: { ...baseStyles.buttonPrimary },
    buttonSecondary: { ...baseStyles.buttonSecondary },
    select: { ...baseStyles.select },
    label: { ...baseStyles.label },
    heading: { ...baseStyles.heading },
    layout: "horizontal",
    showSecondaryActions: true,
    showAllOptions: true,
  };

  // Temporal state modifications
  if (temporalState === "low" || temporalState === "overwhelmed") {
    styles.showSecondaryActions = false;
    styles.layout = "vertical";
    if (temporalState === "low") styles.showAllOptions = false;
  }

  // Tremors: larger touch targets (uses targetSize slider)
  if (preferences.tremors) {
    const scale = targetSize;
    styles.button = {
      ...styles.button,
      padding: `${Math.round(20 * scale)}px ${Math.round(36 * scale)}px`,
      fontSize: `${Math.round(18 * scale)}px`,
      minHeight: `${Math.round(56 * scale)}px`,
      minWidth: `${Math.round(120 * scale)}px`,
    };
    styles.buttonSecondary = {
      ...styles.buttonSecondary,
      padding: `${Math.round(16 * scale)}px ${Math.round(28 * scale)}px`,
      fontSize: `${Math.round(16 * scale)}px`,
      minHeight: `${Math.round(48 * scale)}px`,
    };
    styles.select = {
      ...styles.select,
      padding: `${Math.round(16 * scale)}px ${Math.round(20 * scale)}px`,
      fontSize: `${Math.round(18 * scale)}px`,
      minHeight: `${Math.round(56 * scale)}px`,
    };
    styles.card = { ...styles.card, padding: `${Math.round(32 * scale)}px` };
  }

  // Low vision + Photosensitivity conflict (uses contrastLevel slider)
  if (preferences.lowVision && preferences.photosensitivity) {
    const textColor = `rgba(255, 255, 255, ${0.5 + contrastLevel * 0.5})`;
    const accentColor = `rgba(255, 200, 150, ${0.3 + contrastLevel * 0.7})`;
    const buttonBg = `rgba(255, 180, 100, ${0.5 + contrastLevel * 0.5})`;

    styles.container = {
      ...styles.container,
      background: t.colors.gray900,
      color: textColor,
    };
    styles.card = {
      ...styles.card,
      background: "#2a2a2a",
      border: `${Math.round(1 + contrastLevel * 2)}px solid ${accentColor}`,
    };
    styles.input = {
      ...styles.input,
      fontSize: t.typography.fontSize["2xl"],
      padding: t.spacing.xl,
      background: "#2a2a2a",
      color: textColor,
      border: `${Math.round(1 + contrastLevel * 2)}px solid ${accentColor}`,
    };
    styles.button = {
      ...styles.button,
      fontSize: t.typography.fontSize["2xl"],
      padding: `${t.spacing.lg} ${t.spacing["3xl"]}`,
      background: buttonBg,
      color: t.colors.gray900,
    };
    styles.select = {
      ...styles.select,
      fontSize: t.typography.fontSize["2xl"],
      background: "#2a2a2a",
      color: textColor,
      border: `${Math.round(1 + contrastLevel * 2)}px solid ${accentColor}`,
    };
    styles.label = {
      ...styles.label,
      fontSize: t.typography.fontSize.xl,
      color: accentColor,
    };
    styles.heading = {
      ...styles.heading,
      fontSize: t.typography.fontSize["4xl"],
      color: accentColor,
    };
  } else if (preferences.lowVision) {
    // High contrast mode (uses contrastLevel slider to adjust intensity)
    const bgDarkness = Math.round(255 * (1 - contrastLevel));
    const bgColor = `rgb(${bgDarkness}, ${bgDarkness}, ${bgDarkness})`;
    const textBrightness = Math.round(155 + contrastLevel * 100);
    const textColor = `rgb(${textBrightness}, ${textBrightness}, ${textBrightness})`;

    styles.container = {
      ...styles.container,
      background: bgColor,
      color: textColor,
    };
    styles.card = {
      ...styles.card,
      background: `rgb(${bgDarkness + 26}, ${bgDarkness + 26}, ${
        bgDarkness + 26
      })`,
      border: `${Math.round(1 + contrastLevel * 2)}px solid ${textColor}`,
    };
    styles.input = {
      ...styles.input,
      fontSize: t.typography.fontSize["2xl"],
      padding: t.spacing.xl,
      background: `rgb(${bgDarkness + 26}, ${bgDarkness + 26}, ${
        bgDarkness + 26
      })`,
      color: textColor,
      border: `${Math.round(1 + contrastLevel * 2)}px solid ${textColor}`,
    };
    styles.button = {
      ...styles.button,
      fontSize: t.typography.fontSize["2xl"],
      padding: `${t.spacing.lg} ${t.spacing["3xl"]}`,
      background: t.colors.highContrast.accent,
      color: bgColor,
      border: `${Math.round(1 + contrastLevel * 2)}px solid ${textColor}`,
    };
    styles.select = {
      ...styles.select,
      fontSize: t.typography.fontSize["2xl"],
      background: `rgb(${bgDarkness + 26}, ${bgDarkness + 26}, ${
        bgDarkness + 26
      })`,
      color: textColor,
      border: `${Math.round(1 + contrastLevel * 2)}px solid ${textColor}`,
    };
    styles.label = {
      ...styles.label,
      fontSize: t.typography.fontSize.xl,
      color: textColor,
    };
    styles.heading = {
      ...styles.heading,
      fontSize: t.typography.fontSize["5xl"],
      color: t.colors.highContrast.accent,
    };
  } else if (preferences.photosensitivity) {
    // Dark muted mode (uses contrastLevel slider to adjust brightness)
    const brightness = 0.4 + (1 - contrastLevel) * 0.3; // Lower contrast = dimmer
    const bgBase = Math.round(26 * brightness);
    const textBase = Math.round(160 * (0.7 + contrastLevel * 0.3));

    styles.container = {
      ...styles.container,
      background: `rgb(${bgBase}, ${bgBase}, ${Math.round(bgBase * 1.2)})`,
      color: `rgb(${textBase}, ${textBase}, ${Math.round(textBase * 1.1)})`,
    };
    styles.card = {
      ...styles.card,
      background: `rgb(${bgBase + 11}, ${bgBase + 11}, ${Math.round(
        (bgBase + 11) * 1.2
      )})`,
      border: `1px solid rgb(${bgBase + 30}, ${bgBase + 30}, ${Math.round(
        (bgBase + 30) * 1.2
      )})`,
    };
    styles.input = {
      ...styles.input,
      background: `rgb(${bgBase + 16}, ${bgBase + 16}, ${Math.round(
        (bgBase + 16) * 1.3
      )})`,
      color: `rgb(${textBase + 32}, ${textBase + 32}, ${Math.round(
        (textBase + 32) * 1.1
      )})`,
      border: `1px solid rgb(${bgBase + 30}, ${bgBase + 30}, ${Math.round(
        (bgBase + 30) * 1.2
      )})`,
    };
    styles.button = {
      ...styles.button,
      background: `rgb(${bgBase + 36}, ${bgBase + 36}, ${Math.round(
        (bgBase + 36) * 1.4
      )})`,
      color: `rgb(${textBase + 64}, ${textBase + 64}, ${Math.round(
        (textBase + 64) * 1.1
      )})`,
    };
    styles.buttonSecondary = {
      ...styles.buttonSecondary,
      background: "transparent",
      color: `rgb(${textBase}, ${textBase}, ${Math.round(textBase * 1.1)})`,
      border: `1px solid rgb(${bgBase + 36}, ${bgBase + 36}, ${Math.round(
        (bgBase + 36) * 1.3
      )})`,
    };
    styles.select = {
      ...styles.select,
      background: `rgb(${bgBase + 16}, ${bgBase + 16}, ${Math.round(
        (bgBase + 16) * 1.3
      )})`,
      color: `rgb(${textBase + 32}, ${textBase + 32}, ${Math.round(
        (textBase + 32) * 1.1
      )})`,
      border: `1px solid rgb(${bgBase + 30}, ${bgBase + 30}, ${Math.round(
        (bgBase + 30) * 1.2
      )})`,
    };
    styles.label = {
      ...styles.label,
      color: `rgb(${textBase}, ${textBase}, ${Math.round(textBase * 1.1)})`,
    };
    styles.heading = {
      ...styles.heading,
      color: `rgb(${textBase + 32}, ${textBase + 32}, ${Math.round(
        (textBase + 32) * 1.1
      )})`,
    };
  }

  // Cognitive load / ADHD: simplified layout (uses complexity slider)
  if (preferences.cognitiveLoad || preferences.adhd) {
    // complexity: 0 = most simple, 1 = full features
    styles.layout = complexity < 0.7 ? "vertical" : "horizontal";
    styles.showSecondaryActions = complexity > 0.5;
    styles.showAllOptions = complexity > 0.3;
  }

  // Dyslexia: special font and spacing (uses letterSpacing slider)
  if (preferences.dyslexia) {
    const dyslexiaFont = t.typography.fontFamily.dyslexia;
    const bgColor = preferences.photosensitivity
      ? styles.container.background
      : t.colors.dyslexia.bg;
    const spacing = `${letterSpacingValue}em`;
    const lineHeightValue = 1.6 + letterSpacingValue * 4; // More letter spacing = more line height too

    styles.container = {
      ...styles.container,
      fontFamily: dyslexiaFont,
      background: bgColor,
      lineHeight: `${lineHeightValue}`,
      letterSpacing: spacing,
    };
    styles.input = {
      ...styles.input,
      fontFamily: dyslexiaFont,
      lineHeight: `${lineHeightValue + 0.2}`,
      letterSpacing: spacing,
      fontSize: t.typography.fontSize.xl,
      background: preferences.photosensitivity
        ? styles.input.background
        : t.colors.dyslexia.bg,
    };
    styles.button = {
      ...styles.button,
      fontFamily: dyslexiaFont,
      letterSpacing: spacing,
    };
    styles.buttonSecondary = {
      ...styles.buttonSecondary,
      fontFamily: dyslexiaFont,
      letterSpacing: spacing,
    };
    styles.label = {
      ...styles.label,
      fontFamily: dyslexiaFont,
      letterSpacing: spacing,
    };

    if (!preferences.photosensitivity && !preferences.lowVision) {
      styles.card = { ...styles.card, background: t.colors.dyslexia.bgAlt };
    }
  }

  // Runtime adjustments from behavioral detection (enlarges targets beyond slider value)
  if (runtimeAdjustments?.enlargedTargets) {
    const extraScale = 1.3;
    const currentPadding = styles.button.padding || "12px 24px";
    const paddingParts = currentPadding.split(" ");
    const vertPad = Math.round(parseInt(paddingParts[0]) * extraScale);
    const horizPad = Math.round(
      parseInt(paddingParts[1] || paddingParts[0]) * extraScale
    );

    styles.button = {
      ...styles.button,
      padding: `${vertPad}px ${horizPad}px`,
      fontSize: `${Math.round(
        parseInt(styles.button.fontSize || "16") * extraScale
      )}px`,
    };
    styles.select = {
      ...styles.select,
      padding: `${vertPad}px ${horizPad}px`,
      fontSize: `${Math.round(
        parseInt(styles.select.fontSize || "16") * extraScale
      )}px`,
    };
  }

  return styles;
};

// ============================================
// COMPONENTS
// ============================================

const ThinkingPanel = ({ decisions, isThinking, conflicts }) => {
  if (!isThinking && decisions.length === 0 && conflicts.length === 0)
    return null;

  return (
    <div style={baseStyles.thinkingPanel}>
      <div
        style={{
          color: "#818cf8",
          fontWeight: theme.typography.fontWeight.semibold,
          marginBottom: theme.spacing.lg,
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        <span>🧠</span> AI Reasoning
        {isThinking && <span style={{ opacity: 0.6 }}>thinking...</span>}
      </div>

      {conflicts.length > 0 && (
        <div style={{ marginBottom: theme.spacing.lg }}>
          {conflicts.map((conflict, i) => (
            <div key={i} style={baseStyles.conflictBox}>
              <div
                style={{
                  color: theme.colors.warning,
                  fontWeight: theme.typography.fontWeight.semibold,
                  marginBottom: theme.spacing.sm,
                }}
              >
                ⚠️ Conflict Detected
              </div>
              <div
                style={{
                  color: theme.colors.gray300,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {conflict.description}
              </div>
              <div style={{ color: theme.colors.success }}>
                ✓ Resolution: {conflict.resolution}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.sm,
        }}
      >
        {decisions.map((decision, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: theme.spacing.sm,
              color: decision.applied
                ? theme.colors.success
                : theme.colors.gray500,
              opacity: isThinking && i === decisions.length - 1 ? 0.6 : 1,
            }}
          >
            <span>{decision.applied ? "✓" : "✗"}</span>
            <span>{decision.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BehaviorSuggestion = ({ type, onAccept, onDismiss }) => {
  const suggestions = {
    enlargeTargets: {
      title: "Interaction Difficulty Detected",
      message:
        "I noticed some clicks aren't landing where intended. Would you like me to make buttons and interactive elements larger?",
      acceptText: "Yes, make them larger",
    },
    offerVoiceInput: {
      title: "Typing Difficulty Detected",
      message:
        "I noticed frequent corrections while typing. Would you like me to enable voice input as an alternative?",
      acceptText: "Enable voice input",
    },
  };

  const suggestion = suggestions[type];
  if (!suggestion) return null;

  return (
    <div style={{ ...baseStyles.popup, animation: "slideUp 0.3s ease-out" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.md,
        }}
      >
        <span style={{ fontSize: theme.typography.fontSize["3xl"] }}>🔄</span>
        <span
          style={{
            fontWeight: theme.typography.fontWeight.bold,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          {suggestion.title}
        </span>
      </div>
      <p
        style={{
          color: theme.colors.gray600,
          marginBottom: theme.spacing.xl,
          lineHeight: theme.typography.lineHeight.base,
        }}
      >
        {suggestion.message}
      </p>
      <div style={{ display: "flex", gap: theme.spacing.md }}>
        <button
          onClick={onAccept}
          style={{ ...baseStyles.buttonPrimary, flex: 1 }}
        >
          {suggestion.acceptText}
        </button>
        <button
          onClick={onDismiss}
          style={{
            ...baseStyles.buttonSecondary,
            background: theme.colors.gray100,
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
};

const ChatMessage = ({ role, content, isTyping }) => {
  const isAssistant = role === "assistant";
  const bubbleStyle = isAssistant
    ? baseStyles.chatBubbleAssistant
    : baseStyles.chatBubbleUser;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isAssistant ? "flex-start" : "flex-end",
        marginBottom: theme.spacing.lg,
      }}
    >
      <div style={bubbleStyle}>
        {isTyping ? <span className="typing-animation">●●●</span> : content}
      </div>
    </div>
  );
};

const GeneratedTranslationUI = ({
  preferences,
  styles,
  trackClick,
  trackCorrection,
  showVoiceInput,
}) => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("de");
  const [isTranslating, setIsTranslating] = useState(false);
  const lastTextRef = useRef("");

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length < lastTextRef.current.length) trackCorrection();
    lastTextRef.current = newText;
    setSourceText(newText);
  };

  const handleButtonClick = (callback, e) => {
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );
    trackClick(distance < rect.width / 3);
    callback();
  };

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedText(`[${targetLang.toUpperCase()}] ${sourceText}`);
      setIsTranslating(false);
    }, 800);
  };

  // Vertical layout for cognitive load / ADHD
  if (styles.layout === "vertical") {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={styles.heading}>
          {preferences.cognitiveLoad ? "Translate Text" : "Translation"}
        </h2>

        <div style={{ ...styles.card, marginBottom: theme.spacing["2xl"] }}>
          <div style={{ marginBottom: theme.spacing.xl }}>
            <label style={styles.label}>
              {preferences.cognitiveLoad && (
                <span style={baseStyles.stepIndicator}>1</span>
              )}
              From
            </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              style={{ ...styles.select, width: "100%" }}
            >
              {(styles.showAllOptions ? languages : languages.slice(0, 5)).map(
                (lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label style={styles.label}>
              {preferences.cognitiveLoad && (
                <span style={baseStyles.stepIndicator}>2</span>
              )}
              To
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              style={{ ...styles.select, width: "100%" }}
            >
              {(styles.showAllOptions ? languages : languages.slice(0, 5)).map(
                (lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom: theme.spacing["2xl"] }}>
          <label style={styles.label}>
            {preferences.cognitiveLoad && (
              <span style={baseStyles.stepIndicator}>3</span>
            )}
            Type your text
          </label>
          <textarea
            value={sourceText}
            onChange={handleTextChange}
            placeholder="Enter text here..."
            style={styles.input}
          />
          {showVoiceInput && (
            <button
              style={{
                ...styles.buttonSecondary,
                marginTop: theme.spacing.md,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              🎤 Use voice input
            </button>
          )}
        </div>

        <button
          onClick={(e) => handleButtonClick(handleTranslate, e)}
          disabled={!sourceText || isTranslating}
          style={{
            ...styles.button,
            width: "100%",
            marginBottom: theme.spacing["2xl"],
            opacity: !sourceText ? 0.5 : 1,
          }}
        >
          {preferences.cognitiveLoad && (
            <span
              style={{
                ...baseStyles.stepIndicator,
                background: "rgba(255,255,255,0.2)",
              }}
            >
              4
            </span>
          )}
          {isTranslating ? "Translating..." : "Translate"}
        </button>

        {translatedText && (
          <div
            style={{
              ...styles.card,
              background: preferences.lowVision
                ? "#2a2a2a"
                : theme.colors.primaryLight,
              border: preferences.lowVision
                ? `3px solid ${theme.colors.highContrast.success}`
                : `2px solid ${theme.colors.primary}`,
            }}
          >
            <label style={styles.label}>Translation</label>
            <div
              style={{
                ...styles.input,
                minHeight: "100px",
                background: "transparent",
                border: "none",
              }}
            >
              {translatedText}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Horizontal DeepL-style layout
  return (
    <div>
      <h2 style={styles.heading}>Translation</h2>

      <div
        style={{
          display: "flex",
          gap: theme.spacing["2xl"],
          marginBottom: theme.spacing.xl,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={styles.label}>
            Source Language{preferences.colorBlind && " 🔵"}
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            style={{ ...styles.select, width: "100%" }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={(e) =>
            handleButtonClick(() => {
              setSourceLang(targetLang);
              setTargetLang(sourceLang);
            }, e)
          }
          style={{ ...styles.buttonSecondary, marginBottom: "0" }}
          title="Swap languages"
        >
          ⇄ Swap
        </button>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={styles.label}>
            Target Language{preferences.colorBlind && " 🟢"}
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            style={{ ...styles.select, width: "100%" }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: theme.spacing["2xl"],
          marginBottom: theme.spacing["2xl"],
        }}
      >
        <div style={styles.card}>
          <label style={styles.label}>Source Text</label>
          <textarea
            value={sourceText}
            onChange={handleTextChange}
            placeholder="Enter text to translate..."
            style={styles.input}
          />
          {showVoiceInput && (
            <button
              style={{
                ...styles.buttonSecondary,
                marginTop: theme.spacing.md,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              🎤 Use voice input
            </button>
          )}
          {styles.showSecondaryActions && (
            <div
              style={{
                marginTop: theme.spacing.md,
                display: "flex",
                gap: theme.spacing.sm,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={(e) => handleButtonClick(() => setSourceText(""), e)}
                style={{
                  ...styles.buttonSecondary,
                  color: theme.colors.error,
                  borderColor: theme.colors.error,
                }}
              >
                {preferences.colorBlind ? "✕ Clear" : "Clear"}
              </button>
              <button style={styles.buttonSecondary}>📋 Paste</button>
            </div>
          )}
        </div>

        <div
          style={{
            ...styles.card,
            background: preferences.lowVision
              ? "#1a2a1a"
              : preferences.photosensitivity
              ? "#2a3a4a"
              : theme.colors.primaryLight,
            border: preferences.lowVision
              ? `3px solid ${theme.colors.highContrast.success}`
              : preferences.photosensitivity
              ? `1px solid #4a5a6a`
              : `2px solid ${theme.colors.primary}`,
          }}
        >
          <label style={styles.label}>Translation</label>
          <div
            style={{
              ...styles.input,
              background: "transparent",
              border: "none",
            }}
          >
            {isTranslating ? (
              <span style={{ opacity: 0.6 }}>Translating...</span>
            ) : (
              translatedText || (
                <span style={{ opacity: 0.4 }}>
                  Translation will appear here...
                </span>
              )
            )}
          </div>
          {styles.showSecondaryActions && translatedText && (
            <div
              style={{
                marginTop: theme.spacing.md,
                display: "flex",
                gap: theme.spacing.sm,
              }}
            >
              <button
                onClick={(e) =>
                  handleButtonClick(
                    () =>
                      navigator.clipboard?.writeText(
                        translatedText.replace(/^\[.*?\]\s*/, "")
                      ),
                    e
                  )
                }
                style={styles.buttonSecondary}
              >
                📋 Copy
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={(e) => handleButtonClick(handleTranslate, e)}
          disabled={!sourceText || isTranslating}
          style={{ ...styles.button, opacity: !sourceText ? 0.5 : 1 }}
        >
          {preferences.colorBlind && "▶ "}
          {isTranslating ? "Translating..." : "Translate"}
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

const AdaptiveUIDemo = () => {
  const [currentUser, setCurrentUser] = useState(1);
  const [preferences, setPreferences] = useState({});
  const [temporalState, setTemporalState] = useState("normal");
  const [adjustments, setAdjustments] = useState({
    contrastLevel: 0.6,
    targetSize: 1,
    complexity: 0.3,
  });
  const [runtimeAdjustments, setRuntimeAdjustments] = useState({});
  const [phase, setPhase] = useState("discovery");
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [discoveryAnswers, setDiscoveryAnswers] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingDecisions, setThinkingDecisions] = useState([]);
  const [detectedConflicts, setDetectedConflicts] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [generatedStyles, setGeneratedStyles] = useState(null);

  const {
    behaviorMetrics,
    suggestions,
    trackClick,
    trackCorrection,
    dismissSuggestion,
    resetMetrics,
  } = useBehaviorTracking();

  const inferPreferencesFromAnswers = useCallback((answers) => {
    const inferred = {};
    Object.values(answers).forEach((answer) => {
      answer.infers?.forEach((pref) => {
        inferred[pref] = true;
      });
      if (answer.temporalState) setTemporalState(answer.temporalState);
    });
    return inferred;
  }, []);

  const detectConflicts = useCallback((prefs) => {
    return Object.values(preferenceConflicts).filter((conflict) =>
      conflict.prefs.every((p) => prefs[p])
    );
  }, []);

  const generateThinkingDecisions = useCallback((prefs) => {
    const decisions = [];
    Object.entries(prefs).forEach(([key, value]) => {
      if (value && preferenceInfo[key]) {
        decisions.push({
          text: `${preferenceInfo[key].label} detected → ${preferenceInfo[key].adaptations[0]}`,
          applied: true,
        });
      }
    });
    Object.entries(preferenceInfo).forEach(([key, info]) => {
      if (!prefs[key])
        decisions.push({
          text: `${info.label} not detected → Using default behavior`,
          applied: false,
        });
    });
    return decisions;
  }, []);

  const handleDiscoveryAnswer = (answer) => {
    const newAnswers = {
      ...discoveryAnswers,
      [discoveryQuestions[discoveryStep].id]: answer,
    };
    setDiscoveryAnswers(newAnswers);

    if (discoveryStep < discoveryQuestions.length - 1) {
      setDiscoveryStep(discoveryStep + 1);
    } else {
      const inferredPrefs = inferPreferencesFromAnswers(newAnswers);
      setPreferences(inferredPrefs);
      setPhase("chat");

      const prefNames = Object.entries(inferredPrefs)
        .filter(([_, v]) => v)
        .map(([k]) => preferenceInfo[k]?.label)
        .filter(Boolean);
      setChatMessages([
        {
          role: "assistant",
          content:
            prefNames.length > 0
              ? `Based on your answers, I've identified some preferences:\n\n• ${prefNames.join(
                  "\n• "
                )}\n\nDoes this sound right? Now, what would you like to do?`
              : "Thanks for answering! I'll create a standard interface for you. What would you like to do?",
        },
      ]);
    }
  };

  const switchUser = (userNum) => {
    setCurrentUser(userNum);
    setPhase("discovery");
    setDiscoveryStep(0);
    setDiscoveryAnswers({});
    setChatMessages([]);
    setThinkingDecisions([]);
    setDetectedConflicts([]);
    setGeneratedStyles(null);
    setRuntimeAdjustments({});
    resetMetrics();
    setTemporalState("normal");
    setAdjustments({ contrastLevel: 0.6, targetSize: 1, complexity: 0.3 });

    if (userNum !== 5 && userProfiles[userNum].presets) {
      setPreferences(userProfiles[userNum].presets);
      setPhase("chat");
      setChatMessages([
        {
          role: "assistant",
          content: `Hi ${userProfiles[userNum].name
            .split(":")[1]
            .trim()}! I've loaded your accessibility preferences. What would you like to do today?`,
        },
      ]);
    } else {
      setPreferences({});
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setUserInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const wantsTranslate = userInput.toLowerCase().includes("translat");

      if (wantsTranslate) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'll create a personalized translation interface for you. Let me analyze your preferences...",
          },
        ]);

        setTimeout(() => {
          setPhase("generating");
          setIsThinking(true);

          const conflicts = detectConflicts(preferences);
          setDetectedConflicts(conflicts);
          conflicts.forEach((conflict) =>
            setAdjustments((prev) => ({ ...prev, ...conflict.adjustments }))
          );

          const decisions = generateThinkingDecisions(preferences);
          decisions.forEach((decision, i) => {
            setTimeout(() => {
              setThinkingDecisions((prev) => [...prev, decision]);
              if (i === decisions.length - 1) {
                setIsThinking(false);
                setTimeout(() => {
                  setGeneratedStyles(
                    generateAdaptiveStyles(
                      preferences,
                      temporalState,
                      adjustments,
                      runtimeAdjustments
                    )
                  );
                  setPhase("ui");
                }, 1000);
              }
            }, i * 200);
          });
        }, 1000);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I can help you with translation! Just say something like \"I'd like to translate some text\" and I'll create a personalized interface for you.",
          },
        ]);
      }
    }, 1000);
  };

  const handleAcceptSuggestion = (suggestion) => {
    if (suggestion === "enlargeTargets") {
      setRuntimeAdjustments((prev) => ({ ...prev, enlargedTargets: true }));
      setGeneratedStyles(
        generateAdaptiveStyles(preferences, temporalState, adjustments, {
          ...runtimeAdjustments,
          enlargedTargets: true,
        })
      );
    } else if (suggestion === "offerVoiceInput") {
      setRuntimeAdjustments((prev) => ({ ...prev, showVoiceInput: true }));
    }
    dismissSuggestion(suggestion);
  };

  useEffect(() => {
    if (phase === "ui" && preferences) {
      setGeneratedStyles(
        generateAdaptiveStyles(
          preferences,
          temporalState,
          adjustments,
          runtimeAdjustments
        )
      );
    }
  }, [adjustments, runtimeAdjustments, phase, preferences, temporalState]);

  const activePrefsCount = Object.values(preferences).filter(Boolean).length;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily.base,
      }}
    >
      <style>{cssAnimations}</style>

      {/* Sidebar */}
      <div style={baseStyles.sidebar}>
        <h2
          style={{
            fontSize: theme.typography.fontSize.xl,
            marginBottom: theme.spacing.sm,
            fontWeight: theme.typography.fontWeight.bold,
          }}
        >
          Adaptive UI Demo
        </h2>
        <p
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray400,
            marginBottom: theme.spacing["2xl"],
          }}
        >
          Demonstrating AI-generated personalized interfaces
        </p>

        {/* User Switcher */}
        <div style={{ marginBottom: theme.spacing["2xl"] }}>
          <label style={baseStyles.labelSmall}>SWITCH USER PROFILE</label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.sm,
            }}
          >
            {Object.entries(userProfiles).map(([num, profile]) => (
              <button
                key={num}
                onClick={() => switchUser(parseInt(num))}
                style={{
                  ...baseStyles.buttonSidebar,
                  ...(currentUser === parseInt(num)
                    ? baseStyles.buttonSidebarActive
                    : {}),
                }}
              >
                <div
                  style={{ fontWeight: theme.typography.fontWeight.semibold }}
                >
                  {profile.name}
                </div>
                <div
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.gray400,
                    marginTop: "2px",
                  }}
                >
                  {profile.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Preferences */}
        {activePrefsCount > 0 && (
          <div style={{ marginBottom: theme.spacing["2xl"] }}>
            <label style={baseStyles.labelSmall}>
              ACTIVE PREFERENCES ({activePrefsCount})
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.sm,
              }}
            >
              {Object.entries(preferences)
                .filter(([_, v]) => v)
                .map(([key]) => (
                  <span key={key} style={baseStyles.tag}>
                    {preferenceInfo[key]?.icon} {preferenceInfo[key]?.label}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Behavior Tracking */}
        {phase === "ui" && (
          <div style={{ marginBottom: theme.spacing["2xl"] }}>
            <label style={baseStyles.labelSmall}>BEHAVIOR TRACKING</label>
            <div style={baseStyles.cardDark}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: theme.spacing.sm,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                <span style={{ color: theme.colors.gray400 }}>
                  Missed clicks
                </span>
                <span
                  style={{
                    color:
                      behaviorMetrics.missedClicks > 2
                        ? theme.colors.error
                        : theme.colors.success,
                  }}
                >
                  {behaviorMetrics.missedClicks}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: theme.spacing.md,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                <span style={{ color: theme.colors.gray400 }}>Corrections</span>
                <span
                  style={{
                    color:
                      behaviorMetrics.corrections > 4
                        ? theme.colors.error
                        : theme.colors.success,
                  }}
                >
                  {behaviorMetrics.corrections}
                </span>
              </div>
              <button
                onClick={() => {
                  for (let i = 0; i < 4; i++) trackClick(false);
                  for (let i = 0; i < 6; i++) trackCorrection();
                }}
                style={{
                  width: "100%",
                  padding: theme.spacing.sm,
                  background: theme.colors.gray700,
                  color: theme.colors.gray200,
                  border: "none",
                  borderRadius: theme.radius.sm,
                  cursor: "pointer",
                  fontSize: theme.typography.fontSize.xs,
                }}
              >
                🎮 Simulate User Struggles
              </button>
            </div>
          </div>
        )}

        {/* Fine-tune Sliders in Sidebar */}
        {phase === "ui" && activePrefsCount > 0 && (
          <div style={{ marginBottom: theme.spacing["2xl"] }}>
            <label style={baseStyles.labelSmall}>FINE-TUNE INTERFACE</label>
            <div style={baseStyles.cardDark}>
              {(preferences.lowVision || preferences.photosensitivity) && (
                <div style={{ marginBottom: theme.spacing.lg }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: theme.spacing.xs,
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    <span style={{ color: theme.colors.gray300 }}>
                      Contrast
                    </span>
                    <span style={{ color: theme.colors.gray400 }}>
                      {Math.round((adjustments.contrastLevel || 0.5) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={adjustments.contrastLevel || 0.5}
                    onChange={(e) =>
                      setAdjustments({
                        ...adjustments,
                        contrastLevel: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                </div>
              )}

              {preferences.tremors && (
                <div style={{ marginBottom: theme.spacing.lg }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: theme.spacing.xs,
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    <span style={{ color: theme.colors.gray300 }}>
                      Target Size
                    </span>
                    <span style={{ color: theme.colors.gray400 }}>
                      {Math.round((adjustments.targetSize || 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={adjustments.targetSize || 1}
                    onChange={(e) =>
                      setAdjustments({
                        ...adjustments,
                        targetSize: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                </div>
              )}

              {(preferences.cognitiveLoad || preferences.adhd) && (
                <div style={{ marginBottom: theme.spacing.lg }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: theme.spacing.xs,
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    <span style={{ color: theme.colors.gray300 }}>
                      Complexity
                    </span>
                    <span style={{ color: theme.colors.gray400 }}>
                      {Math.round((adjustments.complexity || 0.3) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={adjustments.complexity || 0.3}
                    onChange={(e) =>
                      setAdjustments({
                        ...adjustments,
                        complexity: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                </div>
              )}

              {preferences.dyslexia && (
                <div style={{ marginBottom: theme.spacing.sm }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: theme.spacing.xs,
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    <span style={{ color: theme.colors.gray300 }}>
                      Letter Spacing
                    </span>
                    <span style={{ color: theme.colors.gray400 }}>
                      {Math.round((adjustments.letterSpacing || 0.05) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.15"
                    step="0.01"
                    value={adjustments.letterSpacing || 0.05}
                    onChange={(e) =>
                      setAdjustments({
                        ...adjustments,
                        letterSpacing: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back to Chat */}
        {phase === "ui" && (
          <button
            onClick={() => {
              setPhase("chat");
              setThinkingDecisions([]);
              setGeneratedStyles(null);
              resetMetrics();
            }}
            style={{
              width: "100%",
              padding: theme.spacing.md,
              background: "transparent",
              color: theme.colors.gray400,
              border: `1px solid ${theme.colors.gray700}`,
              borderRadius: theme.radius.md,
              cursor: "pointer",
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            ← Back to Chat
          </button>
        )}

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: theme.spacing["2xl"] }}>
          <div
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.gray500,
              padding: theme.spacing.lg,
              background: theme.colors.gray800,
              borderRadius: theme.radius.md,
              lineHeight: theme.typography.lineHeight.base,
            }}
          >
            <strong style={{ color: theme.colors.gray400 }}>The Thesis:</strong>
            <br />
            "Accessibility isn't a checklist. It's a conversation between the
            interface and the person using it."
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={baseStyles.mainContent}>
        {/* Discovery Phase */}
        {phase === "discovery" && (
          <div style={baseStyles.centeredContainer}>
            <div style={{ maxWidth: "500px", width: "100%" }}>
              <div style={{ marginBottom: theme.spacing["3xl"] }}>
                <div
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.gray500,
                    marginBottom: theme.spacing.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}
                >
                  QUESTION {discoveryStep + 1} OF {discoveryQuestions.length}
                </div>
                <div style={baseStyles.progressBar}>
                  <div
                    style={{
                      ...baseStyles.progressFill,
                      width: `${
                        ((discoveryStep + 1) / discoveryQuestions.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <h2
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: theme.spacing["2xl"],
                  color: theme.colors.gray800,
                }}
              >
                {discoveryQuestions[discoveryStep].question}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing.md,
                }}
              >
                {discoveryQuestions[discoveryStep].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleDiscoveryAnswer(option)}
                    style={{
                      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                      fontSize: theme.typography.fontSize.lg,
                      background: theme.colors.white,
                      color: theme.colors.gray800,
                      border: `2px solid ${theme.colors.gray200}`,
                      borderRadius: theme.radius.lg,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: `all ${theme.transitions.base}`,
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setPhase("chat");
                  setChatMessages([
                    {
                      role: "assistant",
                      content:
                        "No problem! I'll create a standard interface for you. What would you like to do?",
                    },
                  ]);
                }}
                style={baseStyles.buttonGhost}
              >
                Skip questions →
              </button>
            </div>
          </div>
        )}

        {/* Chat Phase */}
        {phase === "chat" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: theme.colors.white,
            }}
          >
            <div
              style={{
                padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
                borderBottom: `1px solid ${theme.colors.gray200}`,
                background: theme.colors.gray50,
              }}
            >
              <h1
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: theme.spacing.xs,
                }}
              >
                AI Assistant
              </h1>
              <p
                style={{
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.gray500,
                }}
              >
                Tell me what you'd like to do, and I'll create a personalized
                interface.
              </p>
            </div>

            <div
              style={{
                flex: 1,
                padding: theme.spacing["2xl"],
                overflowY: "auto",
              }}
            >
              {chatMessages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {isTyping && <ChatMessage role="assistant" isTyping />}
            </div>

            <div
              style={{
                padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
                borderTop: `1px solid ${theme.colors.gray200}`,
                background: theme.colors.gray50,
              }}
            >
              <div style={{ display: "flex", gap: theme.spacing.md }}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Try: 'I'd like to translate some text'"
                  style={baseStyles.chatInput}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  style={{
                    ...baseStyles.chatSendButton,
                    ...(userInput.trim()
                      ? {}
                      : baseStyles.chatSendButtonDisabled),
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generating Phase */}
        {phase === "generating" && (
          <div style={baseStyles.centeredContainer}>
            <div style={{ maxWidth: "600px", width: "100%" }}>
              <h2
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: theme.spacing["2xl"],
                  textAlign: "center",
                }}
              >
                Building Your Interface
              </h2>
              <ThinkingPanel
                decisions={thinkingDecisions}
                isThinking={isThinking}
                conflicts={detectedConflicts}
              />
            </div>
          </div>
        )}

        {/* Generated UI Phase */}
        {phase === "ui" && generatedStyles && (
          <div style={{ flex: 1, overflow: "auto" }}>
            <div style={generatedStyles.container}>
              <GeneratedTranslationUI
                preferences={preferences}
                styles={generatedStyles}
                trackClick={trackClick}
                trackCorrection={trackCorrection}
                showVoiceInput={runtimeAdjustments.showVoiceInput}
              />

              {/* Authenticity Footer */}
              <div
                style={{
                  marginTop: theme.spacing["4xl"],
                  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                  background: generatedStyles.card.background,
                  borderRadius: theme.radius.md,
                  border: generatedStyles.card.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: theme.spacing.md,
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    color: generatedStyles.label.color,
                  }}
                >
                  ✦ This interface was personalized based on your preferences.
                  You're in control.
                </div>
                <div style={{ display: "flex", gap: theme.spacing.sm }}>
                  <button
                    onClick={() => setPhase("chat")}
                    style={{
                      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                      background: "transparent",
                      color: generatedStyles.label.color,
                      border: `1px solid ${theme.colors.gray300}`,
                      borderRadius: theme.radius.sm,
                      cursor: "pointer",
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    Adjust Preferences
                  </button>
                  <button
                    onClick={() => {
                      setPreferences({});
                      setAdjustments({
                        contrastLevel: 0.6,
                        targetSize: 1,
                        complexity: 0.3,
                      });
                      setRuntimeAdjustments({});
                      setGeneratedStyles(
                        generateAdaptiveStyles({}, "normal", {}, {})
                      );
                    }}
                    style={{
                      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                      background: "transparent",
                      color: generatedStyles.label.color,
                      border: `1px solid ${theme.colors.gray300}`,
                      borderRadius: theme.radius.sm,
                      cursor: "pointer",
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    Reset to Standard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Behavioral Suggestion Popup */}
      {suggestions.length > 0 && (
        <BehaviorSuggestion
          type={suggestions[0]}
          onAccept={() => handleAcceptSuggestion(suggestions[0])}
          onDismiss={() => dismissSuggestion(suggestions[0])}
        />
      )}
    </div>
  );
};

export default AdaptiveUIDemo;
