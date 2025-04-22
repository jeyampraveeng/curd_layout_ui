import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurdLayoutComponent } from './curd-layout.component';

describe('CurdLayoutComponent', () => {
  let component: CurdLayoutComponent;
  let fixture: ComponentFixture<CurdLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurdLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurdLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
