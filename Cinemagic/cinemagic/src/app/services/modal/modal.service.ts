import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from "../../components/modal/modal.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalRef?: NgbModalRef;

  constructor(private ngbModal: NgbModal) { }

  open(title: string, isLoggedIn: boolean, modalType: 'confirmBooking' | 'cancelBooking' | 'warningMaxSeats' | 'rateMovie' | undefined) {
    this.modalRef = this.ngbModal.open(ModalComponent, { centered: true });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.isLoggedIn = isLoggedIn;
    this.modalRef.componentInstance.modalType = modalType;

    return new Promise<string>((resolve, reject) => {
      this.modalRef?.componentInstance.login.subscribe(() => {
        resolve('login');
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.register.subscribe(() => {
        resolve('register');
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.confirmBooking.subscribe(() => {
        resolve('confirmBooking');
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.cancelEvent.subscribe(() => {
        resolve('close');
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.cancelBooking.subscribe(() => {
        resolve('cancelBooking');
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.rate.subscribe(() => {
        resolve('rateMovie');
        this.modalRef?.close();
      });
    });
  }


  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
