import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBarbersComponent } from './add-barbers.component';

describe('AddBarbersComponent', () => {
  let component: AddBarbersComponent;
  let fixture: ComponentFixture<AddBarbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBarbersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBarbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
