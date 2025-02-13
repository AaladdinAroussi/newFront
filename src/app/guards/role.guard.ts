import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private service: AuthService, private router: Router) {}
  
    canActivate(route: ActivatedRouteSnapshot): boolean {
      const expectedRoles: string[] = route.data['expectedRoles']; // Correction ici
      const userRoles: string[] = this.service.getUserRoles();
  
      if (!userRoles.some(role => expectedRoles.includes(role))) {
        this.router.navigate(['/unauthorized']);
        console.log(userRoles);
        
        return false;
      }
      return true;
    }
  
}
