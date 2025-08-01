import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

//enableProdMode(); // Enable production mode for performance optimization

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
