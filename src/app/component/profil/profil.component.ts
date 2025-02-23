  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { AdminService } from 'src/app/services/admin.service';
  import { AuthService } from 'src/app/services/auth.service';
  import { CandidatService } from 'src/app/services/candidat.service';
import { CommonService } from 'src/app/services/common.service';
  import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

  @Component({
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.css']
  })
  export class ProfilComponent implements OnInit {
    userRoles: string[] = [];
    cities: any[] = [];
    sectors: any[] = [];

    isAdmin = false;
    isSuperAdmin = false;
    isCandidate = false;
    userData: any | null = null;
    experienceLabel: string = '';
    
    // Declare separate FormGroup instances for each section
    formProfile!: FormGroup;
    formOtherInfo!: FormGroup;
    formExperience!: FormGroup;
    formSocialNetwork!: FormGroup;

    constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private candidatService: CandidatService,
      private adminService: AdminService,
      private commonService: CommonService,
      private superAdminService: SuperAdminService
    ) {}
    get fullnameControl() {
      return this.formProfile.get('fullName');
    }
    get emailControl() {
      return this.formProfile.get('email');
    }
  
    get phoneControl() {
      return this.formProfile.get('phone');
    }

    ngOnInit(): void {
      this.userRoles = this.authService.getUserRoles();
      this.isAdmin = this.userRoles.includes('ROLE_ADMIN');
      this.isSuperAdmin = this.userRoles.includes('ROLE_SUPERADMIN');
      this.isCandidate = this.userRoles.includes('ROLE_CANDIDAT');

      this.getAllSectors();
      this.loadCities();


      // Initialize the form groups
      this.formProfile = this.formBuilder.group({
        fullName: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        age: [''], // Age n'est pas requis
      });
      this.formOtherInfo = this.formBuilder.group({
        city: [''], // City n'est pas requis
        address: [''], // Address n'est pas requis
      });
      this.formExperience = this.formBuilder.group({
        experience: [''], // Experience n'est pas requis
        education: [''], // Education n'est pas requis
        languages: [''], // Languages n'est pas requis
        sector: [''], // Sector n'est pas requis
        bio: [''], // Bio n'est pas requis
      });

      this.formSocialNetwork = this.formBuilder.group({
    
    website: [''], // Website n'est pas requis
        github: [''], // Github n'est pas requis
        linkedin: [''], // LinkedIn n'est pas requis
      });



      const userId = this.getUserIdFromLocalStorage();
      if (userId) {
        if (this.isAdmin) {
          this.getAdminById(userId);
        } else if (this.isSuperAdmin) {
          this.getSuperAdminById(userId);
        } else if (this.isCandidate) {
          this.getCandidateById(userId);
        }
      }
    }
    getAllSectors(): void {
          this.commonService.getAllSectors().subscribe(
              (response: any) => {
                  this.sectors = response; // Store the retrieved sectors
                  console.log("sectors",this.sectors);
              },
              error => {
                  if (error.status === 404) {
                      console.warn('No sectors found.');
                      this.sectors = []; // Set sectors to an empty array
                    
                  } 
                }
          );
      }
    loadCities(): void {
      this.commonService.getAllCities().subscribe(
        (response) => {
          this.cities = response.cities;
          console.log('Cities:', this.cities);
        },
        (error) => {
          console.error('Error fetching cities:', error);
        }
      );
    }

    private getUserIdFromLocalStorage(): number | null {
      const userConnect = localStorage.getItem('userconnect');
      if (userConnect) {
        const user = JSON.parse(userConnect);
        return user?.id || null;
      }
      return null;
    }

    private getAdminById(adminId: number): void {
      this.adminService.getAdminById(adminId).subscribe(
        response => {
          this.userData = response.admin;
          console.log('Admin data:', this.userData);
          this.patchFormValues();
        },
        error => {
          console.error('Error fetching Admin data:', error);
        }
      );
    }

    private getSuperAdminById(superAdminId: number): void {
      this.superAdminService.getSuperAdminById(superAdminId).subscribe(
        response => {
          this.userData = response.SuperAdminOptional;
          console.log('SuperAdmin data:', this.userData);
          this.patchFormValues();
        },
        error => {
          console.error('Error fetching SuperAdmin data:', error);
        }
      );
    }

    private getCandidateById(candidateId: number): void {
      this.candidatService.getCandidatById(candidateId).subscribe(
          response => {
              this.userData = response.candidat;
              console.log('Candidate data:', this.userData);

              this.patchFormValues();
              console.log('Form value after patch:', this.formExperience.value);

              // Update the experience label
              this.updateExperienceLabel();
          },
          error => {
              console.error('Error fetching candidate data:', error);
          }
      );
  }

  private patchFormValues(): void {
    if (!this.userData) return;

    this.formProfile.patchValue({
      fullName: this.userData.fullName,
      phone: this.formatPhoneNumber(this.userData.phone), // Format the phone number
      email: this.userData.email,
      age: this.userData.details?.age || '', // Définit la valeur vide si details est null
    });
    this.formOtherInfo.patchValue({
      city: this.userData.details?.city || '',
      address: this.userData.details?.address,
    });
    this.formExperience.patchValue({
      experience: this.userData.experience,
      education: this.userData.details?.education,
      languages: this.userData.details?.languages,
      sector: this.userData.sector?.id || '', // Assurez-vous de récupérer l'ID du secteur
      bio: this.userData.details?.bio,
    });
    this.formSocialNetwork.patchValue({
      website: this.userData.details?.website,
      github: this.userData.details?.github,
      linkedin: this.userData.details?.linkedIn,
    });
    this.updateExperienceLabel();
  }
    
    private updateExperienceLabel(): void {
      const experience = this.userData.experience;
      this.experienceLabel = experience === 1 ? '1 year' : `${experience} years`; 
  }
  // Method to format the phone number

  private formatPhoneNumber(phone: string | Event): string {
    let cleanedValue: string;
    // If phone is an event, get the value from the input
    if (typeof phone === 'object') {
        const input = phone.target as HTMLInputElement;
        cleanedValue = input.value.replace(/[^0-9]/g, ''); // Clean the input value
    } else {
        cleanedValue = phone.replace(/[^0-9]/g, ''); // Clean the phone string
    }
    // Initialize the formatted value with the country code and plus sign
    let formattedValue = '+'; // Start with +
    // Format the cleaned value to add spaces
    if (cleanedValue.length > 0) {
        formattedValue += ' ' + cleanedValue.substring(0, 3); // Add the first two digits
    }
    if (cleanedValue.length > 3) {
        formattedValue += ' ' + cleanedValue.substring(3, 5); // Add a space and then the next four digits
    }
    if (cleanedValue.length > 5) {
        formattedValue += ' ' + cleanedValue.substring(5, 8); // Add a space and then the next three digits
    }
    if (cleanedValue.length > 8) {
        formattedValue += ' ' + cleanedValue.substring(8); // Add a space and then the remaining digits
    }
    return formattedValue.trim(); // Return the formatted value
}

formatPhoneInput(event: Event): void {
    const formattedValue = this.formatPhoneNumber(event); // Use the combined function
    const input = event.target as HTMLInputElement;
    input.value = formattedValue; // Set the formatted value back to the input
}
updateProfile(): void {
  // Convert email to lowercase
  const email = this.formProfile.value.email.toLowerCase();
  const phone = this.formProfile.value.phone.replace(/\D/g, ''); // Clean the phone number

  // Check if the new email or phone matches the existing values
  const existingEmail = this.userData.email.toLowerCase(); // Ensure existing email is in lowercase
  const existingPhone = this.userData.phone.replace(/\D/g, ''); // Clean existing phone number

  // Initialize flags to check if we need to perform existence checks
  let checkEmailExists = email !== existingEmail;
  let checkPhoneExists = phone !== existingPhone;

  

  // Check if email exists only if it has changed
  if (checkEmailExists) {
      this.authService.checkEmailExists({ email }).subscribe(
          (emailResponse) => {
              // If email does not exist, check if phone exists if it has changed
              if (checkPhoneExists) {
                  this.authService.checkPhoneExists({ phone }).subscribe(
                      (phoneResponse) => {
                          // If both email and phone are available, proceed with the update
                          this.performUpdate(phone, email);
                      },
                      (phoneError) => {
                          // Handle phone existence error
                          Swal.fire({
                              title: 'Error!',
                              text: 'Phone number is already in use!',
                              icon: 'error',
                              confirmButtonText: 'OK'
                          });
                      }
                  );
              } else {
                  // If phone hasn't changed, proceed with the update
                  this.performUpdate(phone, email);
              }
          },
          (emailError) => {
              // Handle email existence error
              Swal.fire({
                  title: 'Error!',
                  text: 'Email is already in use!',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
          }
      );
  } else if (checkPhoneExists) {
      // If email hasn't changed but phone has, check if phone exists
      this.authService.checkPhoneExists({ phone }).subscribe(
          (phoneResponse) => {
              // If phone is available, proceed with the update
              this.performUpdate(phone, email);
          },
          (phoneError) => {
              // Handle phone existence error
              Swal.fire({
                  title: 'Error!',
                  text: 'Phone number is already in use!',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
          }
      );
  } else {
      // If neither email nor phone has changed, just proceed with the update
      this.performUpdate(phone, email);
  }
}

private performUpdate(formattedPhone: string, email: string): void {
  // Create an object details that combines the relevant fields
  const details = {
      age: this.formProfile.value.age,
      bio: this.formExperience.value.bio,
      website: this.formSocialNetwork.value.website,
      github: this.formSocialNetwork.value.github,
      linkedIn: this.formSocialNetwork.value.linkedin,
      education: this.formExperience.value.education,
      languages: this.formExperience.value.languages,
      city: this.formOtherInfo.value.city,
      address: this.formOtherInfo.value.address
  };

  // Retrieve the sector ID and create a Sector object
  const sectorId = this.formExperience.value.sector; // Ensure this corresponds to formExperience
  const sector = { id: sectorId }; // Create a Sector object with the ID

  // Create a JSON object with all the necessary fields
  const updatedData: any = {
      fullName: this.formProfile.value.fullName,
      sector: sector, // Include the Sector object here        
      phone: formattedPhone,
      age: this.formProfile.value.age,
      experience: this.formExperience.value.experience,
      details: details // Include the details object here
  };

  // Conditionally add email if it has changed
  if (email !== this.userData.email.toLowerCase()) {
      updatedData.email = email; // Include email only if it has changed
  }

  // Log the updated data for debugging
  console.log('Updated Data:', updatedData);

  // Proceed with the update based on user role
  if (this.isAdmin) {
      this.adminService.updateAdmin(updatedData, this.userData.id).subscribe(
          response => {
              console.log('Admin profile updated successfully:', response);
              Swal.fire({
                  title: 'Success!',
                  text: 'Admin profile updated successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK'
              });
          },
          error => {
              console.error('Error updating admin profile:', error);
              this.handleUpdateError(error);
          }
      );
  } else if (this.isSuperAdmin) {
      this.superAdminService.updateSuperAdmin(updatedData, this.userData.id).subscribe(
          response => {
              console.log('Super Admin profile updated successfully:', response);
              Swal.fire({
                  title: 'Success!',
                  text: 'Super Admin profile updated successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK'
              });
          },
          error => {
              console.error('Error updating super admin profile:', error);
              this.handleUpdateError(error);
          }
      );
  } else if (this.isCandidate) {
      this.candidatService.updateCandidat(updatedData, this.userData.id).subscribe(
          response => {
              console.log('Candidate profile updated successfully:', response);
              Swal.fire({
                  title: 'Success!',
                  text: 'Candidate profile updated successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK'
              });
          },
          error => {
              console.error('Error updating candidate profile:', error);
              this.handleUpdateError(error);
          }
      );
  } else {
      console.error('User  role not recognized for update.');
  }
}

private handleUpdateError(error: any): void {
  if (error.error && error.error.message) {
      Swal.fire({
          title: 'Error!',
          text: error.error.message, // Display specific error message
          icon: 'error',
          confirmButtonText: 'OK'
      });
  } else {
      Swal.fire({
          title: 'Error!',
          text: 'There was an error updating the profile.',
          icon: 'error',
          confirmButtonText: 'OK'
      });
  }
}
  }