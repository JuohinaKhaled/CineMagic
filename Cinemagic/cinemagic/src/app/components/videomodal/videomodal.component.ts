import {Component, Input} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-videomodal',
  templateUrl: './videomodal.component.html',
  styleUrl: './videomodal.component.css'
})
export class VideoModalComponent {
  @Input() videoUrl: string = '';

  constructor(private modalService: NgbModal) {}

  close() {
    this.modalService.dismissAll();
  }
}
