import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberHistoryComponent } from './barber-history.component';

describe('BarberHistoryComponent', () => {
  let component: BarberHistoryComponent;
  let fixture: ComponentFixture<BarberHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarberHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarberHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
