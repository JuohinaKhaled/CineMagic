import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutzerProfilViewComponent } from './nutzer-profil-view.component';

describe('NutzerProfilViewComponent', () => {
  let component: NutzerProfilViewComponent;
  let fixture: ComponentFixture<NutzerProfilViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutzerProfilViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NutzerProfilViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
