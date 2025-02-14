import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatService } from 'src/app/services/candidat.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  userRoles: string[] = [];
  isAdmin = false;
  isSuperAdmin = false;
  isCandidate = false;
  userData: any | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private candidatService: CandidatService,
    private adminService: AdminService,
    private superAdminService: SuperAdminService
  ) {}

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    this.isAdmin = this.userRoles.includes('ROLE_ADMIN');
    this.isSuperAdmin = this.userRoles.includes('ROLE_SUPERADMIN');
    this.isCandidate = this.userRoles.includes('ROLE_CANDIDAT');

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
      response => this.userData = response.admin,
      error => console.error('Error fetching admin data:', error)
    );
  }

  private getSuperAdminById(superAdminId: number): void {
    this.superAdminService.getSuperAdminById(superAdminId).subscribe(
      response => this.userData = response.SuperAdminOptional,
      error => console.error('Error fetching super admin data:', error)
    );
  }

  private getCandidateById(candidateId: number): void {
    this.candidatService.getCandidatById(candidateId).subscribe(
      response => this.userData = response.candidat,
      error => console.error('Error fetching candidate data:', error)
    );
  }

  updateProfile(form: any): void {
    const updatedCandidat = {
      ...this.userData,
      fullName: form.value.fullName,
      phone: form.value.phone,
      email: form.value.email,
      experience: form.value.experience,
      candidateDetails: {
        linkedIn: form.value.linkedin,
        website: form.value.website,
        github: form.value.github,
        age: form.value.age,
        languages: form.value.languages.split(',').map(lang => lang.trim()),
        bio: form.value.bio,
        image: form.value.image // Assuming you handle image upload separately
      }
    };
}
}
