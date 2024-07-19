import {Injectable} from '@angular/core';
import * as io from "socket.io-client";
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
import {Seat} from "../../models/seat/seat";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor() {
    this.socket = io.connect('http://localhost:4200');
  }

  reserveSeat(seat: any, eventID: number): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('reserveSeat', {seat, eventID});
      console.log('Socket_Service: reserveSeat: ', seat, eventID);
    } else {
      console.error('Socket_Service: Socket not connected');
    }
  }

  releaseSeat(seat: any, eventID: number, isBooked: boolean): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('releaseSeat', {seat, eventID, isBooked});
      console.log('Socket_Service: releaseSeat: ', seat, eventID, isBooked);
    } else {
      console.error('Socket_Service: Socket not connected');
    }
  }

  updateSeat(seat: any, eventID: number): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('updateSeat', {seat, eventID});
      console.log('Socket_Service: updateSeat: ', seat, eventID);
    } else {
      console.error('Socket_Service: Socket not connected');
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
      catchError(err => {
        console.error('Socket_Service: Error receiving seatReleased:', err);
        return throwError(err);
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
      catchError(err => {
        console.error('Socket_Service: Error receiving counter:', err);
        return throwError(err);
      })
    );
  }

  getCurrentClientSeat(eventID: number): Observable<Seat[]> {
    return new Observable<Seat[]>(observer => {
      this.socket.on('reservedSeats', (reservedSeats: any[]) => {
        const otherClientSeats = reservedSeats.filter((data: any) =>
          data.id === this.socket.id && data.eventID === eventID).map((data: any) => data.seat);
        observer.next(otherClientSeats);
      });
    }).pipe(
      catchError(err => {
        console.error('Socket_Service: Error receiving reservedSeats: ', err);
        return throwError(err);
      })
    );
  }

  getOtherClientSeat(eventID: number): Observable<Seat[]> {
    return new Observable<Seat[]>(observer => {
      this.socket.on('reservedSeats', (reservedSeats: any[]) => {
        const otherClientSeats: Seat[] = reservedSeats.filter((data: any) =>
          data.id !== this.socket.id && data.eventID === eventID).map((data: any) => data.seat);
        observer.next(otherClientSeats);
      });
    }).pipe(
      catchError(err => {
        console.error('Socket_Service: Error receiving reservedSeats:', err);
        return throwError(err);
      })
    );
  }

}
