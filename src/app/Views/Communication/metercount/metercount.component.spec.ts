import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetercountComponent } from './metercount.component';

describe('MetercountComponent', () => {
  let component: MetercountComponent;
  let fixture: ComponentFixture<MetercountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetercountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetercountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
