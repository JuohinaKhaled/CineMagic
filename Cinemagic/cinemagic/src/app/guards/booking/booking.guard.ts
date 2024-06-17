import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {BookingService} from "../../services/booking/booking.service";


export const bookingGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const bookingService = inject(BookingService);
  const router = inject(Router);

  const isBookingInProgress = bookingService.isBooking();

  if (!isBookingInProgress) {
    return true;
  } else {
    console.log('Booking_Guard: Booking process not in progress. Redirecting...');
    return router.createUrlTree(['/']);
  }
};
