import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SuperAdminService } from 'src/app/services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-sector',
  templateUrl: './list-sector.component.html',
  styleUrls: ['./list-sector.component.css']
})
export class ListSectorComponent implements OnInit {
  sectors: any[] = [];
  loading: boolean = true;
  hasSectors: boolean = false; 
  constructor(private sectorService: CommonService,private serv:SuperAdminService,private router: Router,private authService: AuthService) { }


  ngOnInit(): void {
    this.getAllSectors();
  }
  
  updateSector(SectorId: number) {
    this.router.navigate(['/home/superAdmin/updateSector', SectorId]);
  }
  getAllSectors(): void {
      this.sectorService.getAllSectors().subscribe(
          (response: any) => {
              this.sectors = response; // Store the retrieved sectors
              console.log(this.sectors);
              
              this.loading = false; // Set loading to false
              this.hasSectors = this.sectors.length > 0; // Check if there are any sectors
          },
          error => {
              if (error.status === 404) {
                  console.warn('No sectors found.');
                  this.sectors = []; // Set sectors to an empty array
                  this.hasSectors = false; // No sectors available
              } else {
                  console.error('Error fetching sectors:', error);
                  Swal.fire({
                      title: 'Error!',
                      text: 'There was an error fetching the sectors. Please try again later.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  });
              }
              this.loading = false; // Set loading to false even on error
          }
      );
  }

  deleteSector(sectorId: number): void {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.serv.deleteSector(sectorId).subscribe(
            response => {
              console.log('sector deleted successfully:', response);
              // Remove the deleted sector from the local array
              this.sectors = this.sectors.filter(sector => sector.id !== sectorId);
              Swal.fire('Deleted!', 'Your sector has been deleted.', 'success');
            },
            error => {
              console.error('Error deleting sector:', error);
              Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the sector. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          );
        }
      });
    }

}
