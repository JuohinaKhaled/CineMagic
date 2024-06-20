import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {RoomComponent} from "./components/room/room.component";
import {MovieDetailsComponent} from "./components/movie/movie-details.component";
import {EventComponent} from "./components/event/event.component";
import {AuthGuard} from "./guards/auth/auth.guard";
import {ProfileComponent} from "./components/profile/profile.component";
import {BookingComponent} from "./components/booking/booking.component";


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'room/:eventID/:movieID', component: RoomComponent},
  {path: 'movie-details/:movieID', component: MovieDetailsComponent},
  {path: 'event/', component: EventComponent},
  {path: 'booking/:bookingID', component: BookingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
