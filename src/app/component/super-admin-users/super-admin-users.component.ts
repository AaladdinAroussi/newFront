import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatService } from 'src/app/services/candidat.service';
import { CommonAdminService } from 'src/app/services/common-admin.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-super-admin-users',
  templateUrl: './super-admin-users.component.html',
  styleUrls: ['./super-admin-users.component.css']
})
export class SuperAdminUsersComponent implements OnInit {
  users: any[] = []; // Liste combinée des candidats et admins
  errorMessage: string = '';

  constructor(
    private superadminService: SuperAdminService,
    private authService: AuthService,
    private commonAdminService: CommonAdminService,
    private router: Router,
    protected adminService: AdminService,
    protected candidatService: CandidatService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.reloadUsers(); // Charger les utilisateurs dès l'initialisation

  }

  reloadUsers(): void {
    console.log("Reloading users..."); // Vérifier si cette fonction est bien appelée
    this.users = []; // Réinitialisation de la liste avant rechargement
    this.loadCandidats();
    this.loadAdmins();
    
  }

  loadCandidats(): void {
    this.superadminService.getAllCandidats().subscribe(
      (candidatsResponse: any) => {
        const candidats = candidatsResponse.candidats || [];
        this.addUsersWithRole(candidats, 'candidate');
        console.log("candidates",this.users);

      },
      (error: any) => {
        this.errorMessage = error.message || 'An error occurred while fetching candidates.';
      }
    );
  }

  loadAdmins(): void {
    this.superadminService.getAllAdmins().subscribe(
      (adminsResponse: any) => {
        const admins = adminsResponse.admins || [];
        this.addUsersWithRole(admins, 'admin');
      },
      (error: any) => {
        this.errorMessage = error.message || 'An error occurred while fetching admins.';
      }
    );
  }

  addUsersWithRole(users: any[], role: string): void {
    const usersWithRole = users.map(user => ({
      ...user,
      role: role
    }));

    this.users = [...this.users, ...usersWithRole];
    this.cdRef.detectChanges(); // Mise à jour de l'affichage
  }

  blockUser(userId: number): void {

    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to block this user!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, block!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('User confirmed blocking, calling API...'); // 🔍 Vérifier si Swal fonctionne

            this.superadminService.blockUser(userId).subscribe(
                response => {
                    console.log('API Response:', response); // 🔍 Vérifier si l'API répond
                    this.reloadUsers(); // ✅ Recharger après le blocage

                    setTimeout(() => {
                        console.log('User list reloaded successfully');
                    }, 1000);
                },
                (error: any) => {
                    console.error('Error blocking user:', error); // 🔴 Vérifier si une erreur survient
                    this.errorMessage = error.message || 'An error occurred while blocking the user.';
                }
            );
        }
    });
}

unblockUser(userId: number): void {

  Swal.fire({
    title: 'Are you sure?',
    text: "You are about to unblock this user!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, unblock!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('User confirmed unblocking, calling API...'); // 🔍 Vérifier si Swal fonctionne

      this.superadminService.unblockUser(userId).subscribe(
        response => {
          console.log('API Response:', response); // 🔍 Vérifier si l'API répond
          this.reloadUsers(); // ✅ Recharger après le déblocage

          setTimeout(() => {
            console.log('User list reloaded successfully');
          }, 1000);
        },
        (error: any) => {
          console.error('Error unblocking user:', error); // 🔴 Vérifier si une erreur survient
          this.errorMessage = error.message || 'An error occurred while unblocking the user.';
        }
      );
    }
  });
}


  viewUser(user: any): void {
    console.log('Viewing user:', user);
  }


  

  deleteUser(userId: number, userRole: string): void {
    console.log('Attempting to delete user with ID:', userId, 'Role:', userRole);

    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('User confirmed deletion');

        // Suppression basée sur le rôle de l'utilisateur
        if (userRole === 'admin') {
          this.commonAdminService.deleteAdmin(userId).subscribe(
            response => {
              console.log('Admin deleted successfully:', response);
              this.reloadUsers(); // Recharger la liste après suppression
            },
            (error: any) => {
              console.error('Error deleting admin:', error);
              this.errorMessage = error.message || 'An error occurred while deleting the admin.';
            }
          );
        } else if (userRole === 'candidate') {
          this.candidatService.deleteCandidat(userId).subscribe(
            response => {
              console.log('Candidat deleted successfully:', response);
              this.reloadUsers(); // Recharger la liste après suppression
            },
            (error: any) => {
              console.error('Error deleting candidat:', error);
              this.errorMessage = error.message || 'An error occurred while deleting the candidat.';
            }
          );
        }
      }
    });
}

}
