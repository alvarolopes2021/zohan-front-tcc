import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberHomeComponent } from './barber-home.component';

describe('BarberHomeComponent', () => {
  let component: BarberHomeComponent;
  let fixture: ComponentFixture<BarberHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarberHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarberHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
