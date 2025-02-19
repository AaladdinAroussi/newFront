import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonAdminService } from 'src/app/services/common-admin.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent implements OnInit {
  cities: any[] = [];
  jobTypes: any[] = [];
  companies: any[] = [];
  categoryOffers: any[] = [];
  sectors: any[] = [];
  jobForm: FormGroup;
  adminId: number | null = null;
  userRoles: string[] = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private commonAdminService: CommonAdminService,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form group
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      jobDescription: ['', Validators.required],
      jobType: ['', Validators.required],
      offeredSalary: ['', Validators.required],
      experience: ['', Validators.required],
      city: ['', Validators.required],
      company: ['', Validators.required],
      category: ['', Validators.required],
      sector: [''] 
    });
  }

  get jobTitleControl() {
    return this.jobForm.get('jobTitle');
  }

  get jobDescriptionControl() {
    return this.jobForm.get('jobDescription');
  }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    this.isAdmin = this.userRoles.includes('ROLE_ADMIN');
    this.isSuperAdmin = this.userRoles.includes('ROLE_SUPERADMIN');

    this.loadCities();
    this.loadCategoryOffers();
    this.loadAdminId(); // Load adminId from localstorage

    if (this.adminId) {
      this.loadCompanies(this.adminId);
    }
  }

  loadAdminId(): void {
    const userConnect = localStorage.getItem('userconnect');
    if (userConnect) {
      const user = JSON.parse(userConnect);
      this.adminId = user.id; // Extract adminId
      console.log('Admin ID:', this.adminId);
    } else {
      console.error('User not found in local storage');
    }
  }

  loadCategoryOffers(): void {
    this.commonService.getAllCategoryOffers().subscribe(
      response => {
        this.categoryOffers = response.categoryOffers;
        console.log('Category Offers:', this.categoryOffers);
      },
      error => {
        console.error('Error fetching category offers:', error);
      }
    );
  }

  onCategoryChange(event: Event): void {
    const categoryId = (event.target as HTMLSelectElement).value;
  
    // Convertir categoryId en nombre
    const categoryIdNumber = Number(categoryId);
  
    if (categoryIdNumber) {
      this.commonService.getSectorsByCategory(categoryIdNumber).subscribe(
        response => {
          this.sectors = response; // Mettez à jour la liste des secteurs
          console.log('Sectors:', this.sectors);
        },
        error => {
          // Vider la liste des secteurs en cas d'erreur 404
          if (error.status === 404) {
            console.error('No sectors found for this category');
            this.sectors = []; // Vider la liste des secteurs
          } else {
            console.error('Error fetching sectors:', error);
          }
        }
      );
    } else {
      this.sectors = []; // Réinitialisez les secteurs si aucune catégorie n'est sélectionnée
    }
  }
  
  
  

  onSubmit(): void {
    if (this.jobForm.valid) {
      const jobData = {
        title: this.jobForm.value.jobTitle,
        description: this.jobForm.value.jobDescription,
        critere: "Expérience avec Spring Boot", // Assuming you want to keep this static value
        experience: this.jobForm.value.experience,
        jobType: this.jobForm.value.jobType,
        salary: parseFloat(this.jobForm.value.offeredSalary.replace('$', '')) // Remove the dollar sign and convert to Float
      };

      const userConnect = localStorage.getItem('userconnect');
      const adminId = userConnect ? JSON.parse(userConnect).id : null; // Extract adminId
      console.log('adminId:', adminId);

      const categoryOfferId = this.jobForm.value.category;
      const companyId = this.jobForm.value.company; // Get company ID from the form
      const cityId = this.jobForm.value.city; // Get city ID from the form
      const sectorId = this.jobForm.value.sector; // Get sector ID from the form

      if (adminId) {
        this.commonAdminService.createJobOffer(jobData, adminId, companyId, categoryOfferId, cityId, sectorId).subscribe(
          response => {
            console.log('Job created successfully:', response);
            this.router.navigate(['/home/joblist']); // Redirect after successful submission
          },
          error => {
            console.error('Error creating job:', error);
          }
        );
      } else {
        console.error('Admin ID not found in local storage');
      }
    } else {
      console.log('Form is invalid');
    }
  }

  loadCities(): void {
    this.commonService.getAllCities().subscribe(
      (response) => {
        this.cities = response.cities;
        console.log('Cities:', this.cities);
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  loadCompanies(adminId: number): void {
    this.commonAdminService.getAllCompaniesByAdminId(adminId).subscribe(
      response => {
        this.companies = response.companies;
        console.log('Companies:', this.companies);
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  signOut(): void {
    const refreshToken = localStorage.getItem('refreshtoken'); // Get refresh token from local storage

    if (refreshToken) {
      this.authService.signout(refreshToken).subscribe(
        (response) => {
          console.log('Sign out successful:', response);
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
      localStorage.removeItem('userconnect');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshtoken');
      localStorage.removeItem('state');
      this.router.navigate(['/login']);
    }
  }
}
