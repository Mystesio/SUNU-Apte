import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApteService } from 'app/service/apte.service';


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
  scriptOutput: string = '';
  isPromptPending: boolean = false;
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

  constructor(private apteService: ApteService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
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
    console.log(`Executing script: ${script}`);
    this.apteService.executeScript(script).subscribe({
      next: response => {
        console.log(`Script executed successfully: ${script}`);
        this.scriptOutput = response;
        this.handlePrompts();
      },
      error: err => {
        console.log(`Error executing script: ${script}`);
        this.scriptOutput = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
        this.cdr.detectChanges();
      }
    });
  }

  handlePrompts(): void {
    this.apteService.getPrompt().subscribe({
      next: prompt => {
        if (prompt) {
          const result = window.prompt(prompt, '');
          if (result !== null) {
            this.sendResponse(result);
          }
        }
        this.cdr.detectChanges();
      },
      error: err => {
        console.log('Error getting prompt:', err);
        this.cdr.detectChanges();
      }
    });
  }

  sendResponse(response: string): void {
    this.apteService.sendResponse(response).subscribe({
      next: () => {
        this.handlePrompts();
        this.cdr.detectChanges();
      },
      error: err => {
        console.log('Error sending response:', err);
        this.cdr.detectChanges();
      }
    });
  }

  toggleMenu(country: Country): void {
    country.menuVisible = !country.menuVisible;
    this.cdr.detectChanges();
  }

  onLaunch(countryName: string): void {
    console.log(`Sauvegarde de SUNUPAC ${countryName}`);
    this.addSauvegarde(`Sauvegarde de SUNUPAC ${countryName}`);
    this.executeScript('launch.sh');
  }

  onLaunchAll(): void {
    console.log(`Sauvegarde des environnements Sunupac`);
    this.addSauvegarde(`Sauvegarde des environnements SUNUPAC`);
    this.executeScript('launch-all.sh');
  }

  onMajAddonsSunupac(countryName: string): void {
    console.log(`Mise à jour des addons de Sunupac pour ${countryName}...`);
    this.addActivity(`Mise à jour des addons de SUNUPAC ${countryName}`);
    this.executeScript('maj_addons_sunupac.sh');
  }

  onMajDbSunupac(countryName: string): void {
    console.log(`Mise à jour de la base de données Sunupac pour ${countryName}...`);
    this.addActivity(`Mise à jour de la base de données de SUNUPAC ${countryName}`);
    this.executeScript('maj_db_sunupac.sh');
  }

  onMajPortSunupac(countryName: string): void {
    console.log(`Mise à jour du port Sunupac pour ${countryName}...`);
    this.addActivity(`Mise à jour du port de SUNUPAC ${countryName}`);
    this.executeScript('maj_port_sunupac.sh');
  }

  onMajDbSunulife(countryName: string): void {
    console.log(`Mise à jour de la base de données Sunulife pour ${countryName}...`);
    this.addActivity(`Mise à jour de la base de données de SUNULIFE ${countryName}`);
    this.executeScript('maj_db_sunulife.sh');
  }

  onPreprod(countryName: string): void {
    console.log(`Envoi en pré-production pour ${countryName}...`);
    this.addActivity(`Envoi en pré-production pour ${countryName}`);
    this.executeScript('preprod.sh');
  }
}
