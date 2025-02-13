import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonAdminService } from 'src/app/services/common-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {
  form!: FormGroup;
  userId: number | null = null; // Variable to hold the user ID

  userRoles: string[] = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private companyService: CommonAdminService,private authService: AuthService) { }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    // Vérifiez si l'utilisateur a les rôles d'admin ou de super admin
    this.isAdmin = this.userRoles.includes('ROLE_ADMIN');
    this.isSuperAdmin = this.userRoles.includes('ROLE_SUPERADMIN');



    this.form = this.fb.group({
      name: ['', Validators.required],
      website: ['', Validators.required], // Optional
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Numeric validation
      postcode: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Numeric validation
    });

    this.loadUserId(); // Load the user ID when the component initializes
  }

  loadUserId(): void {
    const userConnect = localStorage.getItem('userconnect');
    if (userConnect) {
      const user = JSON.parse(userConnect);
      this.userId = user.id; // Extract user ID
      console.log('User  ID:', this.userId);
    } else {
      console.error('User  not found in local storage');
    }
  }
  
  get websiteControl() {
    return this.form.get('website');
  }
  get nameControl() {
    return this.form.get('name');
  }

  get addressControl() {
    return this.form.get('address');
  }

  get emailControl() {
    return this.form.get('email');
  }

  get phoneControl() {
    return this.form.get('phone');
  }
  get postCodeControl() {
    return this.form.get('postcode');
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
  addCompany(): void {
    if (this.form.valid) {
      const companyData = {
        name: this.form.value.name,
        website: this.form.value.website,
        address: this.form.value.address,
        email: this.form.value.email,
        phone: this.form.value.phone,
        postCode: this.form.value.postcode,
      };
  
      // Include user ID in the company data
      if (this.userId) {
        this.companyService.createCompany(this.userId, companyData).subscribe( // Pass userId first
          response => {
            console.log('Company added successfully:', response);
            Swal.fire({
              title: 'Success!',
              text: 'Company added successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/home/postjob']);
            });
          },
          error => {
            console.error('Error adding company:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error adding the company. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'User  ID not found. Please log in again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please fill in all required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  
}