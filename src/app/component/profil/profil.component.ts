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
      phone: this.userData.phone,
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

  updateProfile(): void {
    // Créez un objet details qui combine les champs pertinents
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

    // Récupérez l'ID du secteur et créez un objet Sector
    const sectorId = this.formExperience.value.sector; // Assurez-vous que cela correspond à formExperience
    const sector = { id: sectorId }; // Créez un objet Sector avec l'ID

    // Créez un objet JSON avec tous les champs nécessaires
    const updatedData = {
        fullName: this.formProfile.value.fullName,
        sector: sector, // Incluez l'objet Sector ici        
        phone: this.formProfile.value.phone,
        email: this.formProfile.value.email,
        age: this.formProfile.value.age,
        experience: this.formExperience.value.experience,
        details: details // Incluez l'objet details ici
    };

    // Log des données mises à jour pour le débogage
    console.log('Updated Data:', updatedData);

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
                if (error.error && error.error.message) {
                    Swal.fire({
                        title: 'Error!',
                        text: error.error.message, // Affiche le message d'erreur spécifique
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was an error updating the admin profile.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
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
                if (error.error && error.error.message) {
                    Swal.fire({
                        title: 'Error!',
                        text: error.error.message, // Affiche le message d'erreur spécifique
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was an error updating the super admin profile.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
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
                if (error.error && error.error.message) {
                    Swal.fire({
                        title: 'Error!',
                        text: error.error.message, // Affiche le message d'erreur spécifique
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was an error updating the candidate profile.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
        );
    } else {
        console.error('User  role not recognized for update.');
    }
}
  }