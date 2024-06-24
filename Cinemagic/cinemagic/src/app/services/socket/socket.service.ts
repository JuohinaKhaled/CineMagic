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

  reserveSeat(seat: any, eventID: number): void {
    console.log('SOCKETEVENTID', eventID);
    if (this.socket && this.socket.connected) {
      this.socket.emit('reserveSeat', {seat, eventID});
      console.log('reserveSeat: ', seat, eventID);
    } else {
      console.error('Socket not connected');
    }
  }

  releaseSeat(seat: any, eventID: number): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('releaseSeat', {seat, eventID});
      console.log('releaseSeat: ', seat, eventID);
    } else {
      console.error('Socket not connected');
    }
  }

  updateSeat(seat: any, eventID: number): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('updateSeat', {seat, eventID});
      console.log('updateSeat: ', seat, eventID);
    } else {
      console.error('Socket not connected');
    }
  }

  getSeatReleasedByOtherClient(eventID: number): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('seatReleased', (data: any) => {
        if (data.eventID === eventID) {
          observer.next(data.seat);
        }
      });
    }).pipe(
      catchError(error => {
        console.error('Error receiving seatReleased:', error);
        return throwError(error);
      })
    );
  }

  getCurrentCount(personType: string, eventID: number): Observable<number> {
    return new Observable<number>(observer => {
      this.socket.emit('counterValue', {personType, eventID});
      this.socket.on(personType + 'Counter', (count: number) => {
        observer.next(count);
      });
    }).pipe(
      catchError(error => {
        console.error('Error receiving counter:', error);
        return throwError(error);
      })
    );
  }

  getCurrentClientSeat(eventID: number): Observable<any[]> {
    return new Observable<any>(observer => {
      this.socket.on('reservedSeats', (reservedSeats: any[]) => {
        const otherClientSeats = reservedSeats.filter((data: any) =>
          data.id === this.socket.id && data.eventID === eventID).map((data: any) => data.seat);
        observer.next(otherClientSeats);
      });
    }).pipe(
      catchError(error => {
        console.error('Error receiving reservedSeats:', error);
        return throwError(error);
      })
    );
  }

  getOtherClientSeat(eventID: number): Observable<any[]> {
    return new Observable<any>(observer => {
      this.socket.on('reservedSeats', (reservedSeats: any[]) => {
        const otherClientSeats = reservedSeats.filter((data: any) =>
          data.id !== this.socket.id && data.eventID === eventID).map((data: any) => data.seat);
        observer.next(otherClientSeats);
      });
    }).pipe(
      catchError(error => {
        console.error('Error receiving reservedSeats:', error);
        return throwError(error);
      })
    );
  }

  disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('clientDisconnect');
    } else {
      console.error('Socket not connected');
    }
  }
}
