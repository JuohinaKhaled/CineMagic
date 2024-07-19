import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-videomodal',
  templateUrl: './videomodal.component.html',
  styleUrl: './videomodal.component.css'
})
export class VideoModalComponent {
  @Input() videoUrl: string = '';

}
