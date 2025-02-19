import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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

  changePasswordForm: FormGroup;
  passwordsMismatch: boolean = false;

  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder) {
    // Initialisez le FormGroup
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(5)]], // Validation de longueur minimale
            confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    this.isAdmin = this.userRoles.includes('ROLE_ADMIN');
    this.isSuperAdmin = this.userRoles.includes('ROLE_SUPERADMIN');
    this.isCandidate = this.userRoles.includes('ROLE_CANDIDAT');

    // Vérifiez si les mots de passe correspondent en temps réel
    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });

    this.changePasswordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
  }


// Méthode pour vérifier si les mots de passe correspondent
checkPasswords(): void {
  const newPassword = this.changePasswordForm.get('newPassword')?.value;
  const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;

  // Ne pas afficher le message d'erreur si confirmPassword est vide
  if (confirmPassword === '') {
      this.passwordsMismatch = false; // Ne pas marquer comme mismatch si confirmPassword est vide
  } else {
      this.passwordsMismatch = newPassword !== confirmPassword; // Vérifiez la correspondance
  }
}

  // Méthode pour changer le mot de passe
  changePassword(): void {
    if (this.changePasswordForm.valid && !this.passwordsMismatch) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;

      const userConnect = localStorage.getItem('userconnect');
      let token = '';
      
      if (userConnect) {
          const user = JSON.parse(userConnect);
          token = user.token; 
      }
      // console.log("token: " + token);
      // console.log("old password: " + oldPassword);
      // console.log("new password: " + newPassword);


      this.authService.changePassword(token, oldPassword, newPassword).subscribe(
        response => {
          console.log('Password changed successfully:', response);
          Swal.fire({
            title: 'Success!',
            text: 'Password changed successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          // Optionnel : rediriger l'utilisateur après le changement de mot de passe
          this.router.navigate(['/home']); // Redirigez vers la page de profil ou une autre page
        },
        error => {
          console.error('Error changing password:', error);
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
              text: 'There was an error changing the password.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    } else {
      // Marquez tous les contrôles comme touchés pour afficher les erreurs
      this.changePasswordForm.markAllAsTouched();
    }
  }

  // Getters pour les contrôles
  get oldPasswordControl() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPasswordControl() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.changePasswordForm.get('confirmPassword');
  }
}