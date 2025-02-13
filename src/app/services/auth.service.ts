import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.url}/api/auth`; 

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }
  // getUserRole(): string {
  //   const userData = localStorage.getItem('userconnect');
  //   if (userData) {
  //     const parsedData = JSON.parse(userData);
  //     return parsedData.roles && parsedData.roles.length > 0 ? parsedData.roles[0] : 'guest';
  //   }
  //   return 'guest';
  // }

  getUserRoles(): string[] {
    const userData = localStorage.getItem('userconnect');
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData.roles || [];
    }
    return [];
  }
  

  // Méthode pour s'inscrire
  signupCandidat(signupRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signupCandidat`, signupRequest);
  }

  // Méthode pour s'inscrire en tant qu'admin
  signupAdmin(signupRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signupAdmin`, signupRequest);
  }

  // Méthode pour se connecter
  // signin(loginRequest: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/signin`, loginRequest);
  // }
  signIn(user: any): Observable<any> {
    return this.http.post(`${environment.url}/api/auth/signin`,user);
  }

  // Méthode pour se déconnecter
  signout(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signout`, { refreshToken });
  }

  // Méthode pour réinitialiser le mot de passe
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resetPassword/${token}`, { newPassword });
  }

  // Méthode pour oublier le mot de passe
  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgetPassword`, { email });
  }

  // Méthode pour changer le mot de passe
  changePassword(token: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/changePassword`, { token, oldPassword, newPassword });
  }
}