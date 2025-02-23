import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-level',
  templateUrl: './update-level.component.html',
  styleUrls: ['./update-level.component.css']
})
export class UpdateLevelComponent implements OnInit {
  form: FormGroup;
  levelId: number | null = null;
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
    // Get the level ID from the route parameters
    this.route.params.subscribe(params => {
      this.levelId = +params['id']; // Convert to number
      this.loadLevel(this.levelId); // Load the level data
    });
  }

  loadLevel(id: number) {
    // Call your service to get the level data
    this.commonService.getLevelById(id).subscribe(data => {
      console.log("data loaded", data);

      this.originalName = data.data.name; // Store the original name
      this.form.patchValue({
        name: this.originalName 
      });
    });
  }

  updateLevel() {
    if (this.form.valid) {
      if (this.levelId !== null) { // Check if levelId is not null
        // Check if the name has been modified
        if (this.form.value.name === this.originalName) {
          Swal.fire({
            title: 'No Changes!',
            text: 'You have not modified the level name.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
          return; // Exit the function if no changes were made
        }
  
        const superadminId = this.getSuperAdminId(); // Get the superadminId from local storage
  
        if (superadminId !== null) { // Check if superadminId is valid
          this.superAdminService.updateLevel(this.form.value, this.levelId, superadminId).subscribe({
            next: (response) => {
              console.log('Level updated successfully:', response);
            
              // Show success message
              Swal.fire({
                title: 'Success!',
                text: 'Level updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                this.router.navigate(['/home/superAdmin/levelList']); 
              });
            },
            error: (err) => {
              console.error('Error updating level:', err);
    
              // Check if error message contains duplicate key violation
              if (err?.error?.message && (err.error.message.includes('could not execute statement') || err.error.message.includes('constraint unique'))) {
                Swal.fire({
                  title: 'Error!',
                  text: 'Level name already exists. Please choose a different name.',
                  icon: 'warning',
                  confirmButtonText: 'OK'
                });
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: 'There was an error updating the level.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            }
          });
        } else {
          // Handle the case where superadminId is null
          Swal.fire({
            title: 'Error!',
            text: 'Superadmin ID is not valid.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } else {
        // Handle the case where levelId is null
        Swal.fire({
          title: 'Error!',
          text: 'Level ID is not valid.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      this.form.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
  
  // Example method to get superadminId
  getSuperAdminId(): number | null {
    const userConnect = localStorage.getItem('userconnect'); // Retrieve the userconnect from local storage
    if (userConnect) {
      try {
        const user = JSON.parse(userConnect); // Parse the JSON string
        return user.id; // Return the superadminId
      } catch (error) {
        console.error('Error parsing userconnect from local storage:', error);
        return null; // Return null if parsing fails
      }
    }
    return null; // Return null if userconnect is not found
  }
}