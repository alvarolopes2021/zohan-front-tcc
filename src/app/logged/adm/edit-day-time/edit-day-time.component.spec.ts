import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDayTimeComponent } from './edit-day-time.component';

describe('EditDayTimeComponent', () => {
  let component: EditDayTimeComponent;
  let fixture: ComponentFixture<EditDayTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDayTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDayTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
