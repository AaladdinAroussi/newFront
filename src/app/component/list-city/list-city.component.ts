import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-city',
  templateUrl: './list-city.component.html',
  styleUrls: ['./list-city.component.css']
})
export class ListCityComponent implements OnInit {
  cities: any[] = []; // Array to hold the list of cities
  loading: boolean = true; // Loading state
  hasCities: boolean = false; // Flag to check if there are cities

  constructor(private cityService: CommonService,private serv:SuperAdminService, private router: Router,private authService: AuthService) { }

  ngOnInit(): void {
    this.getAllCities(); // Fetch cities when the component initializes
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
  getAllCities(): void {
    this.cityService.getAllCities().subscribe(
        (response: any) => {
            this.cities = response.cities; // Store the retrieved cities
            this.loading = false; // Set loading to false
            this.hasCities = this.cities.length > 0; // Check if there are any cities
        },
        error => {
            if (error.status === 404) {
                console.warn('No cities found.');
                this.cities = []; // Set cities to an empty array
                this.hasCities = false; // No cities available
            } else {
                console.error('Error fetching cities:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error fetching the cities. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            this.loading = false; // Set loading to false even on error
        }
    );
}
  deleteCity(cityId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteCity(cityId).subscribe(
          response => {
            console.log('City deleted successfully:', response);
            // Remove the deleted city from the local array
            this.cities = this.cities.filter(city => city.id !== cityId);
            Swal.fire('Deleted!', 'Your city has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting city:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the city. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }
}