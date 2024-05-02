import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketkaufDetailViewComponent } from './ticketkauf-detail-view.component';

describe('TicketkaufDetailViewComponent', () => {
  let component: TicketkaufDetailViewComponent;
  let fixture: ComponentFixture<TicketkaufDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketkaufDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketkaufDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
