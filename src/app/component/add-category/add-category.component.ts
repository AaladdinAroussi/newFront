import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  form!: FormGroup;
  superadminId: number | null = null;
  constructor(private fb: FormBuilder, private router: Router, private categoryService: SuperAdminService,private authService: AuthService) { }
  get nameControl() {
    return this.form.get('name');
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
    this.loadSuperAdminId();
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

  addCategory(): void {
    if (this.form.valid) {
      const categoryData = {
        name: this.form.value.name,
      };

      if (this.superadminId) {
        this.categoryService.createCategoryOffer(categoryData, this.superadminId).subscribe(
          response => {
            console.log('category added successfully:', response);
            Swal.fire({
              title: 'Success!',
              text: 'category added successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/home/superAdmin/categoryList']);
            });
          },
          error => {
            console.error('Error adding category:', error);
            if (error.status === 409) {
              Swal.fire({
                title: 'Error!',
                text: 'category name must be unique. Please choose a different name.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Error adding category: ' + error.message,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        );
      } else {
        console.error('Super Admin ID not found in local storage');
        Swal.fire({
          title: 'Error!',
          text: 'Super Admin ID not found in local storage.',
          icon: 'error',
          confirmButtonText : 'OK'
        });
      }
    } else {
      console.log('Form is invalid');
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

}
