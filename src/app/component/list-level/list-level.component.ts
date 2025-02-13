import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-level',
  templateUrl: './list-level.component.html',
  styleUrls: ['./list-level.component.css']
})
export class ListLevelComponent implements OnInit {

  levels: any[] = []; // Array to hold the list of levels
  superadminId=1; // Variable to hold superadminId
  loading: boolean = true; // Loading state

  constructor(private levelService: CommonService, private serv: SuperAdminService,private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.loadSuperAdminId();
    this.getAllLevels(); // Fetch levels when the component initializes
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
      console.error('User not found in local storage');
    }
  }

  getAllLevels(): void {
    this.levelService.getAllLevels().subscribe(
      (response: any) => {
        this.levels = response; // Store the retrieved levels
        this.loading = false; // Set loading to false
      },
      error => {
        console.error('Error fetching levels:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error fetching the levels. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.loading = false; // Set loading to false even on error
      }
    );
  }

  deleteLevel(levelId: number): void {
    if (this.superadminId !== null) { // Check if superadminId is not null
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.serv.deleteLevel(levelId, this.superadminId).subscribe(
            response => {
              console.log('Level deleted successfully:', response);
              // Refresh the list of levels
              this.getAllLevels();
              Swal.fire('Deleted!', 'Your level has been deleted.', 'success');
            },
            error => {
              console.error('Error deleting level:', error);
              Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the level. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          );
        }
      });
    } else {
      console.error('Super Admin ID not found in local storage');
      Swal.fire({
        title: 'Error!',
        text: 'Super Admin ID not found in local storage.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
