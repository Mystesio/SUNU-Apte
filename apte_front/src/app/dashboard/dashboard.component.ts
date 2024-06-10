import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApteService } from 'app/service/apte.service';
import { UserInputDialogComponent } from 'app/user-input-dialog/user-input-dialog.component';


interface Country {
  name: string;
  sunulifeState: string;
  sunupacState: string;

}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  errors: string[] = [];
  activities: string[] = [];
  sauvegardes: string[] = [];
  output: string = '';
  countries: Country[] = [
    { name: 'Benin', sunulifeState: 'Actif', sunupacState: 'Actif' },
    { name: 'Burkina', sunulifeState: 'Actif', sunupacState: 'Actif' },
    { name: 'Congo', sunulifeState: 'Actif', sunupacState: 'Actif'},
    { name: 'Mali', sunulifeState: 'Actif', sunupacState: 'Actif'},
    { name: 'Mauritanie', sunulifeState: 'Actif', sunupacState: 'Actif' },
    { name: 'Niger', sunulifeState: 'Actif', sunupacState: 'Actif'},
    { name: 'RDC', sunulifeState: 'Actif', sunupacState: 'Actif' },
    { name: 'Sénégal', sunulifeState: 'Actif', sunupacState: 'Actif' },
    { name: 'Togo', sunulifeState: 'Actif', sunupacState: 'Actif' }
  ];

  constructor(private apteService: ApteService, private dialog: MatDialog) { 
    this.apteService.userInput$.subscribe(prompt => {
      const dialogRef = this.dialog.open(UserInputDialogComponent, {
        data: { prompt }
      });

      dialogRef.afterClosed().subscribe(userInput => {
        if (userInput !== undefined) {
          this.apteService.sendUserInput(userInput);
        }
      });
    });
  }

  

  ngOnInit() {
    this.updateErrors();
  }

  updateErrors(): void {
    this.errors = this.apteService.getErrors();
  }

  addActivity(action: string): void {
    this.activities.unshift(action);
    if (this.activities.length > 10) {
      this.activities.pop();
    }
  }

  addSauvegarde(sauvegarde: string): void {
    this.sauvegardes.unshift(sauvegarde);
    if (this.sauvegardes.length > 10) {
      this.sauvegardes.pop();
    }
  }



  onLaunch(): void {
    this.apteService.executeScript('app/SHELL/launch.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }
  
 

  onLaunchAll(): void {
      this.apteService.executeScript('app/SHELL/launch-all.sh').subscribe({
        next: response => {
          this.output = response;
          console.log(response);
          this.addActivity('Démarrage d\'un environnement SUNUPAC');
          this.updateErrors();
        },
        error: err => {
          this.output = 'Error: ' + err;
          console.log(err);
          this.updateErrors();
        }
      });
    }
  

  onMajAddonsSunupac(): void {
    this.apteService.executeScript('app/SHELL/maj_addons_sunupac.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

  onMajDbSunupac(): void {
    this.apteService.executeScript('app/SHELL/maj_db_sunupac.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

  onMajPortSunupac(): void {
    this.apteService.executeScript('app/SHELL/maj_port_sunupac.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

  onSupprDbSunupac(): void {
    this.apteService.executeScript('app/SHELL/suppr_db_sunupac.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

  onSupprAllDbSunupac(): void {
    this.apteService.executeScript('app/SHELL/suppr-alldb_sunupac.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

  onMajDbSunulife(): void {
    this.apteService.executeScript('app/SHELL/maj_db_sunulife.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

  onSupprDbSunulife(): void {
    this.apteService.executeScript('app/SHELL/suppr_db_sunulife.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

  onPreprod(): void {
    this.apteService.executeScript('app/SHELL/preprod.sh').subscribe({
      next: response => {
        this.output = response;
        console.log(response);
        this.addActivity('Démarrage d\'un environnement SUNUPAC');
        this.updateErrors();
      },
      error: err => {
        this.output = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

 
}
