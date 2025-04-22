import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeEditorDialogComponent } from './theme-editor-dialog.component';

describe('ThemeEditorDialogComponent', () => {
  let component: ThemeEditorDialogComponent;
  let fixture: ComponentFixture<ThemeEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeEditorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
