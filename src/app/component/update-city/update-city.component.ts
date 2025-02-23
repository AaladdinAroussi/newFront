import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-city',
  templateUrl: './update-city.component.html',
  styleUrls: ['./update-city.component.css']
})
export class UpdateCityComponent implements OnInit {
  form: FormGroup;
  cityId: number | null = null;
  originalName: string | null = null; // To store the original name

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the city ID from the route parameters
    this.route.params.subscribe(params => {
      this.cityId = +params['id']; // Convert to number
      this.loadCity(this.cityId); // Load the city data
    });
  }

  loadCity(id: number) {
    // Call your service to get the city data
    this.commonService.getCityById(id).subscribe(data => {
      console.log("data loaded", data.city);
      
      this.originalName = data.city.name; // Store the original name
      this.form.patchValue({
        name: this.originalName 
      });
    });
  }

  updateCity() {
    if (this.form.valid) {
      if (this.cityId !== null) { // Check if cityId is not null
        // Check if the name has been modified
        if (this.form.value.name === this.originalName) {
          Swal.fire({
            title: 'No Changes!',
            text: 'You have not modified the city name.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
          return; // Exit the function if no changes were made
        }

        this.superAdminService.updateCity(this.form.value, this.cityId).subscribe({
          next: (response) => {
            console.log('City updated successfully:', response);
          
            // Show success message
            Swal.fire({
              title: 'Success!',
              text: 'City updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/home/superAdmin/cityList']); 
            });
          },
          error: (err) => {
            console.error('Error updating city:', err);
  
            // Check if error message contains duplicate key violation
            if (err?.error?.message && (err.error.message.includes('could not execute statement') || err.error.message.includes('constraint unique'))) {
              Swal.fire({
                title: 'Error!',
                text: 'City name already exists. Please choose a different name.',
                icon: 'warning',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the city.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        });
      } else {
        // Handle the case where cityId is null
        Swal.fire({
          title: 'Error!',
          text: 'City ID is not valid.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      this.form.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}