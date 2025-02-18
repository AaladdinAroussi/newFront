import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidatService {
  private apiUrl = `${environment.url}/api/candidat`; 

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
  // Méthode pour ajouter un favori
  addFavori(candidatId: number, jobOfferId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${candidatId}/favoris/${jobOfferId}`, {}).pipe(
      catchError(error => {
        console.error('Add favori error', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer les favoris d'un candidat
  getFavoris(candidatId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${candidatId}/favoris`).pipe(
      catchError(error => {
        console.error('Get favoris error', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour supprimer un favori
  deleteFavori(favorisId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favoris/${favorisId}`).pipe(
      catchError(error => {
        console.error('Delete favori error', error);
        return throwError(error);
      })
    );
  }
  // Méthode pour supprimer un candidat
deleteCandidat(candidatId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete/${candidatId}`).pipe(
    catchError(error => {
      console.error('Delete candidat error', error);
      return throwError(error);
    })
  );
}

  // Méthode pour récupérer un candidat par ID
  getCandidatById(candidatId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCandidatById/${candidatId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Get candidat by ID error', error);
        return throwError(error);
      })
    );
  }
  updateCandidat(candidat: any, id: number): Observable<any> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.apiUrl}/update/${id}`, candidat, { headers }).pipe(
      catchError(error => {
        console.error('Update candidat error', error);
        return throwError(error);
      })
    );
  }
  
  

}