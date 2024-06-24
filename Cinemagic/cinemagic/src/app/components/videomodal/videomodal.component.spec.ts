import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoModalComponent } from './videomodal.component';

describe('VideoModalComponent', () => {
  let component: VideoModalComponent;
  let fixture: ComponentFixture<VideoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
