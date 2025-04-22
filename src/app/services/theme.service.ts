import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeColor = 'purple' | 'red' | 'blue' | 'green' | 'orange' | string;

interface ThemeColorSet {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
  main: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSource = new BehaviorSubject<ThemeColor>('purple');
  currentTheme = this.themeSource.asObservable();
  
  private themeColors: Record<string, ThemeColorSet> = {
    purple: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#3b0764',
      main: '#6d28d9' // Main color for swatch
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
      main: '#dc2626' // Main color for swatch
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
      main: '#2563eb' // Main color for swatch
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
      main: '#16a34a' // Main color for swatch
    },
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
      main: '#ea580c' // Main color for swatch
    },
  };
  
  constructor() {
    // Load custom themes from localStorage
    this.loadCustomThemes();
    
    const savedTheme = localStorage.getItem('app-theme') || 'purple';
    this.themeSource.next(savedTheme);
    this.applyTheme(savedTheme);
  }
  
  changeTheme(color: ThemeColor) {
    localStorage.setItem('app-theme', color);
    this.themeSource.next(color);
    this.applyTheme(color);
  }
  
  getThemeColors() {
    return this.themeColors;
  }
  
  getMainColor(theme: ThemeColor): string {
    return this.themeColors[theme]?.main || theme;
  }
  
  /**
   * Update an existing theme color
   */
  updateThemeColor(theme: ThemeColor, newColor: string) {
    if (this.themeColors[theme]) {
      // Generate shade variants based on the new color
      const shades = this.generateColorShades(newColor);
      
      // Update all colors in the theme
      Object.keys(this.themeColors[theme]).forEach(shade => {
        if (shade in shades) {
          this.themeColors[theme][shade as keyof ThemeColorSet] = shades[shade as keyof ThemeColorSet]!;
        }
      });
      
      // Update the main color
      this.themeColors[theme].main = newColor;
      
      // If this is the current theme, apply changes
      if (this.themeSource.value === theme) {
        this.applyTheme(theme);
      }
      
      // Save custom themes to localStorage
      this.saveCustomThemes();
    }
  }
  
  /**
   * Add a new custom theme
   */
  addCustomTheme(color: string) {
    // Generate a unique theme name
    const customThemeName = `custom_${new Date().getTime()}`;
    
    // Generate shade variants
    const shades = this.generateColorShades(color);
    
    // Ensure all required properties are present by creating a complete ThemeColorSet
    const completeTheme: ThemeColorSet = {
      50: shades[50] || '#ffffff',
      100: shades[100] || '#f7f7f7',
      200: shades[200] || '#e5e5e5',
      300: shades[300] || '#d4d4d4',
      400: shades[400] || '#a3a3a3',
      500: shades[500] || color,
      600: shades[600] || '#6b7280',
      700: shades[700] || '#4b5563',
      800: shades[800] || '#1f2937',
      900: shades[900] || '#111827',
      950: shades[950] || '#030712',
      main: color
    };
    
    // Add the new theme
    this.themeColors[customThemeName] = completeTheme;
    
    // Apply the new theme
    this.changeTheme(customThemeName);
    
    // Save custom themes to localStorage
    this.saveCustomThemes();
    
    return customThemeName;
  }
  
  /**
   * Generate color shades based on a main color
   */
  private generateColorShades(mainColor: string): Partial<ThemeColorSet> {
    // Simple algorithm to generate shades from a hex color
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    const rgbToHex = (r: number, g: number, b: number) => {
      return '#' + [r, g, b].map(x => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };
    
    // Convert main color to RGB
    const [r, g, b] = hexToRgb(mainColor);
    
    // Generate lighter and darker shades
    const shades: Partial<ThemeColorSet> = {
      50: rgbToHex(r + (255 - r) * 0.9, g + (255 - g) * 0.9, b + (255 - b) * 0.9),
      100: rgbToHex(r + (255 - r) * 0.8, g + (255 - g) * 0.8, b + (255 - b) * 0.8),
      200: rgbToHex(r + (255 - r) * 0.6, g + (255 - g) * 0.6, b + (255 - b) * 0.6),
      300: rgbToHex(r + (255 - r) * 0.4, g + (255 - g) * 0.4, b + (255 - b) * 0.4),
      400: rgbToHex(r + (255 - r) * 0.2, g + (255 - g) * 0.2, b + (255 - b) * 0.2),
      500: mainColor,
      600: rgbToHex(r * 0.8, g * 0.8, b * 0.8),
      700: rgbToHex(r * 0.6, g * 0.6, b * 0.6),
      800: rgbToHex(r * 0.4, g * 0.4, b * 0.4),
      900: rgbToHex(r * 0.2, g * 0.2, b * 0.2),
      950: rgbToHex(r * 0.1, g * 0.1, b * 0.1),
    };
    
    return shades;
  }
  
  private applyTheme(color: ThemeColor) {
    const root = document.documentElement;
    const colors = this.themeColors[color];
    
    if (!colors) return;
    
    Object.entries(colors).forEach(([shade, value]) => {
      if (shade !== 'main') {
        root.style.setProperty(`--theme-${shade}`, value);
      }
    });
    
    root.style.setProperty('--primary', colors[700]);
    root.style.setProperty('--primary-light', colors[400]);
    root.style.setProperty('--primary-dark', colors[900]);
    root.style.setProperty('--accent', colors[300]);
  }
  
  private saveCustomThemes() {
    const customThemes: Record<string, ThemeColorSet> = {};
    
    // Extract only custom themes (those starting with 'custom_')
    Object.entries(this.themeColors).forEach(([name, colors]) => {
      if (name.startsWith('custom_')) {
        customThemes[name] = colors;
      }
    });
    
    localStorage.setItem('custom-themes', JSON.stringify(customThemes));
  }
  
  private loadCustomThemes() {
    const customThemesJson = localStorage.getItem('custom-themes');
    if (customThemesJson) {
      try {
        const customThemes = JSON.parse(customThemesJson);
        Object.entries(customThemes).forEach(([name, colors]) => {
          this.themeColors[name] = colors as ThemeColorSet;
        });
      } catch (e) {
        console.error('Failed to parse custom themes from localStorage', e);
      }
    }
  }
}