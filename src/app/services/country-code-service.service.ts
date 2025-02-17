import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
  };
  fifa: string;
  cca2: string;
  idd?: {
    root: string;
    suffixes?: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class CountryCodeService {
  private apiUrl = 'https://restcountries.com/v3.1/all'; // Restcountries API endpoint

  constructor(private http: HttpClient) {}

  // Method to get all country codes
  getAllCountries(): Observable<any[]> {
    return this.http.get<Country[]>(this.apiUrl).pipe(
      map((countries) =>
        countries.map((country: Country) => ({
          name: country.name.common, // Nom du pays
          officialName: country.name.official, // Nom officiel
          flag: country.flags.png, // Drapeau (image)
          emojiFlag: country.flags.png, // Drapeau Emoji (corrected to use flags)
          fifa: country.fifa, // Code FIFA
          code: country.cca2, // Code ISO (ex: "TN")
          phoneCode: country.idd ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '') : 'N/A', // Indicatif téléphonique
        }))
      )
    );
  }
}