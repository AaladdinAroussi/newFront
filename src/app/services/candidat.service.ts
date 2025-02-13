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

}