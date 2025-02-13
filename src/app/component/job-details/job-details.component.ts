import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  jobOffer: any; // Variable to hold the job offer details
  loading: boolean = true; // Loading state

  constructor(private jobService: CommonService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id'); // Get the job ID from the route parameters
    if (jobId) {
      this.getJobOfferById(+jobId); // Call the method to fetch job offer details
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Job ID not found.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  getJobOfferById(id: number): void {
    this.jobService.getJobOfferById(id).subscribe(
      (response: any) => {
        this.jobOffer = response.jobOffer; // Store the retrieved job offer details
        console.log(" ",this.jobOffer);
        
        this.loading = false; // Set loading to false
      },
      error => {
        console.error('Error fetching job offer details:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error fetching the job offer details. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.loading = false; // Set loading to false even on error
      }
    );
  }
}