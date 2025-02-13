import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  categories: any[] = []; // Array to hold the list of categories
  loading: boolean = true; // Loading state
  hascategories: boolean = false; // Flag to check if there are categories

  constructor(private categoryService: CommonService, private serv: SuperAdminService,private router: Router,private authService: AuthService) { }

  ngOnInit(): void {
    this.getAllcategories(); // Fetch categories when the component initializes
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
  getAllcategories(): void {
    this.categoryService.getAllCategoryOffers().subscribe(
      (response: any) => {
        // Log the response to check its structure
        console.log('API Response:', response);

        // Check if response and response.categoryOffers are defined
        if (response && Array.isArray(response.categoryOffers)) {
          this.categories = response.categoryOffers; // Store the retrieved categories
        } else {
          console.warn('No categories found in response.');
          this.categories = []; // Set categories to an empty array
        }

        this.loading = false; // Set loading to false
        this.hascategories = this.categories.length > 0; // Check if there are any categories
      },
      error => {
        if (error.status === 404) {
          console.warn('No categories found.');
          this.categories = []; // Set categories to an empty array
          this.hascategories = false; // No categories available
        } else {
          console.error('Error fetching categories:', error);
          Swal.fire({
            title: 'Error!',
            text: 'There was an error fetching the categories. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
        this.loading = false; // Set loading to false even on error
      }
    );
  }

  deletecategory(categoryId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteCategoryOffer(categoryId).subscribe(
          response => {
            console.log('Category deleted successfully:', response);
            // Remove the deleted category from the local array
            this.categories = this.categories.filter(category => category.id !== categoryId);
            Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting category:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the category. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }
}