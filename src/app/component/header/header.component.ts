import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,private authService: AuthService) {}


  ngOnInit(): void {
    this.isLoggedIn();
    this.isCandidat();
    this.isAdmin();
    this.isSuperAdmin();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  isAdmin(): boolean {
    const userConnect = localStorage.getItem("userconnect");
    if (userConnect) {
      const user = JSON.parse(userConnect);
      const roles = user.roles;
      return roles && roles.includes('ROLE_ADMIN');
    }
    return false;
  }
  isCandidat(): boolean {
    const userConnect = localStorage.getItem("userconnect");
    if (userConnect) {
      const user = JSON.parse(userConnect);
      const roles = user.roles;
      return roles && roles.includes('ROLE_CANDIDAT');
    }
    return false;
  }
  isSuperAdmin(): boolean {
    const userConnect = localStorage.getItem("userconnect");
    if (userConnect) {
      const user = JSON.parse(userConnect);
      const roles = user.roles;
      return roles && roles.includes('ROLE_SUPERADMIN');
    }
    return false;
  }

}
