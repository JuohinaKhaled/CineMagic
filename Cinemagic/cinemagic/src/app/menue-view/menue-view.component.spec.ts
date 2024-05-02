import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenueViewComponent } from './menue-view.component';

describe('MenueViewComponent', () => {
  let component: MenueViewComponent;
  let fixture: ComponentFixture<MenueViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenueViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
