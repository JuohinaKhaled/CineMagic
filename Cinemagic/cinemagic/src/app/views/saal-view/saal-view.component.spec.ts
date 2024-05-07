import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaalViewComponent } from './saal-view.component';

describe('SaalViewComponent', () => {
  let component: SaalViewComponent;
  let fixture: ComponentFixture<SaalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaalViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
