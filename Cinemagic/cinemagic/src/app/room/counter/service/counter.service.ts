import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private totalCounterValue = new BehaviorSubject<number>(0);

  getTotalCounterValue() {
    return this.totalCounterValue.asObservable();
  }

  incrementTotal() {
    if (this.totalCounterValue.value < 6) {
      this.totalCounterValue.next(this.totalCounterValue.value + 1);
    }
  }

  decrementTotal() {
    if (this.totalCounterValue.value > 0) {
      this.totalCounterValue.next(this.totalCounterValue.value - 1);
    }
  }
}
