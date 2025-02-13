import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  userRoles: string[] = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isCandidate: boolean = false;
 
   constructor(private router: Router,private authService: AuthService) { }
 
   ngOnInit(): void {
     this.userRoles = this.authService.getUserRoles();
 
     // Vérifiez si l'utilisateur a les rôles d'admin ou de super admin
     this.isAdmin = this.userRoles.includes('ROLE_ADMIN');
     this.isSuperAdmin = this.userRoles.includes('ROLE_SUPERADMIN');
     this.isCandidate = this.userRoles.includes('ROLE_CANDIDAT');
 
   }
 
 }
 