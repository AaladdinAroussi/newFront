import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-level',
  templateUrl: './add-level.component.html',
  styleUrls: ['./add-level.component.css']
})
export class AddLevelComponent implements OnInit {
  form!: FormGroup;
  superadminId: number | null = null;
    constructor(private router: Router, private fb: FormBuilder, private service: SuperAdminService,private authService: AuthService) { }
    get levelControl() {
      return this.form.get('level');
    }
  ngOnInit(): void {
    this.form = this.fb.group({
      level: ['', Validators.required],
        });
        this.loadSuperAdminId();
  }
  loadSuperAdminId(): void {
    const userConnect = localStorage.getItem('userconnect');
    if (userConnect) {
      const user = JSON.parse(userConnect);
      this.superadminId = user.id; // Extract superadminId
      console.log('Super Admin ID:', this.superadminId);
    } else {
      console.error('User  not found in local storage');
    }
  }
  signOut(): void {
    const refreshToken = localStorage.getItem('refreshtoken'); // Get refresh token from local storage
  
    if (refreshToken) {
      this.authService.signout(refreshToken).subscribe(
        (response) => {
          console.log('Sign out successful:', response);
  
          // Remove all relevant items from local storage
          localStorage.removeItem('userconnect'); // Remove user data
          localStorage.removeItem('token'); // Remove access token
          localStorage.removeItem('refreshtoken'); // Remove refresh token
          localStorage.removeItem('state'); // Remove any other state if necessary
  
          this.router.navigate(['/login']); // Redirect to login page
        },
        (error) => {
          console.error('Error during sign out:', error);
        }
      );
    } else {
      console.log('No refresh token found');
      // Optionally, you can still clear local storage and redirect
      localStorage.removeItem('userconnect');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshtoken');
      localStorage.removeItem('state');
      this.router.navigate(['/login']);
    }
  }
  saveLevel(): void {
    if (this.form.valid) {
        const levelData = {
            name: this.form.value.level // Map the form field to the expected backend field
        };

        if (this.superadminId) {
            this.service.createLevel(levelData, this.superadminId).subscribe(
                response => {
                    // Handle success response
                    console.log('Level added successfully:', response);
                    
                    // Show success alert
                    Swal.fire({
                        title: 'Success!',
                        text: 'Level added successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Redirect or show success message
                        this.router.navigate(['/home/superAdmin/levelList']); // Replace with the appropriate redirect path
                    });
                },
                error => {
                    // Handle error
                    console.error('Error adding level:', error);
                    
                    // Check if the error status is 409 Conflict
                    if (error.status === 409) {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Level name must be unique. Please choose a different name.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        // Show generic error alert for other errors
                        Swal.fire({
                            title: 'Error!',
                            text: 'Error adding level: ' + error.message,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            );
        } else {
            console.error('Super Admin ID not found in local storage');
            Swal.fire({
                title: 'Error!',
                text: 'Super Admin ID not found in local storage.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } else {
        // If the form is invalid, show a SweetAlert warning
        console.log('Form is invalid');
        Swal.fire({
            title: 'Warning!',
            text: 'Please fill in all required fields.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }
}
}
