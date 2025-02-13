import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private service: AuthService) { }

  get usernameControl() {
    return this.form.get('username');
  }
  
  get emailControl() {
    return this.form.get('email');
  }
  
  get phoneControl() {
    return this.form.get('phone');
  }
  get passwordControl() {
    return this.form.get('password');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Validation pour les chiffres uniquement
      email: ['', [Validators.required, Validators.email]], // Correctly set up validators as an array
      password: ['', Validators.required],
    });
  }

  signUp(): void {
    console.log('signUp() called'); 
    if (this.form.valid) {
      const formData = this.form.value;
      formData.phone = Number(formData.phone);
      console.log('SignUp Infos:', formData);
      
      this.service.signupCandidat(formData).subscribe(
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