import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  @Input() event: any;

  constructor(private router : Router) {}

  routeRoom(VorfuehrungsID: any, FilmID: any) {
    console.log('Navigating to room with event: ' + VorfuehrungsID + 'and film:' + FilmID );
    this.router.navigate(['/room', VorfuehrungsID, FilmID]);
  }
}
