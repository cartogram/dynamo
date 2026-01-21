"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// THEME CONFIGURATION
// ============================================

const theme = {
  colors: {
    primary: '#0066cc',
    primaryLight: '#f0f9ff',
    white: '#ffffff',
    black: '#000000',
    gray50: '#f8fafc',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1e293b',
    gray900: '#0f172a',
    success: '#10b981',
    warning: '#fbbf24',
    error: '#ef4444',
  },
  typography: {
    fontFamily: {
      base: "'Inter', -apple-system, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '15px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '28px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      base: '1.6',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 40px rgba(0,0,0,0.15)',
    xl: '0 20px 60px rgba(0,0,0,0.2)',
  },
  transitions: {
    base: '0.2s ease',
    slow: '0.3s ease',
    slower: '0.4s ease',
  },
};

// ============================================
// CSS ANIMATIONS
// ============================================

const cssAnimations = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  .typing-animation {
    display: inline-block;
    animation: pulse 1s infinite;
  }
`;

// ============================================
// CONFIGURATION
// ============================================

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
];

const profiles = {
  james: {
    name: 'James',
    description: 'ADHD + Cognitive load sensitivity',
    preferences: { adhd: true, cognitiveLoad: true },
    showAutoSuggestion: false,
    thinkingDecisions: [
      { text: 'ADHD detected → Minimal UI elements', applied: true },
      { text: 'Cognitive load sensitivity detected → Step-by-step flow', applied: true },
      { text: 'Reducing visual complexity', applied: true },
      { text: 'Hiding secondary actions', applied: true },
      { text: 'Motor difficulties not detected → Standard touch targets', applied: false },
      { text: 'Vision issues not detected → Standard contrast', applied: false },
    ],
    conflicts: [],
  },
  alex: {
    name: 'Alex',
    description: 'Low vision + Photosensitivity',
    preferences: { lowVision: true, photosensitivity: true },
    showAutoSuggestion: true,
    thinkingDecisions: [
      { text: 'Low vision detected → Increased text size', applied: true },
      { text: 'Photosensitivity detected → Dark theme preferred', applied: true },
      { text: 'Applying warm accent colors', applied: true },
      { text: 'Increasing border visibility', applied: true },
      { text: 'Cognitive difficulties not detected → Full layout', applied: false },
    ],
    conflicts: [
      {
        description: 'Low vision typically requires high contrast, but photosensitivity requires reduced brightness.',
        resolution: "Using a dark theme with moderate contrast (5:1) and warm accent colors instead of bright whites.",
      },
    ],
  },
};

// ============================================
// STYLE GENERATION
// ============================================

const generateAdaptiveStyles = (preferences, adjustments, darkMode) => {
  const t = theme;
  const contrastLevel = adjustments?.contrastLevel ?? 0.6;
  const complexity = adjustments?.complexity ?? 0.3;
  const sizeScale = adjustments?.sizeScale ?? 1;

  // Base font size scaled
  const baseFontSize = Math.round(16 * sizeScale);
  const largeFontSize = Math.round(20 * sizeScale);
  const headingFontSize = Math.round(24 * sizeScale);

  let styles = {
    container: {
      minHeight: '100vh',
      padding: t.spacing['3xl'],
      paddingTop: '80px',
      fontFamily: t.typography.fontFamily.base,
      background: darkMode ? t.colors.gray900 : t.colors.white,
      color: darkMode ? t.colors.gray100 : t.colors.gray900,
      transition: `all ${t.transitions.slower}`,
      lineHeight: t.typography.lineHeight.base,
    },
    card: {
      background: darkMode ? t.colors.gray800 : t.colors.gray100,
      borderRadius: t.radius.lg,
      padding: `${Math.round(24 * sizeScale)}px`,
      border: `1px solid ${darkMode ? t.colors.gray700 : t.colors.gray200}`,
    },
    input: {
      width: '100%',
      minHeight: `${Math.round(180 * sizeScale)}px`,
      padding: `${Math.round(16 * sizeScale)}px`,
      fontSize: `${baseFontSize}px`,
      border: `1px solid ${darkMode ? t.colors.gray600 : t.colors.gray300}`,
      borderRadius: t.radius.md,
      resize: 'vertical',
      lineHeight: t.typography.lineHeight.base,
      fontFamily: 'inherit',
      background: darkMode ? t.colors.gray800 : t.colors.white,
      color: darkMode ? t.colors.gray100 : t.colors.gray900,
    },
    button: {
      padding: `${Math.round(12 * sizeScale)}px ${Math.round(24 * sizeScale)}px`,
      fontSize: `${baseFontSize}px`,
      fontWeight: t.typography.fontWeight.semibold,
      background: t.colors.primary,
      color: t.colors.white,
      border: 'none',
      borderRadius: t.radius.md,
      cursor: 'pointer',
      transition: `all ${t.transitions.base}`,
    },
    buttonSecondary: {
      padding: `${Math.round(10 * sizeScale)}px ${Math.round(20 * sizeScale)}px`,
      fontSize: `${Math.round(14 * sizeScale)}px`,
      fontWeight: t.typography.fontWeight.medium,
      background: 'transparent',
      color: darkMode ? t.colors.gray300 : t.colors.gray700,
      border: `1px solid ${darkMode ? t.colors.gray600 : t.colors.gray300}`,
      borderRadius: t.radius.md,
      cursor: 'pointer',
    },
    select: {
      padding: `${Math.round(12 * sizeScale)}px ${Math.round(16 * sizeScale)}px`,
      fontSize: `${baseFontSize}px`,
      border: `1px solid ${darkMode ? t.colors.gray600 : t.colors.gray300}`,
      borderRadius: t.radius.md,
      background: darkMode ? t.colors.gray800 : t.colors.white,
      color: darkMode ? t.colors.gray100 : t.colors.gray900,
      minWidth: '180px',
    },
    label: {
      fontSize: `${Math.round(14 * sizeScale)}px`,
      fontWeight: t.typography.fontWeight.semibold,
      marginBottom: t.spacing.sm,
      display: 'block',
      color: darkMode ? t.colors.gray300 : t.colors.gray700,
    },
    heading: {
      fontSize: `${headingFontSize}px`,
      fontWeight: t.typography.fontWeight.bold,
      marginBottom: t.spacing['2xl'],
      color: darkMode ? t.colors.gray100 : t.colors.gray900,
    },
    layout: 'horizontal',
    showSecondaryActions: true,
    showAllOptions: true,
  };

  // James: ADHD + Cognitive Load
  if (preferences.cognitiveLoad || preferences.adhd) {
    styles.layout = complexity < 0.7 ? 'vertical' : 'horizontal';
    styles.showSecondaryActions = complexity > 0.5;
    styles.showAllOptions = complexity > 0.3;
  }

  // Alex: Low Vision + Photosensitivity
  if (preferences.lowVision && preferences.photosensitivity) {
    const textColor = `rgba(255, 255, 255, ${0.5 + contrastLevel * 0.5})`;
    const accentColor = `rgba(255, 200, 150, ${0.3 + contrastLevel * 0.7})`;
    const buttonBg = `rgba(255, 180, 100, ${0.5 + contrastLevel * 0.5})`;
    const borderWidth = Math.round(1 + contrastLevel * 2);

    styles.container = { 
      ...styles.container, 
      background: '#0a0a0f',
      color: textColor,
    };
    styles.card = { 
      ...styles.card, 
      background: '#1a1a24', 
      border: `${borderWidth}px solid ${accentColor}`,
    };
    styles.input = { 
      ...styles.input, 
      fontSize: `${largeFontSize}px`, 
      background: '#1a1a24', 
      color: textColor, 
      border: `${borderWidth}px solid ${accentColor}`,
    };
    styles.button = { 
      ...styles.button, 
      fontSize: `${largeFontSize}px`, 
      padding: `${Math.round(16 * sizeScale)}px ${Math.round(32 * sizeScale)}px`,
      background: buttonBg, 
      color: '#1a1a1a',
    };
    styles.buttonSecondary = {
      ...styles.buttonSecondary,
      color: textColor,
      border: `1px solid ${accentColor}`,
    };
    styles.select = { 
      ...styles.select, 
      fontSize: `${largeFontSize}px`, 
      background: '#1a1a24', 
      color: textColor, 
      border: `${borderWidth}px solid ${accentColor}`,
    };
    styles.label = { 
      ...styles.label, 
      fontSize: `${Math.round(18 * sizeScale)}px`, 
      color: accentColor,
    };
    styles.heading = { 
      ...styles.heading, 
      fontSize: `${Math.round(28 * sizeScale)}px`, 
      color: accentColor,
    };
  }

  return styles;
};

// ============================================
// COMPONENTS
// ============================================

// Settings Icon (SVG)
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// Sun Icon
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

// Moon Icon
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

// Settings Popover
const SettingsPopover = ({ isOpen, onClose, adjustments, onAdjustmentsChange, darkMode, onDarkModeChange }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 998,
        }}
      />
      {/* Popover */}
      <div style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: theme.spacing.sm,
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.xl,
        width: '280px',
        boxShadow: theme.shadows.xl,
        border: `1px solid ${theme.colors.gray200}`,
        zIndex: 999,
        animation: 'fadeIn 0.15s ease-out',
      }}>
        <div style={{ 
          fontWeight: theme.typography.fontWeight.semibold, 
          marginBottom: theme.spacing.lg,
          color: theme.colors.gray900,
          fontSize: theme.typography.fontSize.base,
        }}>
          Interface Settings
        </div>

        {/* Complexity Slider */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
          }}>
            <span>Complexity</span>
            <span style={{ color: theme.colors.gray500 }}>{Math.round((adjustments.complexity || 0.3) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={adjustments.complexity || 0.3}
            onChange={(e) => onAdjustmentsChange({ ...adjustments, complexity: parseFloat(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.gray400,
            marginTop: theme.spacing.xs,
          }}>
            <span>Simple</span>
            <span>Full</span>
          </div>
        </div>

        {/* Contrast Slider */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
          }}>
            <span>Contrast</span>
            <span style={{ color: theme.colors.gray500 }}>{Math.round((adjustments.contrastLevel || 0.6) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={adjustments.contrastLevel || 0.6}
            onChange={(e) => onAdjustmentsChange({ ...adjustments, contrastLevel: parseFloat(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.gray400,
            marginTop: theme.spacing.xs,
          }}>
            <span>Lower</span>
            <span>Higher</span>
          </div>
        </div>

        {/* Size Slider */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
          }}>
            <span>Size</span>
            <span style={{ color: theme.colors.gray500 }}>{Math.round((adjustments.sizeScale || 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.4"
            step="0.05"
            value={adjustments.sizeScale || 1}
            onChange={(e) => onAdjustmentsChange({ ...adjustments, sizeScale: parseFloat(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.gray400,
            marginTop: theme.spacing.xs,
          }}>
            <span>Smaller</span>
            <span>Larger</span>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: theme.spacing.lg,
          borderTop: `1px solid ${theme.colors.gray200}`,
        }}>
          <span style={{ 
            fontSize: theme.typography.fontSize.sm, 
            color: theme.colors.gray700,
          }}>
            Dark Mode
          </span>
          <button
            onClick={() => onDarkModeChange(!darkMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              background: darkMode ? theme.colors.gray800 : theme.colors.gray100,
              color: darkMode ? theme.colors.gray100 : theme.colors.gray700,
              border: `1px solid ${darkMode ? theme.colors.gray600 : theme.colors.gray300}`,
              borderRadius: theme.radius.md,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            {darkMode ? <MoonIcon /> : <SunIcon />}
            {darkMode ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </>
  );
};

// Demo Toolbar
const DemoToolbar = ({ 
  currentProfile, 
  onProfileChange, 
  adjustments, 
  onAdjustmentsChange,
  darkMode,
  onDarkModeChange,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: '#18181b',
      borderBottom: '1px solid #3f3f46',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `0 ${theme.spacing['2xl']}`,
      zIndex: 1000,
      fontFamily: theme.typography.fontFamily.mono,
    }}>
      {/* Left: Demo label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg }}>
        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          borderRadius: theme.radius.sm,
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.bold,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Demo
        </div>
        <span style={{ color: '#a1a1aa', fontSize: theme.typography.fontSize.sm }}>
          Adaptive UI Generation
        </span>
      </div>

      {/* Center: Profile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
        <span style={{ color: '#71717a', fontSize: theme.typography.fontSize.sm, marginRight: theme.spacing.sm }}>
          User:
        </span>
        {Object.entries(profiles).map(([key, p]) => (
          <button
            key={key}
            onClick={() => onProfileChange(key)}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              background: currentProfile === key ? '#3b82f6' : '#27272a',
              color: currentProfile === key ? 'white' : '#a1a1aa',
              border: currentProfile === key ? '1px solid #3b82f6' : '1px solid #3f3f46',
              borderRadius: theme.radius.md,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              fontFamily: 'inherit',
              transition: `all ${theme.transitions.base}`,
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Right: Settings Button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            background: settingsOpen ? '#3f3f46' : '#27272a',
            color: '#a1a1aa',
            border: '1px solid #3f3f46',
            borderRadius: theme.radius.md,
            cursor: 'pointer',
            fontSize: theme.typography.fontSize.sm,
            fontFamily: 'inherit',
          }}
        >
          <SettingsIcon />
          <span>Settings</span>
        </button>
        
        <SettingsPopover
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          adjustments={adjustments}
          onAdjustmentsChange={onAdjustmentsChange}
          darkMode={darkMode}
          onDarkModeChange={onDarkModeChange}
        />
      </div>
    </div>
  );
};

// Thinking Panel
const ThinkingPanel = ({ decisions, isThinking, conflicts }) => {
  if (!isThinking && decisions.length === 0 && conflicts.length === 0) return null;

  return (
    <div style={{
      background: '#1a1a2e',
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing['2xl'],
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: theme.typography.fontSize.sm,
    }}>
      <div style={{ 
        color: '#818cf8', 
        fontWeight: theme.typography.fontWeight.semibold, 
        marginBottom: theme.spacing.lg,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}>
        <span>🧠</span> AI Reasoning
        {isThinking && <span style={{ opacity: 0.6 }}>thinking...</span>}
      </div>

      {conflicts.length > 0 && (
        <div style={{ marginBottom: theme.spacing.lg }}>
          {conflicts.map((conflict, i) => (
            <div key={i} style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.sm,
            }}>
              <div style={{ color: theme.colors.warning, fontWeight: theme.typography.fontWeight.semibold, marginBottom: theme.spacing.sm }}>
                ⚠️ Conflict Detected
              </div>
              <div style={{ color: theme.colors.gray300, marginBottom: theme.spacing.sm }}>
                {conflict.description}
              </div>
              <div style={{ color: theme.colors.success }}>
                ✓ Resolution: {conflict.resolution}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        {decisions.map((decision, i) => (
          <div 
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: theme.spacing.sm,
              color: decision.applied ? theme.colors.success : theme.colors.gray500,
              opacity: isThinking && i === decisions.length - 1 ? 0.6 : 1,
            }}
          >
            <span>{decision.applied ? '✓' : '✗'}</span>
            <span>{decision.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chat Message
const ChatMessage = ({ role, content, isTyping }) => {
  const isAssistant = role === 'assistant';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isAssistant ? 'flex-start' : 'flex-end',
      marginBottom: theme.spacing.lg,
    }}>
      <div style={{
        maxWidth: '85%',
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
        borderRadius: isAssistant ? `${theme.radius.sm} ${theme.radius.xl} ${theme.radius.xl} ${theme.radius.xl}` : `${theme.radius.xl} ${theme.radius.sm} ${theme.radius.xl} ${theme.radius.xl}`,
        background: isAssistant ? theme.colors.gray100 : theme.colors.primary,
        color: isAssistant ? theme.colors.gray900 : theme.colors.white,
        fontSize: theme.typography.fontSize.md,
        lineHeight: theme.typography.lineHeight.base,
      }}>
        {isTyping ? <span className="typing-animation">●●●</span> : content}
      </div>
    </div>
  );
};

// Auto-suggestion Popup
const AutoSuggestion = ({ onAccept, onDismiss }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: theme.spacing['2xl'],
      right: theme.spacing['2xl'],
      background: theme.colors.white,
      borderRadius: theme.radius.xl,
      padding: theme.spacing['2xl'],
      maxWidth: '400px',
      boxShadow: theme.shadows.xl,
      border: `1px solid ${theme.colors.gray200}`,
      animation: 'slideUp 0.3s ease-out',
      zIndex: 1000,
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: theme.spacing.md, 
        marginBottom: theme.spacing.md,
      }}>
        <span style={{ fontSize: '28px' }}>💡</span>
        <span style={{ 
          fontWeight: theme.typography.fontWeight.bold, 
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.gray900,
        }}>
          Personalization Available
        </span>
      </div>
      <p style={{ 
        color: theme.colors.gray600, 
        marginBottom: theme.spacing.xl, 
        lineHeight: theme.typography.lineHeight.base,
        fontSize: theme.typography.fontSize.md,
      }}>
        I've detected that you may benefit from adjusted contrast settings. Would you like me to optimize the interface for better visibility while reducing eye strain?
      </p>
      <div style={{ display: 'flex', gap: theme.spacing.md }}>
        <button 
          onClick={onAccept} 
          style={{ 
            flex: 1,
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.semibold,
            background: theme.colors.primary,
            color: theme.colors.white,
            border: 'none',
            borderRadius: theme.radius.md,
            cursor: 'pointer',
          }}
        >
          Yes, optimize for me
        </button>
        <button 
          onClick={onDismiss} 
          style={{ 
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
            background: theme.colors.gray100,
            color: theme.colors.gray700,
            border: 'none',
            borderRadius: theme.radius.md,
            cursor: 'pointer',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
};

// Translation UI
const TranslationUI = ({ preferences, styles }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('de');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedText(`[${targetLang.toUpperCase()}] ${sourceText}`);
      setIsTranslating(false);
    }, 800);
  };

  const stepIndicatorStyle = {
    background: theme.colors.primary,
    color: theme.colors.white,
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
  };

  // Simplified vertical layout (James)
  if (styles.layout === 'vertical') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={styles.heading}>Translate Text</h2>
        
        <div style={{ ...styles.card, marginBottom: theme.spacing['2xl'] }}>
          <div style={{ marginBottom: theme.spacing.xl }}>
            <label style={styles.label}>
              <span style={stepIndicatorStyle}>1</span>
              From
            </label>
            <select 
              value={sourceLang} 
              onChange={(e) => setSourceLang(e.target.value)} 
              style={{ ...styles.select, width: '100%' }}
            >
              {(styles.showAllOptions ? languages : languages.slice(0, 3)).map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={styles.label}>
              <span style={stepIndicatorStyle}>2</span>
              To
            </label>
            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)} 
              style={{ ...styles.select, width: '100%' }}
            >
              {(styles.showAllOptions ? languages : languages.slice(0, 3)).map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom: theme.spacing['2xl'] }}>
          <label style={styles.label}>
            <span style={stepIndicatorStyle}>3</span>
            Type your text
          </label>
          <textarea 
            value={sourceText} 
            onChange={(e) => setSourceText(e.target.value)} 
            placeholder="Enter text here..." 
            style={styles.input} 
          />
        </div>

        <button 
          onClick={handleTranslate} 
          disabled={!sourceText || isTranslating} 
          style={{ 
            ...styles.button, 
            width: '100%', 
            marginBottom: theme.spacing['2xl'], 
            opacity: !sourceText ? 0.5 : 1,
          }}
        >
          <span style={{ ...stepIndicatorStyle, background: 'rgba(255,255,255,0.2)' }}>4</span>
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>

        {translatedText && (
          <div style={{ 
            ...styles.card, 
            background: theme.colors.primaryLight, 
            border: `2px solid ${theme.colors.primary}`,
          }}>
            <label style={styles.label}>Translation</label>
            <div style={{ ...styles.input, minHeight: '100px', background: 'transparent', border: 'none' }}>
              {translatedText}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Horizontal layout (Alex)
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={styles.heading}>Translation</h2>
      
      <div style={{ 
        display: 'flex', 
        gap: theme.spacing['2xl'], 
        marginBottom: theme.spacing.xl, 
        flexWrap: 'wrap', 
        alignItems: 'flex-end',
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={styles.label}>Source Language</label>
          <select 
            value={sourceLang} 
            onChange={(e) => setSourceLang(e.target.value)} 
            style={{ ...styles.select, width: '100%' }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={() => { setSourceLang(targetLang); setTargetLang(sourceLang); }} 
          style={{ ...styles.buttonSecondary, marginBottom: '0' }}
        >
          ⇄ Swap
        </button>
        
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={styles.label}>Target Language</label>
          <select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)} 
            style={{ ...styles.select, width: '100%' }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: theme.spacing['2xl'], 
        marginBottom: theme.spacing['2xl'],
      }}>
        <div style={styles.card}>
          <label style={styles.label}>Source Text</label>
          <textarea 
            value={sourceText} 
            onChange={(e) => setSourceText(e.target.value)} 
            placeholder="Enter text to translate..." 
            style={styles.input} 
          />
          {styles.showSecondaryActions && (
            <div style={{ marginTop: theme.spacing.md, display: 'flex', gap: theme.spacing.sm }}>
              <button 
                onClick={() => setSourceText('')} 
                style={{ ...styles.buttonSecondary, color: theme.colors.error, borderColor: theme.colors.error }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div style={{ 
          ...styles.card, 
          background: preferences.lowVision ? '#1a2a1a' : theme.colors.primaryLight, 
          border: preferences.lowVision ? '3px solid #00cc66' : `2px solid ${theme.colors.primary}`,
        }}>
          <label style={styles.label}>Translation</label>
          <div style={{ ...styles.input, background: 'transparent', border: 'none' }}>
            {isTranslating ? (
              <span style={{ opacity: 0.6 }}>Translating...</span>
            ) : translatedText || (
              <span style={{ opacity: 0.4 }}>Translation will appear here...</span>
            )}
          </div>
          {styles.showSecondaryActions && translatedText && (
            <div style={{ marginTop: theme.spacing.md }}>
              <button 
                onClick={() => navigator.clipboard?.writeText(translatedText.replace(/^\[.*?\]\s*/, ''))} 
                style={styles.buttonSecondary}
              >
                📋 Copy
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={handleTranslate} 
          disabled={!sourceText || isTranslating} 
          style={{ ...styles.button, opacity: !sourceText ? 0.5 : 1 }}
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

const AdaptiveUIDemo = () => {
  const [currentProfile, setCurrentProfile] = useState('james');
  const [adjustments, setAdjustments] = useState({ contrastLevel: 0.6, complexity: 0.3, sizeScale: 1 });
  const [darkMode, setDarkMode] = useState(false);
  const [phase, setPhase] = useState('chat'); // chat, generating, ui
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: `Hi! I'm ready to help you translate text. Just let me know what you'd like to do.` }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingDecisions, setThinkingDecisions] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  const suggestionTimerRef = useRef(null);
  const profile = profiles[currentProfile];

  // Generate styles
  const styles = generateAdaptiveStyles(profile.preferences, adjustments, darkMode);

  // Handle profile change
  const handleProfileChange = (newProfile) => {
    setCurrentProfile(newProfile);
    setPhase('chat');
    setChatMessages([
      { role: 'assistant', content: `Hi ${profiles[newProfile].name}! I'm ready to help you translate text. Just let me know what you'd like to do.` }
    ]);
    setThinkingDecisions([]);
    setShowSuggestion(false);
    
    // Clear existing timer
    if (suggestionTimerRef.current) {
      clearTimeout(suggestionTimerRef.current);
    }
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const wantsTranslate = userInput.toLowerCase().includes('translat');
      
      if (wantsTranslate) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'll create a personalized translation interface for you. Analyzing your preferences...",
        }]);
        
        setTimeout(() => {
          setPhase('generating');
          setIsThinking(true);
          
          // Animate thinking decisions
          const decisions = profile.thinkingDecisions;
          decisions.forEach((decision, i) => {
            setTimeout(() => {
              setThinkingDecisions(prev => [...prev, decision]);
              if (i === decisions.length - 1) {
                setIsThinking(false);
                setTimeout(() => {
                  setPhase('ui');
                  
                  // Show auto-suggestion for Alex after 3 seconds
                  if (profile.showAutoSuggestion) {
                    suggestionTimerRef.current = setTimeout(() => {
                      setShowSuggestion(true);
                    }, 3000);
                  }
                }, 1000);
              }
            }, i * 300);
          });
        }, 1000);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: "I can help you with translation! Just say something like \"I'd like to translate some text\" and I'll create a personalized interface for you.",
        }]);
      }
    }, 1000);
  };

  // Handle accepting auto-suggestion
  const handleAcceptSuggestion = () => {
    setAdjustments(prev => ({ ...prev, contrastLevel: 0.85 }));
    setShowSuggestion(false);
  };

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (suggestionTimerRef.current) {
        clearTimeout(suggestionTimerRef.current);
      }
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', fontFamily: theme.typography.fontFamily.base }}>
      <style>{cssAnimations}</style>

      {/* Demo Toolbar */}
      <DemoToolbar
        currentProfile={currentProfile}
        onProfileChange={handleProfileChange}
        adjustments={adjustments}
        onAdjustmentsChange={setAdjustments}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
      />

      {/* Chat Phase */}
      {phase === 'chat' && (
        <div style={{ 
          paddingTop: '64px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.colors.white,
        }}>
          <div style={{
            padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
            borderBottom: `1px solid ${theme.colors.gray200}`,
            background: theme.colors.gray50,
          }}>
            <h1 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, marginBottom: theme.spacing.xs }}>
              AI Assistant
            </h1>
            <p style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.gray500 }}>
              Tell me what you'd like to do, and I'll create a personalized interface.
            </p>
          </div>

          <div style={{ flex: 1, padding: theme.spacing['2xl'], overflowY: 'auto' }}>
            {chatMessages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {isTyping && <ChatMessage role="assistant" isTyping />}
          </div>

          <div style={{
            padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
            borderTop: `1px solid ${theme.colors.gray200}`,
            background: theme.colors.gray50,
          }}>
            <div style={{ display: 'flex', gap: theme.spacing.md }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Try: 'I'd like to translate some text'"
                style={{
                  flex: 1,
                  padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                  fontSize: theme.typography.fontSize.md,
                  border: `1px solid ${theme.colors.gray300}`,
                  borderRadius: theme.radius.full,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
                  background: userInput.trim() ? theme.colors.primary : theme.colors.gray300,
                  color: theme.colors.white,
                  border: 'none',
                  borderRadius: theme.radius.full,
                  fontWeight: theme.typography.fontWeight.semibold,
                  cursor: userInput.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generating Phase */}
      {phase === 'generating' && (
        <div style={{
          paddingTop: '64px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.colors.gray50,
          padding: theme.spacing['2xl'],
        }}>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <h2 style={{ 
              fontSize: theme.typography.fontSize['3xl'], 
              fontWeight: theme.typography.fontWeight.bold, 
              marginBottom: theme.spacing['2xl'],
              textAlign: 'center',
              color: theme.colors.gray900,
            }}>
              Building Your Interface
            </h2>
            <ThinkingPanel 
              decisions={thinkingDecisions} 
              isThinking={isThinking} 
              conflicts={profile.conflicts} 
            />
          </div>
        </div>
      )}

      {/* Generated UI Phase */}
      {phase === 'ui' && (
        <div style={styles.container}>
          <TranslationUI preferences={profile.preferences} styles={styles} />
          
          {/* Footer */}
          <div style={{
            marginTop: theme.spacing['4xl'],
            padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
            background: styles.card.background,
            borderRadius: theme.radius.md,
            border: styles.card.border,
            maxWidth: styles.layout === 'vertical' ? '600px' : '1000px',
            margin: `${theme.spacing['4xl']} auto 0`,
          }}>
            <div style={{ 
              fontSize: theme.typography.fontSize.sm, 
              color: styles.label.color,
              opacity: 0.8,
            }}>
              ✦ This interface was personalized for <strong>{profile.name}</strong> based on: {profile.description}
            </div>
          </div>
        </div>
      )}

      {/* Auto-suggestion popup */}
      {showSuggestion && (
        <AutoSuggestion
          onAccept={handleAcceptSuggestion}
          onDismiss={() => setShowSuggestion(false)}
        />
      )}
    </div>
  );
};

export default AdaptiveUIDemo;
