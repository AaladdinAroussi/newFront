import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-jobs',
  templateUrl: './admin-jobs.component.html',
  styleUrls: ['./admin-jobs.component.css']
})
export class AdminJobsComponent implements OnInit {
  activeJobOffers: any[] = []; // Array to hold active job offers
  adminId: number | null = null; // Admin ID
  noJobOffers: boolean = false; // Flag to indicate no job offers

  constructor(private jobService: AdminService) { }

  ngOnInit(): void {
    this.adminId = this.getUserIdFromLocalStorage(); // Get admin ID from local storage
    if (this.adminId) {
      this.getActiveJobOffers(); // Fetch job offers only if admin ID is available
    } else {
      console.error('Admin ID not found in local storage');
    }
  }

  getUserIdFromLocalStorage(): number | null {
    const userConnect = localStorage.getItem('userconnect');
    if (userConnect) {
      const user = JSON.parse(userConnect);
      return user?.id || null;
    }
    return null;
  }

  getActiveJobOffers(): void {
    if (this.adminId) {
      this.jobService.getActiveJobOffersByAdmin(this.adminId).subscribe(
        (data) => {
          this.activeJobOffers = data.jobOffers; // Extract the jobOffers array from the response
          this.noJobOffers = this.activeJobOffers.length === 0; // Check if there are no job offers
          console.log("Active job offers", this.activeJobOffers);
        },
        (error) => {
          console.error('Error fetching active job offers', error);
          this.noJobOffers = true; // Set flag to true if there's an error
        }
      );
    }
  }
}