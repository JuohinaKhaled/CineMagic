import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {CounterService} from "../../services/counter/counter.service";
import {SocketService} from "../../services/socket/socket.service";

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() headline: string = '';
  @Input() eventID: number = 0;
  @Output() counterValueChanged = new EventEmitter<number>();
  counterValue: number = 0;
  totalCounterValue: number = 0;
  subscription: Subscription = new Subscription();

  constructor(private counterService: CounterService, private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.subscription = this.counterService.getTotalCounterValue().subscribe(value => {
      this.totalCounterValue = value;
    });
    this.startCounterValue();
  }

  startCounterValue() {
    this.socketService.getCurrentCount(this.headline, this.eventID).subscribe(
      startValue => {
        this.counterValue = startValue;
        this.counterValueChanged.emit(this.counterValue);
      },
      error => {
        console.error("Counter_Component: Error fetching counter:", error);
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
    console.log('DESTROY called', this.subscription);
  }

  ngOnChanges(changes: SimpleChanges): void {

      console.log('ngOnChanges called', changes);

  }
}
