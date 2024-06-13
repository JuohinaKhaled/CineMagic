import {Injectable} from '@angular/core';
import * as io from "socket.io-client";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor() {
    this.socket = io.connect('http://localhost:4200');
  }

  reserveSeat(seat: any): void {
    this.socket.emit('reserveSeat', {seat});
    console.log('reserveSeat: ', seat);
  }

  releaseSeat(seat: any): void {
    this.socket.emit('releaseSeat', {seat});
    console.log('releaseSeat: ', seat);
  }

  updateSeat(seat: any): void {
    this.socket.emit('updateSeat', {seat});
    console.log('updateSeat: ', seat);
  }

  getSeatReleasedByOtherClient(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('seatReleased', (data: any) => {
        observer.next(data.seat);
      });
    });
  }

  getCurrentClientSeat(): Observable<any[]> {
    return new Observable<any>(observer => {
      this.socket.on('reservedSeats', (reservedSeats: any[]) => {
        const otherClientSeats = reservedSeats.filter((data: any) =>
          data.id === this.socket.id).map((data: any) => data.seat);
        observer.next(otherClientSeats);
      });
    });
  }

  getOtherClientSeat(): Observable<any[]> {
    return new Observable<any>(observer => {
      this.socket.on('reservedSeats', (reservedSeats: any[]) => {
        const otherClientSeats = reservedSeats.filter((data: any) =>
          data.id !== this.socket.id).map((data: any) => data.seat);
        observer.next(otherClientSeats);
      });
    });
  }

  disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('disconnect');
    }
  }
}
