import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {RoomComponent} from "./room/room.component";
import {MovieDetailsComponent} from "./movie/movie-details/movie-details.component";
import {EventComponent} from "./event/event.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'room/:eventID/:movieID', component: RoomComponent },
  { path: 'movie-details/:movieID', component: MovieDetailsComponent },
  { path: 'event/', component: EventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
