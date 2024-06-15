import {Injectable} from '@angular/core';
import * as io from "socket.io-client";
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor() {
    this.socket = io.connect('http://localhost:4200');
  }

  reserveSeat(seat: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('reserveSeat', {seat});
      console.log('Socket_Service: reserveSeat: ', seat);
    } else {
      console.error('Socket_Service: Socket not connected');
    }
  }

  releaseSeat(seat: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('releaseSeat', {seat});
      console.log('Socket_Service: releaseSeat: ', seat);
    } else {
      console.error('Socket_Service: Socket not connected');
    }
  }

  updateSeat(seat: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('updateSeat', {seat});
      console.log('Socket_Service: updateSeat: ', seat);
    } else {
      console.error('Socket_Service: Socket not connected');
    }
  }

  getSeatReleasedByOtherClient(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('seatReleased', (data: any) => {
        observer.next(data.seat);
      });
    }).pipe(
      catchError(error => {
        console.error('Socket_Service: Error receiving seatReleased:', error);
        return throwError(error);
      })
    );
  }

  getCurrentClientSeat(): Observable<any[]> {
    return new Observable<any>(observer => {
      this.socket.on('reservedSeats', (reservedSeats: any[]) => {
        const otherClientSeats = reservedSeats.filter((data: any) =>
          data.id === this.socket.id).map((data: any) => data.seat);
        observer.next(otherClientSeats);
      });
    }).pipe(
      catchError(error => {
        console.error('Socket_Service: Error receiving reservedSeats:', error);
        return throwError(error);
      })
    );
  }

  getOtherClientSeat(): Observable<any[]> {
    return new Observable<any>(observer => {
      this.socket.on('reservedSeats', (reservedSeats: any[]) => {
        const otherClientSeats = reservedSeats.filter((data: any) =>
          data.id !== this.socket.id).map((data: any) => data.seat);
        observer.next(otherClientSeats);
      });
    }).pipe(
      catchError(error => {
        console.error('Socket_Service: Error receiving reservedSeats:', error);
        return throwError(error);
      })
    );
  }

  disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('disconnect');
    } else {
      console.error('Socket_Service: Socket not connected');
    }
  }
}
