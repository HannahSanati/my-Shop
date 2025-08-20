import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';



// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(),
//     provideRouter(routes),
//     provideAnimations(),
    
//   ]
// }).catch(err => console.error(err));



bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));