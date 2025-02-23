import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-sector',
  templateUrl: './update-sector.component.html',
  styleUrls: ['./update-sector.component.css']
})
export class UpdateSectorComponent implements OnInit {
  form!: FormGroup;
  superadminId: number | null = null;
  categories: any[] = [];
  sectorId: number | null = null; // To hold the sector ID
  originalValues: any; // To hold the original values of the sector

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private serv: CommonService,
    private sectorService: SuperAdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryIds: [[], Validators.required]
    });

    this.loadSuperAdminId();
    this.loadAllCategories();
    this.loadSector(); // Load the sector data
  }

  loadAllCategories(): void {
    this.serv.getAllCategoryOffers().subscribe(
      (response) => {
        this.categories = response.categoryOffers; // Store categories in the property
        console.log('Categories loaded:', this.categories);
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadSuperAdminId(): void {
    const userConnect = localStorage.getItem('userconnect');
    if (userConnect) {
      const user = JSON.parse(userConnect);
      this.superadminId = user.id; // Extract superadminId
      console.log('Super Admin ID:', this.superadminId);
    } else {
      console.error('User  not found in local storage');
    }
  }

  loadSector(): void {
    // Get the sector ID from the route parameters
    this.route.params.subscribe(params => {
      this.sectorId = +params['id']; // Convert to number
      if (this.sectorId) {
        this.serv.getSectorById(this.sectorId).subscribe(data => {
          // Assuming the response contains the sector object
          console.log("Sector", data);
          
          this.originalValues = {
            name: data.name,
            description: data.description,
            categories: data.categoryIds // Store original category IDs
          };

          this.form.patchValue({
            name: this.originalValues.name,
            description: this.originalValues.description,
            categoryIds: this.originalValues.categories
          });
        }, error => {
          console.error('Error loading sector:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to load sector data.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }

  updateSector(): void {
    if (this.form.valid) {
      if (this.sectorId !== null) { // Check if sectorId is not null
        // Check if the values have changed
        const currentValues = {
          name: this.form.value.name,
          description: this.form.value.description,
          categories: this.form.value.categories
        };

        if (
          currentValues.name === this.originalValues.name &&
          currentValues.description === this.originalValues.description &&
          JSON.stringify(currentValues.categories) === JSON.stringify(this.originalValues.categories)
        ) {
          Swal.fire({
            title: 'No Changes!',
            text: 'You have not modified any fields.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
          return; // Exit the function if no changes were made
        }

        // Call the updateSector method from the service with the form value and sectorId
        this.sectorService.updateSector (this.form.value, this.sectorId).subscribe({
          next: (response) => {
            console.log('Sector updated successfully:', response);
            Swal.fire({
              title: 'Success!',
              text: 'Sector updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/home/superAdmin/sectorList']); 
            });
          },
          error: (err) => {
            console.error('Error updating sector:', err);
            
            // Check if the error status is 400
            if (err.status === 400) {
              Swal.fire({
                title: 'Error!',
                text: 'Sector name already exists. Please choose a different name.',
                icon: 'warning',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the sector.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Sector ID is not valid.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      this.form.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  get nameControl() {
    return this.form.get('name');
  }

  get descriptionControl() {
    return this.form.get('description');
  }

  get categoriesControl() {
    return this.form.get('categoryIds');
  }

  onCategoryChange(event: any): void {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedCategoryIds = selectedOptions.map((option: any) => option.value);
    this.form.patchValue({ categories: selectedCategoryIds });
  }
}