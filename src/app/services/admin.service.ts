import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.url}/api/admin`; 

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const userConnect = localStorage.getItem('userconnect'); // Récupérer l'objet userconnect
    let token: string | null = null;

    if (userConnect) {
      const user = JSON.parse(userConnect); // Convertir en objet
      token = user.token; // Assurez-vous que le jeton est stocké sous la clé 'token'
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Inclure le jeton dans les en-têtes
    });
  }

  updateAdmin(admin: any, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, admin, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Update admin error', error);
        return throwError(error);
      })
    );
  }

  // updateAdmin(admin: any, id: number): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/update/${id}`, admin, {
  //     headers: { 'Content-Type': 'application/json', ...this.getHeaders() }
  //   }).pipe(
  //     catchError(error => {
  //       console.error('Update admin error', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  

  // Méthode pour marquer une offre comme "pourvue"
  markJobAsFilled(jobId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/markFilled?id=${jobId}`, {}, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Mark job as filled error', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour fermer une offre d'emploi
  closeJobOffer(jobId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/close?id=${jobId}`, {}, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Close job offer error', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer les offres actives par ID d'admin
  getActiveJobOffersByAdmin(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/activeJobs?adminId=${adminId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Get active job offers error', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer les offres ouvertes par ID d'admin
  getOpenJobOffersByAdmin(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/openJobs?adminId=${adminId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Get open job offers error', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer les offres en attente par ID d'admin
  getPendingJobOffersByAdmin(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pendingJobs?adminId=${adminId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Get pending job offers error', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer un admin par ID
  getAdminById(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAdminById/${adminId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Get admin by ID error', error);
        return throwError(error);
      })
    );
  }

}