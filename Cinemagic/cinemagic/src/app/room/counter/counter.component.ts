import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {CounterService} from "../../services/counter.service";
import {SocketService} from "../../services/socket.service";
import {catchError, tap} from "rxjs/operators";

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent implements OnInit, OnDestroy {
  @Input() headline: string = '';
  @Input() eventID: number = 0;
  @Output() counterValueChanged = new EventEmitter<number>();
  counterValue: number = 0;
  totalCounterValue: number = 0;
  subscription: Subscription = new Subscription();

  constructor(private counterService: CounterService, private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.startValue();
    this.subscription = this.counterService.getTotalCounterValue().subscribe(value => {
      this.totalCounterValue = value;
    });
  }

  startValue() {

    this.socketService.getCurrentCount(this.headline, this.eventID).subscribe(
      startValue => {
        this.counterValue = startValue;
        for (let i = 0; i < startValue; i++) {
          this.increment();
        }
      },
      error => {
        console.error("Error loading counter:", error);
      });
  }

  increment() {
    if (this.totalCounterValue < 6) {
      this.counterValue++;
      this.counterValueChanged.emit(this.counterValue);
      this.counterService.incrementTotal();
    }
  }

  decrement() {
    if (this.counterValue > 0) {
      this.counterValue--;
      this.counterValueChanged.emit(this.counterValue);
      this.counterService.decrementTotal();
    }
  }

  disableDecrement() {
    return this.counterValue === 0;
  }

  disableIncrement() {
    return this.totalCounterValue >= 6;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
