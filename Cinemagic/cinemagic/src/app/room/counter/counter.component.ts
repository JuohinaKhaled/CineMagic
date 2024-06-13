import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {CounterService} from "./service/counter.service";

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent implements OnInit, OnDestroy {
  @Input() headline: string = '';
  @Output() counterValueChanged = new EventEmitter<number>();
  counterValue: number = 0;
  totalCounterValue: number = 0;
  subscription: Subscription = new Subscription();

  constructor(private counterService: CounterService) {
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

  ngOnInit(): void {
    this.subscription = this.counterService.getTotalCounterValue().subscribe(value => {
      this.totalCounterValue = value;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
