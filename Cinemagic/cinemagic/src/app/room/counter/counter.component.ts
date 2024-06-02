import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent {
  @Input() headline: string = '';

  counterValue : number = 0;

  increment() {
    this.counterValue++;
  }

  decrement() {
    this.counterValue--;
  }

  disableDecrement() {
    return this.counterValue === 0;
  }
}
