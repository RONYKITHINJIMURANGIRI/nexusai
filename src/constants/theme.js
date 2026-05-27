export const theme = {
  // Original theme properties (kept for backward compatibility)
  background: '#0f172a',
  panel: '#111827',
  border: 'rgba(148, 163, 184, 0.12)',
  text: '#e2e8f0',
  muted: '#94a3b8',
  accent: '#38bdf8',

  // Extended sophisticated theme structure
  colors: {
    // Backgrounds
    background: {
      default: '#0f172a',
      paper: '#111827',
      elevated: '#1e293b',
    },
    // Text
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
      disabled: '#64748b',
      onBackground: '#ffffff',
      onPaper: '#1e293b',
    },
    // Primary palette
    primary: {
      light: '#60a5fa',
      main: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    // Secondary palette
    secondary: {
      light: '#a78bfa',
      main: '#7c3aed',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    // Success palette
    success: {
      light: '#4ade80',
      main: '#22c55e',
      dark: '#166534',
      contrastText: '#ffffff',
    },
    // Warning palette
    warning: {
      light: '#fbbf24',
      main: '#f59e0b',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    // Error palette
    error: {
      light: '#f87171',
      main: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    // Info palette
    info: {
      light: '#60a5fa',
      main: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    // Dividers and borders
    divider: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.12)',
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 600,
      extraBold: 700,
      black: 800,
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  spacing: (factor) => `${0.25 * factor}rem`, // 0, 0.25, 0.5, 0.75, 1, etc.
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
  shadows: {
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  radius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      long: 350,
      longer: 400,
      longest: 500,
    },
    create: (props, options = {}) => {
      const { ease = transitions.easing.easeInOut, duration = transitions.duration.standard } = options;
      if (Array.isArray(props)) {
        return props.map((prop) => `${prop} ${duration}ms ${ease}`).join(', ');
      }
      return `${props} ${duration}ms ${ease}`;
    },
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1100,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};