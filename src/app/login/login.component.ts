import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSnackBarModule,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    AuthLayoutComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private auth:AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.formValidation();
    // If already logged in, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

  }


  public formValidation():void{

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.auth.post('auth/login', this.loginForm.value).then((res: any) => {
        console.log(res);
        if (res .code ==='200' && res.data) {
          localStorage.setItem('token', res.data.accessToken);
          localStorage.setItem('user', JSON.stringify(res.data.user));

          this.authService.authStateChanged.emit(true);
          this.toastr.success('Login successful!', 'Success');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res?.message || 'Login failed', 'Error');
        }

        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
        this.toastr.error('Something went wrong. Please try again.', 'Error');
        console.error('Login error:', error);
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.toastr.warning('Please fix the form errors first.', 'Validation');
    }
  }
  
}