import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { SeatComponent } from './room/seat/seat.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { MovieService } from "./movie/movie.service";
import {RoomService} from "./room/service/room.service";
import { MovieDetailsComponent } from './movie/movie-details/movie-details.component';
import { EventComponent } from './event/event.component';
import {EventService} from "./event/service/event.service";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CounterComponent } from './room/counter/counter.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { TicketComponent } from './ticket/ticket.component';

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
    TicketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, AuthGuard, MovieService, RoomService, EventService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
