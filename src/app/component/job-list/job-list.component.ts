import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
export interface JobOffer {
  id: number;
  dateCreation: string;
  dateModification: string;
  closingDate: string;
  critere: string;
  description: string;
  experience: number;
  jobType: string;
  salary: number;
  status: string;
  title: string;
  // Add other fields as necessary
}
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  listOffers: JobOffer[] = []; // Use the JobOffer type
  locations: string[] = []; // Add locations array
  categories: any[] = []; // Use the Category type
  keyword: string = '';
  selectedLocation: string = ''; // This will hold the input for city or postcode
  selectedCategory: string = '';
  selectedJobType: string[] = [];
  selectedExperienceLevels: number[] = []; // Array to hold selected experience levels
  selectedDatePosted: string = '';
  selectedExperienceLevel: string = '';
  searchKeyword: string = '';
  salaryRange: number = 0; // Single salary range variable

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getAllCategories(); // Load all categories initially
    this.getOffers(); // Load all job offers initially
  }

  updateSalaryRange() {
    // You can implement any logic here if needed when the salary range changes
    this.getOffers(); // Call getOffers to refresh the job offers based on the selected salary
  }

  getAllCategories(): void {
    this.commonService.getAllCategoryOffers().subscribe(
      (response) => {
        // Assuming response.categoryOffers is an array of category objects
        this.categories = response.categoryOffers.map((category: { id: number; name: string }) => ({
          id: category.id,
          name: category.name
        }));
        
        // Log the first category name
        if (this.categories.length > 0) {
          const name = this.categories[0].name;
          //console.log('Categories loaded:', this.categories); // Log the first category
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.categories = []; // Clear the categories on error
      }
    );
  }
  toggleExperienceLevel(experience: number): void {
    const index = this.selectedExperienceLevels.indexOf(experience);
    if (index > -1) {
        this.selectedExperienceLevels.splice(index, 1); // Remove if already selected
    } else {
        this.selectedExperienceLevels.push(experience); // Add if not selected
    }
    this.getOffers(); // Refresh offers based on selected experience levels
}

  toggleJobType(jobType: string): void {
    const index = this.selectedJobType.indexOf(jobType);
    if (index > -1) {
        // If the job type is already selected, remove it
        this.selectedJobType.splice(index, 1);
    } else {
        // If the job type is not selected, add it
        this.selectedJobType.push(jobType);
    }
    this.getOffers(); // Call getOffers to refresh the job offers based on the selected job types
  }

  onSearch(): void {
    this.getOffers(); // Call getOffers when searching
  }

  getOffers(): void {
    // Start with an empty list of offers
    this.listOffers = [];

    // Call the filterJobOffers method with the selected filters
    this.commonService.filterJobOffers(
        this.searchKeyword.trim(),
        this.selectedJobType,
        this.selectedCategory,
        this.selectedLocation,
        this.selectedExperienceLevels.length > 0 ? Math.max(...this.selectedExperienceLevels) : undefined, // Pass the maximum selected experience level
        this.salaryRange
    ).subscribe(
        (data) => {
            // Filter out job offers with status 'PENDING'
            this.listOffers = data.jobOffers.filter((offer: JobOffer) => offer.status !== 'PENDING');
            console.log('Filtered job offers:', this.listOffers);
        },
        error => {
            console.error('Error fetching job offers with filters', error);
            this.listOffers = []; // Clear the list on error
        }
    );
}
}