import {Injectable} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from "../../components/modal/modal.component";
import {VideoModalComponent} from "../../components/videomodal/videomodal.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalRef?: NgbModalRef;

  constructor(private ngbModal: NgbModal) {
  }

  open(title: string,
       isLoggedIn: boolean,
       modalType: 'confirmBooking' | 'cancelBooking' | 'warningMaxSeats' | 'rateMovie' | undefined): Promise<{
    action: string,
    value?: number
  }> {
    this.modalRef = this.ngbModal.open(ModalComponent, {centered: true});
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.isLoggedIn = isLoggedIn;
    this.modalRef.componentInstance.modalType = modalType;

    return new Promise<{ action: string, value?: number }>((resolve) => {
      this.modalRef?.componentInstance.login.subscribe(() => {
        resolve({action: 'login'});
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.register.subscribe(() => {
        resolve({action: 'register'});
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.confirmBooking.subscribe(() => {
        resolve({action: 'confirmBooking'});
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.cancelEvent.subscribe(() => {
        resolve({action: 'close'});
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.cancelBooking.subscribe(() => {
        resolve({action: 'cancelBooking'});
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.rate.subscribe((currentRating: number) => {
        resolve({action: 'rateMovie', value: currentRating});
        this.modalRef?.close();
      });
    });
  }

  openVideoModal(videoUrl: string) {
    this.modalRef = this.ngbModal.open(VideoModalComponent, {centered: true});
    this.modalRef.componentInstance.videoUrl = videoUrl;
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

}
