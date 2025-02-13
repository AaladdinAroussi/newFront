import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-sector',
  templateUrl: './add-sector.component.html',
  styleUrls: ['./add-sector.component.css']
})
export class AddSectorComponent implements OnInit {
  form!: FormGroup;
  superadminId: number | null = null;
  categories: any[] = [];


  constructor(private fb: FormBuilder, private router: Router, private serv: CommonService, private sectorService: SuperAdminService,private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categories: [[], Validators.required]
    });
    this.loadSuperAdminId();
    this.loadAllCategories();
  }
  loadAllCategories(): void {
    this.serv.getAllCategoryOffers().subscribe(
      (response) => {
        this.categories = response.categoryOffers; // Stocker les catégories dans la propriété
        console.log('Categories loaded:', this.categories);
      },
      (error) => {
        console.error('Error loading categories:', error);
  
      }
    );
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

  get nameControl() {
    return this.form.get('name');
  }

  get descriptionControl() {
    return this.form.get('description');
  }
  get categoriesControl() {
    return this.form.get('categories');
  }
  onCategoryChange(event: any): void {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedCategoryIds = selectedOptions.map((option: any) => option.value);
    this.form.patchValue({ categories: selectedCategoryIds });
  }
  addSector(): void {
    if (this.form.valid) {
      const sectorData = {
        name: this.form.value.name,
        description: this.form.value.description,
        categoryIds: this.form.value.categories // Ensure this is an array of IDs
      };
  
      console.log('Sector Data:', sectorData); // Log the data to check
  
      if (this.superadminId) {
        this.sectorService.createSector(sectorData, this.superadminId).subscribe(
          response => {
            console.log('Sector added successfully:', response);
            Swal.fire({
              title: 'Success!',
              text: 'Sector added successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/home/superAdmin/sectorList']);
            });
          },
          error => {
            console.error('Error adding sector:', error);
            if (error.status === 409) {
              Swal.fire({
                title: 'Error!',
                text: 'Sector name must be unique. Please choose a different name.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Error adding sector: ' + error.message,
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
      console.log('Form is invalid');
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
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
}