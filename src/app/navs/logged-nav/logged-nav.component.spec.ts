import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedNavComponent } from './logged-nav.component';

describe('LoggedNavComponent', () => {
  let component: LoggedNavComponent;
  let fixture: ComponentFixture<LoggedNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
