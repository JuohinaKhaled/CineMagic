import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {RoomComponent} from './components/room/room.component';
import {SeatComponent} from './components/seat/seat.component';
import {AuthService} from './services/auth/auth.service';
import {AuthGuard} from './guards/auth/auth.guard';
import {MovieService} from "./services/movie/movie.service";
import {RoomService} from "./services/room/room.service";
import {MovieDetailsComponent} from './components/movie/movie-details.component';
import {EventComponent} from './components/event/event.component';
import {EventService} from "./services/event/event.service";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {CounterComponent} from './components/counter/counter.component';
import {CustomSnackbarComponent} from './components/custom-snackbar/custom-snackbar.component';
import {TicketComponent} from './components/ticket/ticket.component';
import {SocketService} from "./services/socket/socket.service";
import {TicketService} from "./services/ticket/ticket.service";
import {NgOptimizedImage} from "@angular/common";
import {ProfileComponent} from './components/profile/profile.component';
import {ModalComponent} from './components/modal/modal.component';
import {ModalService} from "./services/modal/modal.service";
import {BookingComponent} from './components/booking/booking.component';
import {BookingService} from "./services/booking/booking.service";
import {VideoModalComponent} from './components/videomodal/videomodal.component';
import {SafePipe} from './components/videomodal/safe.pipe';
import { AllBookingsComponent } from './components/booking/all-bookings.component';
import { MyDataComponent } from './components/my-data/my-data.component';
import { RatingComponent } from './components/rating/rating.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    RoomComponent,
    SeatComponent,
    MovieDetailsComponent,
    EventComponent,
    CounterComponent,
    CustomSnackbarComponent,
    TicketComponent,
    ProfileComponent,
    ModalComponent,
    BookingComponent,
    VideoModalComponent,
    SafePipe,
    AllBookingsComponent,
    MyDataComponent,
    RatingComponent,
    NewsletterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgOptimizedImage,
  ],
  providers: [
    AuthService,
    AuthGuard,
    MovieService,
    RoomService,
    EventService,
    SocketService,
    TicketService,
    ModalService,
    BookingService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
