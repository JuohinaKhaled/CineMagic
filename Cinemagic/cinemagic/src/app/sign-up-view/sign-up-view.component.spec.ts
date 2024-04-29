import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpViewComponent } from './sign-up-view.component';

describe('SignInViewComponent', () => {
  let component: SignUpViewComponent;
  let fixture: ComponentFixture<SignUpViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
