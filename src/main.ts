import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { ThemeService } from './app/services/theme.service';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { CustomToastComponent } from './app/custom-toast/custom-toast.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    ThemeService,
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      toastComponent: CustomToastComponent,
      maxOpened: 3,  // Reduced from 5
      autoDismiss: true,
      toastClass: 'custom-tailwind-toast', // Custom class name
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      // Add this to override default container styles
      newestOnTop: true,
      tapToDismiss: true
    })
  ]
})