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

  constructor(private apteService: ApteService, private cdr: ChangeDetectorRef) { }

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
    console.log(`Executing script: ${script}`);
    this.apteService.executeScript(script).subscribe({
      next: response => {
        console.log(`Script executed successfully: ${script}`);
        this.scriptOutput = response;
        this.cdr.detectChanges(); // Detect changes
        this.handlePrompts();  // Start handling prompts immediately after script execution
      },
      error: err => {
        console.log(`Error executing script: ${script}`);
        this.scriptOutput = 'Error: ' + err;
        console.log(err);
        this.updateErrors();
        this.cdr.detectChanges(); // Detect changes
      }
    });
  }

  handlePrompts(): void {
    this.apteService.getPrompt().subscribe({
      next: prompt => {
        const result = window.prompt(prompt, '');
        if (result !== null) {
          this.sendResponse(result);
        }
        this.cdr.detectChanges(); // Detect changes
      },
      error: err => {
        console.log('Error getting prompt:', err);
        this.cdr.detectChanges(); // Detect changes
      }
    });
  }

  sendResponse(response: string): void {
    this.apteService.sendResponse(response).subscribe({
      next: () => {
        this.handlePrompts(); // Continue to handle the next prompt if any
        this.cdr.detectChanges(); // Detect changes
      },
      error: err => {
        console.log('Error sending response:', err);
        this.cdr.detectChanges(); // Detect changes
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

  onLaunchAll(countryName: string): void {
    console.log(`Sauvegarde des environnements Sunupac`);
    this.addSauvegarde(`Sauvegarde des environnements SUNUPAC`);
    this.executeScript('launch-all.sh');
  }

  onMajAddonsSunupac(countryName: string): void {
    console.log(`Updating Sunupac addons for ${countryName}...`);
    this.addActivity(`Mise à jour des addons de  SUNUPAC ${countryName}`);
    this.executeScript('maj_addons_sunupac.sh');
  }

  onMajDbSunupac(countryName: string): void {
    console.log(`Mise à jour de la base de donnée de  sunupac ${countryName}`);
    this.addActivity(`Mise à jour de la base de donnée de SUNUPAC ${countryName}`);
    this.executeScript('maj_db_sunupac.sh');
  }

  onMajPortSunupac(countryName: string): void {
    console.log(`Updating Sunupac port for ${countryName}...`);
    this.addActivity(`Mise à jour du port de SUNUPAC ${countryName}`);
    this.executeScript('maj_port_sunupac.sh');
  }


  onMajDbSunulife(countryName: string): void {
    console.log(`Updating Sunulife database for ${countryName}...`);
    this.addActivity(`Mise à jour de la base de données de SUNULIFE ${countryName}`);
    this.executeScript('maj_db_sunulife.sh');
  }


  onPreprod(countryName: string): void {
    console.log(`Sending to pre-production for ${countryName}...`);
    this.addActivity(`Envoi en pre-production pour ${countryName}`);
    this.executeScript('preprod.sh');
  }
}
