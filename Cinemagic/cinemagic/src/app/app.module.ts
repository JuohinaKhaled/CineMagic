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
import { RoomComponent } from './components/room/room.component';
import { SeatComponent } from './components/seat/seat.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { MovieService } from "./services/movie/movie.service";
import { RoomService } from "./services/room/room.service";
import { MovieDetailsComponent } from './components/movie/movie-details.component';
import { EventComponent } from './event/event.component';
import { EventService } from "./services/event/event.service";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CounterComponent } from './components/counter/counter.component';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { TicketComponent } from './ticket/ticket.component';
import { SocketService } from "./services/socket/socket.service";
import { TicketService } from "./services/ticket/ticket.service";
import {NgOptimizedImage} from "@angular/common";
import { ProfileComponent } from './components/profile/profile.component';

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
    ProfileComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgOptimizedImage,
    ],
  providers: [AuthService, AuthGuard, MovieService, RoomService, EventService, SocketService, TicketService,
    provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
