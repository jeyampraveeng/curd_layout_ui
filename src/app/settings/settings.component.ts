import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ThemeColor, ThemeService } from '../services/theme.service';
import { ThemeEditorDialogComponent } from '../theme-editor-dialog/theme-editor-dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  // Available themes
  themes: ThemeColor[] = ['purple', 'red', 'blue', 'green', 'orange'];
  selectedTheme: ThemeColor = 'purple';
  
  // Theme colors object for display
  themeColors: any = {};
  
  // Settings
  darkModeEnabled: boolean = false;
  notificationsEnabled: boolean = true;
  autoSaveEnabled: boolean = true;
  compactViewEnabled: boolean = false;
  fontSize: number = 14;
  language: string = 'en';
  
  // Language options
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' }
  ];
  
  constructor(
    private themeService: ThemeService,
    private dialog: MatDialog
  ) {
    // Subscribe to theme changes
    this.themeService.currentTheme.subscribe((theme) => {
      this.selectedTheme = theme;
    });
    
    // Get all theme colors
    this.themeColors = this.themeService.getThemeColors();
    
    // Get custom themes
    const customThemes = Object.keys(this.themeColors).filter(theme => 
      theme.startsWith('custom_'));
    
    // Add custom themes to the themes list
    this.themes = [...this.themes, ...customThemes];
  }
  
  ngOnInit(): void {
    // Load saved settings from localStorage
    this.loadSettings();
  }
  
  changeTheme(theme: ThemeColor) {
    this.selectedTheme = theme;
    this.themeService.changeTheme(theme);
    localStorage.setItem('selected-theme', theme);
  }
  
  getThemeColor(theme: ThemeColor): string {
    return this.themeService.getMainColor(theme);
  }
  
  getThemeTextColor(backgroundColor: string): string {
    // Convert hex to RGB
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    
    // Calculate perceived brightness (YIQ formula)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // Return black or white based on brightness
    return yiq >= 128 ? '#000000' : '#ffffff';
  }
  
  openThemeEditor(theme?: ThemeColor) {
    const dialogRef = this.dialog.open(ThemeEditorDialogComponent, {
      width: '500px',
      data: {
        theme: theme || this.selectedTheme,
        isNew: !theme,
        themeColors: this.themeColors
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update themes list and colors
        this.themeColors = this.themeService.getThemeColors();
        
        // Update themes list with any new custom themes
        const customThemes = Object.keys(this.themeColors).filter(theme => 
          theme.startsWith('custom_'));
        this.themes = [...['purple', 'red', 'blue', 'green', 'orange'], ...customThemes];
        
        // Apply the theme if it was changed
        if (result.theme) {
          this.changeTheme(result.theme);
        }
      }
    });
  }
  
  getThemeName(theme: string): string {
    if (theme.startsWith('custom_')) {
      return 'Custom ' + theme.split('_')[1].slice(0, 4);
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }
  
  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    document.body.classList.toggle('dark-mode', this.darkModeEnabled);
    localStorage.setItem('dark-mode-enabled', this.darkModeEnabled.toString());
  }
  
  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
    localStorage.setItem('notifications-enabled', this.notificationsEnabled.toString());
  }
  
  toggleAutoSave() {
    this.autoSaveEnabled = !this.autoSaveEnabled;
    localStorage.setItem('auto-save-enabled', this.autoSaveEnabled.toString());
  }
  
  toggleCompactView() {
    this.compactViewEnabled = !this.compactViewEnabled;
    document.body.classList.toggle('compact-view', this.compactViewEnabled);
    localStorage.setItem('compact-view-enabled', this.compactViewEnabled.toString());
  }
  
  updateFontSize(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.fontSize = parseInt(value);
    document.documentElement.style.setProperty('--base-font-size', `${this.fontSize}px`);
    localStorage.setItem('font-size', this.fontSize.toString());
  }
  
  changeLanguage(event: any) {
    this.language = event.value;
    localStorage.setItem('language', this.language);
    // Here you would typically call a language service to change the app language
  }
  
  resetAllSettings() {
    // Reset theme
    this.changeTheme('purple');
    
    // Reset dark mode
    this.darkModeEnabled = false;
    document.body.classList.remove('dark-mode');
    
    // Reset other settings
    this.notificationsEnabled = true;
    this.autoSaveEnabled = true;
    this.compactViewEnabled = false;
    document.body.classList.remove('compact-view');
    
    this.fontSize = 14;
    document.documentElement.style.setProperty('--base-font-size', `${this.fontSize}px`);
    
    this.language = 'en';
    
    // Clear all settings in localStorage
    localStorage.removeItem('dark-mode-enabled');
    localStorage.removeItem('notifications-enabled');
    localStorage.removeItem('auto-save-enabled');
    localStorage.removeItem('compact-view-enabled');
    localStorage.removeItem('font-size');
    localStorage.removeItem('language');
    localStorage.removeItem('selected-theme');
  }
  
  private loadSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme && this.themes.includes(savedTheme as ThemeColor)) {
      this.changeTheme(savedTheme as ThemeColor);
    }
    
    // Load dark mode setting
    this.darkModeEnabled = localStorage.getItem('dark-mode-enabled') === 'true';
    if (this.darkModeEnabled) {
      document.body.classList.add('dark-mode');
    }
    
    // Load notifications setting
    this.notificationsEnabled = localStorage.getItem('notifications-enabled') !== 'false';
    
    // Load auto-save setting
    this.autoSaveEnabled = localStorage.getItem('auto-save-enabled') !== 'false';
    
    // Load compact view setting
    this.compactViewEnabled = localStorage.getItem('compact-view-enabled') === 'true';
    if (this.compactViewEnabled) {
      document.body.classList.add('compact-view');
    }
    
    // Load font size setting
    const savedFontSize = localStorage.getItem('font-size');
    if (savedFontSize) {
      this.fontSize = parseInt(savedFontSize);
      document.documentElement.style.setProperty('--base-font-size', `${this.fontSize}px`);
    }
    
    // Load language setting
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && this.languages.find(lang => lang.code === savedLanguage)) {
      this.language = savedLanguage;
    }
  }
}