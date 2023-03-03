import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingBarberDaytimeComponent } from './assing-barber-daytime.component';

describe('AssingBarberDaytimeComponent', () => {
  let component: AssingBarberDaytimeComponent;
  let fixture: ComponentFixture<AssingBarberDaytimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssingBarberDaytimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssingBarberDaytimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
