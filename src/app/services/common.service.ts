import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private baseUrl = `${environment.url}/api/Common/`;
  constructor(private http: HttpClient) { }


 // Job Offer Endpoints
 getAllJobOffers(): Observable<any> {
  return this.http.get(`${this.baseUrl}getAllExceptPending`);
}

getJobOfferById(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}getbyid/${id}`);
}

searchJobOffers(keyword: string): Observable<any[]> {
  const params = new HttpParams().set('keyword', keyword);
  return this.http.get<any[]>(`${this.baseUrl}search`, { params });
}
filterJobOffersByJobType(jobTypes: string[]): Observable<any> {
  return this.http.get(`${this.baseUrl}filter-by-job-type`, { params: { jobType: jobTypes } });
}

getAllCategoryOffers(): Observable<any> {
  return this.http.get(`${this.baseUrl}allCategoryOffers`);
}


getCategoryOfferById(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}getByIdCategoryOffer/${id}`);
}

filterByCategory(categoryName: string): Observable<any> {
  return this.http.get(`${this.baseUrl}filter-by-category`, { params: { categoryName } });
}

filterByLocation(location: string): Observable<any> {
  const params = new HttpParams().set('location', location);
  return this.http.get<any>(`${this.baseUrl}filter-by-location`, { params });
}

filterBySalary(salary: number): Observable<any> {
  return this.http.get(`${this.baseUrl}filter-by-salary`, { params: { salary } });
}

filterByExperience(experience: string): Observable<any> {
  return this.http.get(`${this.baseUrl}filter-by-experience`, { params: { experience } });
}

filterByDate(timeFrame: string): Observable<any> {
  return this.http.get(`${this.baseUrl}filter-by-date`, { params: { timeFrame } });
}

  
  // Company Endpoints
  getCompanyById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}getCompanyById/${id}`);
  }

  getAllCompanies(): Observable<any> {
    return this.http.get(`${this.baseUrl}getAllCompanies`);
  }

  // City Endpoints
  getAllCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}allCities`);
  }

  getCityById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}getByIdCity/${id}`);
  }

  // Level Endpoints
  getAllLevels(): Observable<any> {
    return this.http.get(`${this.baseUrl}allLevel`);
  }

  getLevelById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}getByIdLevel/${id}`);
  }

  // Sector Endpoints
  getAllSectors(): Observable<any> {
    return this.http.get(`${this.baseUrl}allSectors`);
  }

  getSectorById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}getByIdSector/${id}`);
  }

  getSectorsByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}allSectorsByCategory`, { params: { categoryId } });
  }

  filterJobOffers(
    keyword?: string,
    jobTypes?: string[],
    category?: string,
    location?: string,
    experienceLevel?: number,
    salary?: number
  ): Observable<any> {
    // Create HttpParams to hold the query parameters
    let params = new HttpParams();
  
    // Add parameters if they are provided
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (jobTypes && jobTypes.length > 0) {
      jobTypes.forEach(jobType => {
        params = params.append('jobTypes', jobType); // Append each job type
      });
    }
    if (category) {
      params = params.set('category', category);
    }
    if (location) {
      params = params.set('location', location);
    }
    if (experienceLevel !== undefined) {
      params = params.set('experienceLevel', experienceLevel.toString());
    }
    if (salary !== undefined) {
      params = params.set('salary', salary.toString());
    }
  
    // Make the GET request to the filter-job-offers endpoint
    return this.http.get(`${this.baseUrl}filter-job-offers`, { params });
  }


}