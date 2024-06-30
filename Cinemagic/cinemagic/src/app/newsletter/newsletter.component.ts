import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {
  newsletterForm: FormGroup;
  locations: string[] = [
    'Cinemagic New York',
    'Cinemagic Los Angeles',
    'Cinemagic Chicago',
    'Cinemagic Houston',
    'Cinemagic Phoenix',
    'Cinemagic Philadelphia',
    'Cinemagic San Antonio',
    'Cinemagic San Diego',
    'Cinemagic Dallas',
    'Cinemagic San Jose',
  ];

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cinema: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.newsletterForm.valid) {
      const formData = this.newsletterForm.value;
      console.log('Newsletter Registration:', formData);
    }
  }
}
