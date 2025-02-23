import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonAdminService } from 'src/app/services/common-admin.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-super-admin-offers',
  templateUrl: './super-admin-offers.component.html',
  styleUrls: ['./super-admin-offers.component.css']
})
export class SuperAdminOffersComponent implements OnInit {
  pendingJobOffers: any[] = []; // Array to hold the pending job offers
  loading: boolean = true; // Loading state

  constructor(
    private jobService: SuperAdminService,
    private serv: CommonAdminService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getPendingJobOffers(); // Fetch pending job offers when the component initializes
  }

  approveOffer(id: number): void {
    this.jobService.markJobAsOpen(id).subscribe(
      response => {
        console.log('Job marked as open successfully:', response);
        // Refresh the list of job offers
        this.getPendingJobOffers();
        Swal.fire('Approved!', 'The job has been marked as open.', 'success');
      },
      error => {
        console.error('Error marking job as open:', error);
        // Log the error response for debugging
        const errorMessage = error.error?.message || 'There was an error marking the job as open. Please try again later.';
        Swal.fire('Error!', errorMessage, 'error');
      }
    );
  }

  rejectOffer(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteJobOffer(id).subscribe(
          response => {
            console.log('Job offer rejected successfully:', response);
            // Refresh the list of job offers
            this.getPendingJobOffers();
            Swal.fire('Rejected!', 'The job offer has been rejected.', 'success');
          },
          error => {
            console.error('Error rejecting job offer:', error);
            Swal.fire('Error!', 'There was an error rejecting the job offer. Please try again later.', 'error');
          }
        );
      }
    });
  }

  getPendingJobOffers(): void {
    this.loading = true; // Set loading to true while fetching
    this.jobService.getActiveJobOffers().subscribe(
        (response: any) => {
            if (response && Array.isArray(response.jobOffers)) {
                this.pendingJobOffers = response.jobOffers; // Store the retrieved job offers
                console.log("Pending job offers", this.pendingJobOffers);
            } else {
                this.pendingJobOffers = []; // Fallback to an empty array
            }
            this.loading = false; // Set loading to false
        },
        error => {
            console.error('Error fetching pending job offers:', error);
            this.pendingJobOffers = []; // Clear the list of offers in case of an error
            this.loading = false; // Set loading to false even on error
        }
    );
}

onNotify(jobOfferId: number) {
  Swal.showLoading();
  
  this.jobService.notifyCandidates(jobOfferId).subscribe({
    next: (response) => {
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Notifications envoyées !',
        html: `
          <div class="text-start">
            <p>${response.recipientsCount} candidats ont été notifiés avec succès</p>
            <small class="text-muted">Référence offre: #${jobOfferId}</small>
          </div>
        `,
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#28a745',
        timer: 5000
      });
    },
    error: (err) => {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Échec de l\'envoi',
        html: `
          <div class="text-start">
            <p>Erreur lors de la notification des candidats :</p>
            <p class="text-danger">${err.error?.message || 'Erreur serveur'}</p>
            <small class="text-muted">Code erreur: ${err.status}</small>
          </div>
        `,
        confirmButtonText: 'Compris',
        confirmButtonColor: '#dc3545',
        footer: '<a href="/contact">Besoin d\'aide ? Contactez le support</a>'
      });
    }
  });
}


}