import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private redirectUrl: string | null = null;
  tryBooking = false;
  constructor() { }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  clearRedirectUrl() {
    this.redirectUrl = null;
  }
  isBooking(){
    return this.tryBooking;
  }

  cancelBooking(){
    this.tryBooking = false;
  }

  startBooking() {
    this.tryBooking = true;
  }

}
