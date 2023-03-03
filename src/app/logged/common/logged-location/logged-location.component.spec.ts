import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedLocationComponent } from './logged-location.component';

describe('LoggedLocationComponent', () => {
  let component: LoggedLocationComponent;
  let fixture: ComponentFixture<LoggedLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
