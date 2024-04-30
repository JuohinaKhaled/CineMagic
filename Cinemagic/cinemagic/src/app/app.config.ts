// main.ts oder eine ähnliche Startdatei
import {enableProdMode, importProvidersFrom} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
});

export const appConfig = {
  // Ihre Konfigurationseinstellungen
};

