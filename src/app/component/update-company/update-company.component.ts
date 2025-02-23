import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonAdminService } from 'src/app/services/common-admin.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.css']
})
export class UpdateCompanyComponent implements OnInit {
  companyId: number | null = null;
  companyData: any;
  companyForm: FormGroup; 
  
  userRoles: string[] = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  constructor(private route: ActivatedRoute,private router:Router, private commonAdminService: CommonAdminService, private commonService: CommonService,private authService: AuthService,private fb: FormBuilder) { 
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      websiteUrl: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.minLength(10), 
        Validators.pattern(/^[\d ]+$/),
      ]],
      postCode: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^\d{4}$/)
      ]]
    });
  }
  get websiteControl() {
    return this.companyForm.get('websiteUrl');
  }
  get nameControl() {
    return this.companyForm.get('name');
  }

  get addressControl() {
    return this.companyForm.get('address');
  }

  get emailControl() {
    return this.companyForm.get('email');
  }

  get phoneControl() {
    return this.companyForm.get('phone');
  }
  get postCodeControl() {
    return this.companyForm.get('postCode');
  }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    // Vérifiez si l'utilisateur a les rôles d'admin ou de super admin
    this.isAdmin = this.userRoles.includes('ROLE_ADMIN');
    this.isSuperAdmin = this.userRoles.includes('ROLE_SUPERADMIN');


    // Récupérer l'ID de l'entreprise à partir des paramètres de la route
    this.route.params.subscribe(params => {
      this.companyId = +params['id']; // Convertir en nombre
      console.log('ID de l\'entreprise à mettre à jour:', this.companyId);

      if (!this.companyId || isNaN(this.companyId)) {
        console.error("companyId invalide :", this.companyId);
        return;
      }

      // Vérifier si companyId n'est pas null avant d'appeler le service
      if (this.companyId !== null) {
        this.getCompanyById(this.companyId).subscribe({
          next: (data) => {
            this.companyData = data.company; // Stocker les données de l'entreprise
            console.log('Données de l\'entreprise:', this.companyData);
            // Remplir le formulaire avec les données de l'entreprise

            this.companyForm.patchValue({
              name: this.companyData.name,
              websiteUrl: this.companyData.websiteUrl,
              address: this.companyData.address,
              email: this.companyData.email,
              phone: this.companyData.phone,
              postCode: this.companyData.postCode
            });
            setTimeout(() => this.formatPhoneNumber2(), 0);
            
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des données de l\'entreprise:', err);
          }
        });
      }
    });
  }
  formatPostcodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let cleanedValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  
    if (cleanedValue.length > 4) {
      cleanedValue = cleanedValue.substring(0, 4); // Restrict to 4 digits
    }
  
    input.value = cleanedValue; // Set the cleaned value back to the input
  }
  
  getCompanyById(id: number): Observable<any> {
    return this.commonService.getCompanyById(id); 
  }


  formatPhoneNumber2() {
    let phone = this.phoneControl?.value;
  
    if (phone !== null && phone !== undefined) {
      phone = phone.toString(); // Convertir en chaîne de caractères si ce n'est pas déjà le cas
      phone = phone.replace(/\D/g, ''); // Supprime tous les caractères non numériques
  
      if (phone.length > 2) {
        phone = phone.substring(0, 2) + ' ' + phone.substring(2);
      }
      if (phone.length > 6) {
        phone = phone.substring(0, 6) + ' ' + phone.substring(6);
      }
    }
  
    this.phoneControl?.setValue(phone, { emitEvent: false });
  }
  
  
  formatPhoneNumber() {
    let phone = this.phoneControl?.value.replace(/\D/g, ''); // Supprime tous les caractères non numériques
    if (phone) {
      // Formate en groupes séparés par des espaces
      phone = phone.match(/(\d{0,2})(\d{0,3})(\d{0,3})/)
                   .slice(1)
                   .join(' ') // Utilise un espace comme séparateur
                   .replace(/\s+$/g, '') // Supprime les espaces en fin de chaîne
                   .trim(); // Supprime les espaces au début et à la fin
    }
    this.phoneControl?.setValue(phone, { emitEvent: false });
  }



onSubmit() {
  if (!this.companyForm.valid) {
    this.companyForm.markAllAsTouched();
    console.warn("Form is invalid, request canceled.");
    return;
  }

  console.log("companyId before request:", this.companyId);

  if (!this.companyId || isNaN(Number(this.companyId))) {
    console.error("companyId is invalid:", this.companyId);
    return;
  }

  // Clean only the phone field by removing spaces
  let phone = this.phoneControl?.value;
  const formattedForm = { ...this.companyForm.value }; // Copy of the form object

  if (phone) {
    formattedForm.phone = phone.replace(/\s+/g, ''); // Apply the cleaned format to phone
  }

  // Convert companyId to a number
  const companyIdNum = Number(this.companyId);
  if (isNaN(companyIdNum)) {
    console.error("Invalid ID:", this.companyId);
    return;
  }

  // Send the request with the cleaned phone number
  this.commonAdminService.updateCompany(companyIdNum, formattedForm).subscribe({
    next: (response) => {
      console.log('Company successfully updated:', response);

      // Show a SweetAlert success message
      Swal.fire({
        title: 'Success!',
        text: 'The company has been successfully updated.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/home/companyList']); // Redirect after clicking "OK"
      });
    },
    error: (err) => {
      console.error("Error updating company:", err);

      // Show a SweetAlert error message
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while updating the company.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}

  
  
  
}