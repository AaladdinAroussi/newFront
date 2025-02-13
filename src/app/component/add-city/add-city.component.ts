import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {
  form!: FormGroup;
  superadminId: number | null = null;
  

  
  constructor(private fb: FormBuilder, private router: Router, private cityService: SuperAdminService,private authService: AuthService) { }
  get nameControl() {
    return this.form.get('name');
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
    this.loadSuperAdminId();
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





  addCity(): void {
    if (this.form.valid) {
      const cityData = {
        name: this.form.value.name,
      };

      if (this.superadminId) {
        this.cityService.createCity(cityData, this.superadminId).subscribe(
          response => {
            console.log('City added successfully:', response);
            Swal.fire({
              title: 'Success!',
              text: 'City added successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/home/superAdmin/cityList']); // Replace with the appropriate redirect path
            });
          },
          error => {
            console.error('Error adding city:', error);
            if (error.status === 409) {
              Swal.fire({
                title: 'Error!',
                text: 'City name must be unique. Please choose a different name.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Error adding city: ' + error.message,
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
          confirmButtonText : 'OK'
        });
      }
    } else {
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