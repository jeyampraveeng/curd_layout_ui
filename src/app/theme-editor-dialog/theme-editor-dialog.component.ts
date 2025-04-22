import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ThemeColor, ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isNew ? 'Create Custom Theme' : 'Edit Theme' }}</h2>
    
    <mat-dialog-content>
      <div class="color-input-group">
        <input type="color"
               [(ngModel)]="customColor"
               class="color-input"
               [style.background-color]="customColor">
              
        <mat-form-field appearance="outline" class="hex-input">
          <mat-label>Primary Color (Hex)</mat-label>
          <input matInput [(ngModel)]="customColor" placeholder="#HEXCODE">
        </mat-form-field>
      </div>
      
      <div class="color-preview" [style.background-color]="customColor">
        <span [style.color]="getThemeTextColor(customColor)">Preview Text</span>
      </div>
      
      <mat-form-field appearance="outline" class="theme-name-input" *ngIf="data.isNew">
        <mat-label>Theme Name (Optional)</mat-label>
        <input matInput [(ngModel)]="themeName" placeholder="My Theme">
      </mat-form-field>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="saveTheme()">
        {{ data.isNew ? 'Create Theme' : 'Update Theme' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .color-input-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .color-input {
      width: 60px;
      height: 60px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .hex-input {
      flex: 1;
    }
    
    .color-preview {
      height: 80px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .theme-name-input {
      width: 100%;
    }
  `]
})
export class ThemeEditorDialogComponent implements OnInit {
  customColor: string = '#6d28d9';
  themeName: string = '';
  
  constructor(
    public dialogRef: MatDialogRef<ThemeEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      theme: ThemeColor,
      isNew: boolean,
      themeColors: any
    },
    private themeService: ThemeService
  ) {}
  
  ngOnInit(): void {
    // If editing existing theme, load its color
    if (this.data.theme && this.data.themeColors[this.data.theme]) {
      this.customColor = this.data.themeColors[this.data.theme].main;
      
      // Extract theme name from custom theme id if available
      if (this.data.theme.startsWith('custom_')) {
        this.themeName = this.data.theme.split('_')[1];
      }
    }
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
  
  saveTheme() {
    if (this.customColor && this.customColor.startsWith('#')) {
      let resultTheme: ThemeColor;
      
      if (this.data.isNew) {
        // Create new custom theme
        resultTheme = this.themeService.addCustomTheme(
          this.customColor
        );
      } else {
        // Update existing theme
        this.themeService.updateThemeColor(this.data.theme, this.customColor);
        resultTheme = this.data.theme;
      }
      
      // Close dialog and return new theme
      this.dialogRef.close({ theme: resultTheme });
    }
  }
}