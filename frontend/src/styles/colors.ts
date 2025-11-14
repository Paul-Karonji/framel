/**
 * Framel Color Palette
 * Design system colors for consistent branding
 */

export const colors = {
  // Primary - Blush Pink
  primary: {
    main: '#E89FAE',
    light: '#F5C5D0',
    dark: '#D67B8C',
    foreground: '#FFFFFF',
  },

  // Secondary - Sage Green
  secondary: {
    main: '#A8C3A6',
    light: '#C5D8C3',
    dark: '#8AA888',
    foreground: '#FFFFFF',
  },

  // Accent - Gold
  accent: {
    main: '#D9B26F',
    light: '#E5C68E',
    dark: '#C39E55',
    foreground: '#3A3A3A',
  },

  // Background
  background: {
    main: '#FFF9F5',    // Ivory White
    paper: '#FFFFFF',
  },

  // Text
  text: {
    primary: '#3A3A3A',    // Charcoal Gray
    secondary: '#6B6B6B',
  },

  // Status colors
  status: {
    error: '#E57373',       // Soft Red
    success: '#7BAE7F',     // Muted Green
    warning: '#FFB74D',     // Amber
    info: '#64B5F6',        // Blue
  },
} as const;

export default colors;
