import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  @Input() maxStars: number = 5;
  @Input() currentRate: number = 0; // Für den ersten Anwendungsfall
  @Input() averageRating: number = 0; // Für den zweiten Anwendungsfall
  @Input() readOnly: boolean = false; // Nur für den zweiten Anwendungsfall

  @Output() ratingUpdated = new EventEmitter<number>(); // Nur für den ersten Anwendungsfall

  hoveredStar: number = 0;
  stars: number[] = [];

  ngOnInit() {
    this.stars = Array(this.maxStars).fill(0).map((_, index) => index + 1);
  }

  onStarHover(index: number) {
    if (!this.readOnly) {
      this.hoveredStar = index + 1;
    }
  }

  onMouseLeave() {
    if (!this.readOnly) {
      this.hoveredStar = 0;
    }
  }

  rate(index: number) {
    if (!this.readOnly) {
      if (index === this.currentRate - 1) {
        this.currentRate = 0;
      } else {
        this.currentRate = index + 1;
      }
      console.log("RATE", this.currentRate);
      this.ratingUpdated.emit(this.currentRate);
    }
  }

  getStarClass(index: number): string {
    if (!this.readOnly) {
      if (this.currentRate >= index + 1) {
        return 'filled';
      } else if (this.hoveredStar >= index + 1) {
        return 'filled';
      } else {
        return 'empty';
      }
    } else {
      const flooredRating = Math.floor(this.averageRating);
      if (index < flooredRating) {
        return 'filled';
      } else if (index === flooredRating && this.averageRating % 1 !== 0) {
        return 'partial';
      } else {
        return 'empty';
      }
    }
  }
}
