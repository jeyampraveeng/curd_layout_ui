import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextListComponent } from './text-list.component';

describe('TextListComponent', () => {
  let component: TextListComponent;
  let fixture: ComponentFixture<TextListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
