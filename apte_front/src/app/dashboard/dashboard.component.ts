import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApteService } from 'app/service/apte.service';
import { UserInputDialogComponent } from 'app/user-input-dialog/user-input-dialog.component';

interface Country {
  name: string;
  sunulifeState: string;
  sunupacState: string;
  menuVisible: boolean;
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
    { name: 'Benin', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false },
    { name: 'Burkina', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false },
    { name: 'Congo', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false },
    { name: 'Mali', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false },
    { name: 'Mauritanie', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false },
    { name: 'Niger', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false },
    { name: 'RDC', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false },
    { name: 'Sénégal', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false },
    { name: 'Togo', sunulifeState: 'Actif', sunupacState: 'Actif', menuVisible: false }
  ];
  scriptOutput: string = '';
  isPromptPending: boolean = false;

  constructor(private apteService: ApteService, public dialog: MatDialog,private cdr: ChangeDetectorRef) { }

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

  executeScript(script: string): void {
    this.apteService.executeScript(script).subscribe({
      next: response => {
        this.scriptOutput = response;
        this.handlePrompts();
      },
      error: err => {
        this.scriptOutput = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
      }
    });
  }

  handlePrompts(): void {
    this.apteService.getPrompt().subscribe({
      next: prompt => {
        const dialogRef = this.dialog.open(UserInputDialogComponent, {
          width: '250px',
          data: { prompt: prompt }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.sendResponse(result);
          }
        });
      },
      error: err => {
        console.log('Error getting prompt:', err);
      }
    });
  }

  sendResponse(response: string): void {
    this.apteService.sendResponse(response).subscribe({
      next: () => {
        this.handlePrompts(); // Continue to handle the next prompt if any
      },
      error: err => {
        console.log('Error sending response:', err);
      }
    });
  }

  toggleMenu(country: Country): void {
    country.menuVisible = !country.menuVisible;
    this.cdr.detectChanges();
  }
  

  onLaunch(): void {
    this.executeScript('app/SHELL/launch.sh');
  }

  onLaunchAll(): void {
    this.executeScript('app/SHELL/launch-all.sh');
  }

  onMajAddonsSunupac(): void {
    this.executeScript('app/SHELL/maj_addons_sunupac.sh');
  }

  onMajDbSunupac(): void {
    this.executeScript('app/SHELL/maj_db_sunupac.sh');
  }

  onMajPortSunupac(): void {
    this.executeScript('app/SHELL/maj_port_sunupac.sh');
  }

  onSupprDbSunupac(): void {
    this.executeScript('app/SHELL/suppr_db_sunupac.sh');
  }

  onSupprAllDbSunupac(): void {
    this.executeScript('app/SHELL/suppr-alldb_sunupac.sh');
  }

  onMajDbSunulife(): void {
    this.executeScript('app/SHELL/maj_db_sunulife.sh');
  }

  onSupprDbSunulife(): void {
    this.executeScript('app/SHELL/suppr_db_sunulife.sh');
  }

  onPreprod(): void {
    this.executeScript('app/SHELL/preprod.sh');
  }
}
