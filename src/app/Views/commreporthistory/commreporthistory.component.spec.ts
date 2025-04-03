import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommreporthistoryComponent } from './commreporthistory.component';

describe('CommreporthistoryComponent', () => {
  let component: CommreporthistoryComponent;
  let fixture: ComponentFixture<CommreporthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommreporthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommreporthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
