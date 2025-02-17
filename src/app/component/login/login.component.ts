import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
  ) {}
  
  get loginControl() {
    return this.form.get('login');
  }

  get passwordControl() {
    return this.form.get('password');
  }

  ngOnInit(): void {
    this.signOut();
    localStorage.clear();
    sessionStorage.clear();
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signIn() {
    if (this.form.invalid) {
      return;
    }

    const loginRequest = {
      login: this.form.value.login,
      password: this.form.value.password
    };

    this.authService.signIn(loginRequest).subscribe(
      (response: any) => {
        console.log('Login successful:', response);

        // Check if token and refresh token exist before storing // && response.refreshToken
        if (response.token ) {
          localStorage.setItem('userconnect', JSON.stringify(response));
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('refreshtoken', response.refreshToken);
          localStorage.setItem('state', '0');
        } else {
          console.warn("Tokens missing in response.");
          Swal.fire("Erreur", "Problème d'authentification. Veuillez réessayer.", "error");
          return;
        }

        // Retrieve user roles and navigate
        const userConnect = localStorage.getItem("userconnect");
        if (userConnect) {
          const user = JSON.parse(userConnect);
          const roles = user.roles;

          if (roles && Array.isArray(roles)) {
            console.log('User roles:', roles);

            if (roles.includes('ROLE_ADMIN')) {
              this.router.navigateByUrl('/admin/dashboard');
            } else {
              this.router.navigateByUrl('/home');
            }
          }
        }

        this.form.reset();
      },
      error => {
        console.error('Login failed:', error);

        const errorMessage = typeof error.error === "string" ? error.error : "";

        // Handling 401 errors: Redirect to verification if needed
        if (error.status === 401 && (errorMessage.includes("Un code de vérification a été généré") || 
                                     errorMessage.includes("Erreur: Numéro de mobile non confirmé."))) {
          console.warn("Redirecting to verification...");
          this.redirectToVerification();
          return;
        }

        // Handling 400 errors: Various authentication errors
        if (error.status === 400) {
          switch (true) {
            case errorMessage.includes("Utilisateur non trouvé"):
              Swal.fire("Erreur", "Aucun utilisateur correspondant trouvé.", "error");
              break;

            case errorMessage.includes("Erreur: Numéro de mobile non confirmé."):
            case errorMessage.includes("Un code de vérification existe déjà pour ce candidat."):
              console.warn("Redirecting to verification...");
              this.redirectToVerification();
              break;

            default:
              Swal.fire("Erreur", "Une erreur inconnue est survenue.", "error");
              break;
          }
        } else {
          Swal.fire("Erreur", errorMessage || "Identifiants invalides", "error");
        }
      }
    );
  }

  private redirectToVerification() {
    const loginValue = this.form.value.login;

    // Check if the login value is an email (contains '@')
    if (loginValue.includes('@')) {
      this.commonService.getUserByEmail(loginValue).subscribe(
        response => {
          const user = response;
          const phone = user.phone;
          const id = user.id;
          if (phone) {
            // Store userId and phone in sessionStorage
            sessionStorage.setItem('password', this.form.value.password);
            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('phone', phone);
            this.router.navigate(['/verification']);
          } else {
            Swal.fire("Erreur", "Le numéro de téléphone de l'utilisateur est introuvable.", "error");
          }
        },
        error => {
          console.error('Error fetching user data:', error);
          Swal.fire("Erreur", "Impossible de récupérer les données utilisateur.", "error");
        }
      );
    } else {
      // If login value is a phone number, call getUserByPhone
      this.commonService.getUserByPhone(loginValue).subscribe(
        response => {
          const user = response;
          const id = user.id;
          if (id) {
            // Store userId and phone in sessionStorage
            sessionStorage.setItem('password', this.form.value.password);
            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('phone', loginValue);
            this.router.navigate(['/verification']);
          } else {
            Swal.fire("Erreur", "L'utilisateur n'existe pas avec ce numéro de téléphone.", "error");
          }
        },
        error => {
          console.error('Error fetching user data:', error);
          Swal.fire("Erreur", "Impossible de récupérer les données utilisateur.", "error");
        }
      );
    }
  }

  signOut(): void {
    const refreshToken = localStorage.getItem('refreshtoken'); // Get refresh token from local storage

    if (refreshToken) {
      this.authService.signout(refreshToken).subscribe(
        (response) => {
          console.log('Sign out successful:', response);

          // Remove all relevant items from local storage
          localStorage.removeItem('userconnect');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshtoken');
          localStorage.removeItem('state');

          this.router.navigate(['/login']); // Redirect to login page
        },
        (error) => {
          console.error('Error during sign out:', error);
        }
      );
    } else {
      console.log('No refresh token found');
      // Optionally, you can still clear local storage and redirect
      localStorage.removeItem('userconnect');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshtoken');
      localStorage.removeItem('state');
      this.router.navigate(['/login']);
    }
  }
}
