import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CountryCodeService } from 'src/app/services/country-code-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-recruiter',
  templateUrl: './register-recruiter.component.html',
  styleUrls: ['./register-recruiter.component.css']
})
export class RegisterRecruiterComponent implements OnInit {
form!: FormGroup;
countries: any[] = [];
selectedCountryCode: string = '';
dropdownOpen = false;
selectedCountryName: string = '';
selectedCountry: string = ''; // Variable pour stocker le pays sélectionné

  constructor(private router: Router, private fb: FormBuilder, private service: AuthService,private countryCodeService: CountryCodeService
  ) { }
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
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Validation pour chiffres uniquement
      email: ['', [Validators.required, Validators.email]], // Validation pour email
      password: ['', [Validators.required, Validators.minLength(5)]], // Assurez-vous que c'est un tableau
      country: [this.selectedCountry || '', Validators.required], // Ajout du pays dans le formulaire réactif
    });
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

  signUp(): void {
    console.log('signUp() called'); 
    if (this.form.valid) {
      const formData = this.form.value;
      const phoneWithoutPlus = this.selectedCountryCode.replace('+', '') + formData.phone;
      formData.phone = phoneWithoutPlus; // Set the phone number without the '+' sign  
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
