import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  listOffers: any[] = [];
  locations: string[] = []; // Add locations array
  categories: any[] = []; // Use the Category type
  keyword: string = '';
  selectedLocation: string = ''; // This will hold the input for city or postcode
  selectedCategory: string = '';
  selectedJobType: string[] = [];
  selectedDatePosted: string = '';
  selectedExperienceLevel: string = '';
  searchKeyword: string = '';

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getAllCategories(); // Load all categories initially
    this.getOffers(); // Load all job offers initially
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
        this.selectedExperienceLevel ? parseInt(this.selectedExperienceLevel) : undefined,
        // this.selectedSalary ? parseFloat(this.selectedSalary) : undefined
    ).subscribe(
        (data) => {
            this.listOffers = data.jobOffers; // Assuming the response contains jobOffers
            console.log('Filtered job offers:', this.listOffers);
        },
        error => {
            console.error('Error fetching job offers with filters', error);
            this.listOffers = []; // Clear the list on error
        }
    );
}
}