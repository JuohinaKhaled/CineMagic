import {Component, OnInit} from '@angular/core';
import {RoomService} from "./room.service";
import {ActivatedRoute} from "@angular/router";
import {forkJoin, switchMap} from "rxjs";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit{
  seats!: any[];
  capacity!: number;
  eventID!: number;
  /*seats: any[] = [];
  eventID: bigint = BigInt(0);*/

  constructor(private roomService : RoomService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    /*this.route.params.subscribe(params => {
      this.eventID = BigInt(params['eventID']);
      this.getRoomData();
    });*/

    this.route.params.pipe(
      switchMap(params => {
        this.eventID = params['eventID'];
        return forkJoin([
          this.roomService.getSaal(this.eventID),
          this.roomService.getRoomCapacity(this.eventID)
        ]);
      })
    ).subscribe(([seats, capacity]) => {
      this.seats = seats;
      this.capacity = capacity;
    });
  }

  /*getRoomData(){
    this.roomService.getSaal(this.eventID).subscribe(
      (data: any[]) => {
        this.seats = data;
        console.log("Seats loaded:", this.seats);
      },
      (error) => {
        console.error("Error loading seats:", error);
      }
    );
  }*/
  getSeatClasses(seat: any) {
    return {
      ['g-col-' + seat.Reihennummer]: true,
      ['g-col-md-' + seat.Sitznummer]: true
    };
  }
}
