import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-recruiter',
  templateUrl: './register-recruiter.component.html',
  styleUrls: ['./register-recruiter.component.css']
})
export class RegisterRecruiterComponent implements OnInit {
form!: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private service: AuthService) { }
  get fullnameControl() {
    return this.form.get('fullName');
  }
  get emailControl() {
    return this.form.get('email');
  }
  get passwordControl() {
    return this.form.get('password');
  }
    
  get phoneControl() {
    return this.form.get('phone');
  }

  ngOnInit(): void {
    
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  
  

  signUp(): void {
    console.log('signUp() called'); 
    if (this.form.valid) {
      const formData = this.form.value;
      formData.phone = Number(formData.phone);
      console.log('SignUp Infos:', formData);
      this.service.signupAdmin(formData).subscribe(
        (response) => {
          console.log('SignUp successfully:', response);
          Swal.fire("SignUp successfully");
          this.router.navigateByUrl("/login");
        },
        (error) => {
          console.error('Error signUp :', error);
        }
      );
    } else {
      console.warn("Form invalid", this.form.errors);
      this.form.markAllAsTouched();
    }
  }
  
}
