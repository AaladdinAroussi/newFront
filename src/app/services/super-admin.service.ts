import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
    private baseUrl = `${environment.url}/api/superAdmin/`;
  
  constructor(private http: HttpClient) { }
  private getHeaders(): HttpHeaders {
    const userConnect = localStorage.getItem('userconnect'); // Retrieve the userconnect object
    let token: string | null = null;

    if (userConnect) {
        const user = JSON.parse(userConnect); // Convert to object
        token = user.token; // Ensure the token is stored under the key 'token'
    }

    return new HttpHeaders({
        'Authorization': `Bearer ${token}` // Include the token in the headers
    });
}
  // Level Endpoints
  createLevel(level: any, superadminId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}saveLevel?superadminId=${superadminId}`, level, { headers: this.getHeaders() });
  }

  updateLevel(level: any, id: number, superadminId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}updateLevel?id=${id}&superadminId=${superadminId}`, level, { headers: this.getHeaders() });
  }

  deleteLevel(id: number, superadminId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}deleteLevel`, {
      params: {
        id: id.toString(),
        superadminId: superadminId.toString()
      },
      headers: this.getHeaders()
    });
  }

  // Category Offer Endpoints

 // Méthode pour ajouter une catégorie
 createCategoryOffer(categoryData: any, superAdminId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}saveCategoryOffer?superAdminId=${superAdminId}`, categoryData, { headers: this.getHeaders() });
}

updateCategoryOffer(categoryOffer: any, id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}updateCategoryOffer?id=${id}`, categoryOffer, { headers: this.getHeaders() });
}

deleteCategoryOffer(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}deleteCategoryOffer?id=${id}`, { headers: this.getHeaders() });
}

// City Endpoints
createCity(city: any, superadminId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}saveCity?superAdminId=${superadminId}`, city, { headers: this.getHeaders() });
}

updateCity(city: any, id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}updateCity?id=${id}`, city, { headers: this.getHeaders() });
}

deleteCity(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}deleteCity?id=${id}`, { headers: this.getHeaders() });
}

// Sector Endpoints
createSector(sector: any, superadminId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}saveSector?superAdminId=${superadminId}`, sector, { headers: this.getHeaders() });
}

updateSector(sector: any, id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}updateSector?id=${id}`, sector, { headers: this.getHeaders() });
}

deleteSector(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}deleteSector?id=${id}`, { headers: this.getHeaders() });
}

// Job Offer Endpoints
markJobAsOpen(id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}markOpen?id=${id}`, {}, { headers: this.getHeaders() });
}

getActiveJobOffers(): Observable<any> {
  return this.http.get(`${this.baseUrl}activeJob`, { headers: this.getHeaders() });
}

getPendingJobOffers(): Observable<any> {
  return this.http.get(`${this.baseUrl}pendingjobs`, { headers: this.getHeaders() });
}

// Company Endpoints
getAllCompanies(): Observable<any> {
  return this.http.get(`${this.baseUrl}allCompanies`, { headers: this.getHeaders() });
}

getAllCandidats(): Observable<any> {
  return this.http.get(`${this.baseUrl}getAllCandidats`, { headers: this.getHeaders() });
}
getAllAdmins(): Observable<any> {
  return this.http.get(`${this.baseUrl}getAllAdmins`, { headers: this.getHeaders() });
}
// Add these methods to your SuperAdminService

// Method to block a user
blockUser (userId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}block/${userId}`, {}, { headers: this.getHeaders() });
}

// Method to unblock a user
unblockUser (userId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}unblock/${userId}`, {}, { headers: this.getHeaders() });
}
}