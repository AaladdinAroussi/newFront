import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CountryCodeService } from 'src/app/services/country-code-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  selectedCountryCode: string = '';
  dropdownOpen = false;
  selectedCountryName: string = '';
  selectedCountry: string = ''; // Variable pour stocker le pays sélectionné
  countries: any[] = [];
  form!: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: AuthService,
    private countryCodeService: CountryCodeService
  ) { }

  get fullnameControl() {
    return this.form.get('fullName');
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
  get confirmPasswordControl() {
    return this.form.get('confirmPassword');
  }

  ngOnInit(): void {
    this.countryCodeService.getAllCountries().subscribe(
      (data) => {
        this.countries = data; // Stocker les pays récupérés
        console.log('Countries retrieved:', this.countries);
        // Set a default country (e.g., Tunisia)

      const defaultCountry = this.countries.find(country => country.code === 'TN'); // Assuming 'TN' is the code for Tunisia

      if (defaultCountry) {
        this.selectedCountry = defaultCountry.code;
        this.selectedCountryName = defaultCountry.name;
        this.selectedCountryCode = defaultCountry.phoneCode;
        this.form.get('country')?.setValue(this.selectedCountry);
      }
        
      },
      (error) => {
        console.error('Error retrieving countries:', error);
      }
    );

    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]],
      country: [this.selectedCountry || '', Validators.required],
    },   { validators: this.passwordMatchValidator });
    
  
  
    console.log('Form initialized:', this.form);
  }
  togglePasswordVisibility(fieldId: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    if (!input) return;
  
    if (fieldId === 'password-field') {
      this.passwordVisible = !this.passwordVisible;
      input.type = this.passwordVisible ? 'text' : 'password';
    } else if (fieldId === 'confirm-password-field') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
      input.type = this.confirmPasswordVisible ? 'text' : 'password';
    }
  }
   // Méthode pour valider la correspondance des mots de passe
   passwordMatchValidator(group: FormGroup): any {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }
  formatPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove all non-numeric characters except spaces
    const cleanedValue = input.value.replace(/[^0-9]/g, '');
    // Format the cleaned value to add spaces
    let formattedValue = '';
    if (cleanedValue.length > 0) {
      // Add the first two digits
      formattedValue += cleanedValue.substring(0, 2);
    }
    if (cleanedValue.length > 2) {
      // Add a space and then the next four digits
      formattedValue += ' ' + cleanedValue.substring(2, 5);
    }
    if (cleanedValue.length > 5) {
      // Add a space and then the remaining digits
      formattedValue += ' ' + cleanedValue.substring(5, 8);
    }
    input.value = formattedValue.trim(); // Set the formatted value back to the input
  }
  selectCountry(country: any): void {
    this.selectedCountry = country.code;
    this.selectedCountryName = country.name; // Optional: Keep this if you need it for display purposes
    this.selectedCountryCode = country.phoneCode; // Update the phone code
    this.form.get('country')?.setValue(this.selectedCountry);
    // Do not set the phone input value here
    this.dropdownOpen = false; // Close the dropdown after selection
  }
  getCountryFlag(countryCode: string): string {
    const country = this.countries.find(c => c.code === countryCode);
      return country ? country.emojiFlag : '';
  }
   // Close the dropdown when clicking outside

   @HostListener('document:click', ['$event'])
   onClick(event: MouseEvent): void {
     const target = event.target as HTMLElement;
     const dropdown = document.querySelector('.custom-dropdown') as HTMLElement;
     // Check if the click is outside the dropdown
     if (dropdown && !dropdown.contains(target)) {
       this.dropdownOpen = false;
     }
   }

  private static passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  
   signUp(): void {
    console.log("Confirm Password Control:", this.confirmPasswordControl);

    console.log('signUp() called');
    if (this.form.valid) {
      const formData = this.form.value;
  
      // Convert email to lowercase
      formData.email = formData.email.toLowerCase();
  
      // Remove spaces from the phone number and combine with country code
      const phoneWithoutSpaces = formData.phone.replace(/\s+/g, ''); 
      const phoneWithCountryCode = this.selectedCountryCode.replace('+', '') + phoneWithoutSpaces; 
      formData.phone = phoneWithCountryCode; // Set the phone number without spaces  
  
      console.log('SignUp Infos:', formData);
  
      // Check if phone number exists
      this.service.checkPhoneExists({ phone: formData.phone }).subscribe(
        (phoneResponse) => {
          // If phone is available, check if email exists
          this.service.checkEmailExists({ email: formData.email }).subscribe(
            (emailResponse) => {
              // If both phone and email are available, store data in localStorage
              localStorage.setItem('candidateData', JSON.stringify(formData));
              // Redirect to the details page after storing data
              this.router.navigateByUrl('/addDetails'); 
            },
            (emailError) => {
              console.error('Email check error:', emailError);
              // Display a specific message if the email is already in use
              const errorMessage = emailError.error?.message || 'Email is already in use!';
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
              });
            }
          );
        },
        (phoneError) => {
          console.error('Phone check Error:', phoneError);
          // Display a specific message if the phone number is already in use
          const errorMessage = phoneError.error?.message || 'Phone number is already in use!';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
        }
      );
    } else {
      console.warn("Form invalid:", this.form.errors, this.form);
      this.form.markAllAsTouched();
    }
  }

}
