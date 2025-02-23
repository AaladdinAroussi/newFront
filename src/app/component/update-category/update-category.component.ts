import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
  form: FormGroup;
  categoryId: number | null = null;
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
    // Get the category ID from the route parameters
    this.route.params.subscribe(params => {
      this.categoryId = +params['id']; // Convert to number
      this.loadCategory(this.categoryId); // Load the category data
    });
  }

  loadCategory(id: number) {
    // Call your service to get the category data
    this.commonService.getCategoryOfferById(id).subscribe(data => {
      console.log("data loaded", data.categoryOffer);
      
      this.originalName = data.categoryOffer.name; // Store the original name
      this.form.patchValue({
        name: this.originalName 
      });
    });
  }

  updateCategory() {
    if (this.form.valid) {
      if (this.categoryId !== null) { // Check if categoryId is not null
        // Check if the name has been modified
        if (this.form.value.name === this.originalName) {
          Swal.fire({
            title: 'No Changes!',
            text: 'You have not modified the category name.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
          return; // Exit the function if no changes were made
        }

        this.superAdminService.updateCategoryOffer(this.form.value, this.categoryId).subscribe({
          next: (response) => {
            console.log('Category updated successfully:', response);
          
            // Show success message
            Swal.fire({
              title: 'Success!',
              text: 'Category updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/home/superAdmin/categoryList']); 
            });
          },
          error: (err) => {
            console.error('Error updating category:', err);
  
            // Check if error message contains duplicate key violation
            if (err?.error?.message && (err.error.message.includes('could not execute statement') || err.error.message.includes('constraint unique'))) {
              Swal.fire({
                title: 'Error!',
                text: 'Category name already exists. Please choose a different name.',
                icon: 'warning',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the category.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        });
      } else {
        // Handle the case where categoryId is null
        Swal.fire({
          title: 'Error!',
          text: 'Category ID is not valid.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      this.form.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}