import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from "../../components/modal/modal.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRef?: NgbModalRef;

  constructor(private ngbModal: NgbModal) { }

  open(title: string, isLoggedIn: boolean, modalType: 'confirmation' | 'information' | 'warning') {
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
      this.modalRef?.componentInstance.booking.subscribe(() => {
        resolve('booking');
        this.modalRef?.close();
      });
      this.modalRef?.componentInstance.cancel.subscribe(() => {
        resolve('close');
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
