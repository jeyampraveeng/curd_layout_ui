import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
  selector: 'app-custom-toast',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './custom-toast.component.html',
  styleUrl: './custom-toast.component.scss'
})
export class CustomToastComponent extends Toast implements OnInit {
  // Make sure toastType is properly initialized
  toastType: string = 'info';
  
  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage);
  }
  
  ngOnInit() {
    // Explicitly set toastType based on the toastPackage
    this.toastType = this.toastPackage.toastType;
    console.log('Toast type:', this.toastType); // For debugging
  }
}