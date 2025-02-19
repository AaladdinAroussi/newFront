import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatService } from 'src/app/services/candidat.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidate-add-details',
  templateUrl: './candidate-add-details.component.html',
  styleUrls: ['./candidate-add-details.component.css']
})
export class CandidateAddDetailsComponent implements OnInit {
  sectors: any[] = [];
  hasSectors: boolean = false; 
  experienceLabel: string = '';
  form!: FormGroup;
  userData: any | null = null;
  constructor(private sectorService: CommonService,private router : Router,private authService: AuthService,private candidatService: CandidatService, private fb: FormBuilder) {
    this.form = this.fb.group({
      sector: ['', Validators.required], // Ajoutez le contrôle pour le secteur
      experience: ['-1', [Validators.required, Validators.min(0)]] // Ajoutez le contrôle pour l'expérience
    });
   }

  ngOnInit(): void {
    this.getAllSectors();
  }
getAllSectors(): void {
      this.sectorService.getAllSectors().subscribe(
          (response: any) => {
              this.sectors = response; 
              console.log("sectors :",this.sectors);
              
              this.hasSectors = this.sectors.length > 0;
          },
          error => {
              if (error.status === 404) {
                  console.warn('No sectors found.');
                  this.sectors = [];
                  this.hasSectors = false;
              } else {
                  console.error('Error fetching sectors:', error);
                  Swal.fire({
                      title: 'Error!',
                      text: 'There was an error fetching the sectors. Please try again later.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  });
              }
          }
      );
  }
  onSubmit(): void {
    if (this.form.valid && this.form.get('experience')?.value !== '-1') {
      // Récupérez les données du localStorage
      const storedData = localStorage.getItem('candidateData');
      if (storedData) {
        const formData = JSON.parse(storedData); // Convertir la chaîne JSON en objet
  
        // Préparez les données à envoyer pour l'inscription
        const sectorId = this.form.get('sector')?.value; // Récupérez l'ID du secteur
        const experience = this.form.get('experience')?.value; // Récupérez l'expérience
  
        // Rassemblez les données d'inscription
        const updatedData = {
          sector: sectorId, // Envoyez uniquement l'ID du secteur
          experience: experience,
          fullName: formData.fullName, // Récupérez le nom du candidat
          phone: formData.phone, // Récupérez le téléphone
          email: formData.email, // Récupérez l'email
          password: formData.password // Récupérez le mot de passe
        };
  
        // Appelez la méthode signupCandidat
        this.authService.signupCandidat(updatedData).subscribe(
          response => {
            console.log('Candidate signed up successfully:', response);
            Swal.fire({
              title: 'Success!',
              text: 'Candidate signed up successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.router.navigateByUrl('/login'); // Redirigez vers la page de connexion après l'inscription
          },
          error => {
            console.error('Error signing up candidate:', error);
            if (error.error && error.error.message) {
              Swal.fire({
                title: 'Error!',
                text: error.error.message, // Affiche le message d'erreur spécifique
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'There was an error signing up the candidate.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        );
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'No candidate data found in localStorage.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      // Marquez tous les contrôles comme touchés pour afficher les messages d'erreur
      this.form.markAllAsTouched();
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid experience.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
