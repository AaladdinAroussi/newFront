import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatService } from 'src/app/services/candidat.service';
import { CommonService } from 'src/app/services/common.service';

export interface Sector {
  id: number;
  name: string;
}

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
  sector: Sector;
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
  userData: any | null = null;
  userRoles: string[] = [];
  isCandidate = false;
  candidateSector: number | null = null; // Change to number | null

  constructor(private commonService: CommonService, private authService: AuthService, private candidatService: CandidatService) { }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    this.isCandidate = this.userRoles.includes('ROLE_CANDIDAT');
    if (this.isCandidate) {
      console.log("Role", this.userRoles);
      console.log("Candidate : ", this.isCandidate);
      
      const userConnect = localStorage.getItem('userconnect'); // Extract userconnect from local storage
      if (userConnect) {
        const userData = JSON.parse(userConnect); // Parse the JSON string
        const candidateId = userData.id; // Extract the candidate ID
        this.getCandidateById(candidateId); // Fetch candidate data if the user is a candidate
      }
    } else {
      console.log("No candidate");
      this.getOffers(); // Load all job offers initially if not a candidate
    }

    this.getAllCategories(); // Load all categories initially
  }

  private getCandidateById(candidateId: number): void {
    this.candidatService.getCandidatById(candidateId).subscribe(
        response => {
            this.userData = response.candidat;
            this.candidateSector = this.userData.sector.id; // Assuming sector is an object with an id
            console.log("Candidate sector", this.candidateSector);
            console.log('Candidate data:', this.userData);

            // Call getOffers after setting the candidate sector
            this.getOffers();
        },
        error => {
            console.error('Error fetching candidate data:', error);
        }
    );
}

  updateSalaryRange() {
    this.getOffers(); // Call getOffers to refresh the job offers based on the selected salary
  }

  getAllCategories(): void {
    this.commonService.getAllCategoryOffers().subscribe(
      (response) => {
        this.categories = response.categoryOffers.map((category: { id: number; name: string }) => ({
          id: category.id,
          name: category.name
        }));
        
        if (this.categories.length > 0) {
          const name = this.categories[0].name;
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
      this.selectedJobType.splice(index, 1); // Remove if already selected
    } else {
      this.selectedJobType.push(jobType); // Add if not selected
    }
    this.getOffers(); // Call getOffers to refresh the job offers based on the selected job types
  }

  onSearch(): void {
    this.getOffers(); // Call getOffers when searching
  }

  getOffers(): void {
    this.listOffers = [];

    this.commonService.filterJobOffers(
        this.searchKeyword.trim(),
        this.selectedJobType,
        this.selectedCategory,
        this.selectedLocation,
        this.selectedExperienceLevels.length > 0 ? Math.max(...this.selectedExperienceLevels) : undefined,
        this.salaryRange
    ).subscribe(
        (data) => {
            this.listOffers = data.jobOffers.filter((offer: JobOffer) => offer.status !== 'PENDING');
            console.log('Filtered job offers:', this.listOffers);

            console.log("Candidate Sector ID:", this.candidateSector);
            this.listOffers.forEach(offer => {
                console.log(`Offer ID: ${offer.id}, Offer Sector ID: ${offer.sector.id}`);
            });

            if (this.isCandidate && this.candidateSector !== null) {
                this.listOffers = this.listOffers.filter(offer => {
                    const matches = offer.sector.id === this.candidateSector;
                    console.log(`Checking offer ID ${offer.id} with sector ID ${offer.sector.id}: ${matches}`);
                    return matches;
                });
            } else {
                console.log("filter of sectors n'est pas traite");
            }
        },
        error => {
            console.error('Error fetching job offers with filters', error);
            this.listOffers = []; // Clear the list on error
        }
    );
}
}