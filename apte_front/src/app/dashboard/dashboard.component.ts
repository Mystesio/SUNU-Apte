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

  onLaunch(): void {
    console.log('Launching environment...');
    this.executeScript('launch.sh');
  }

  onLaunchAll(): void {
    console.log('Launching all environments...');
    this.executeScript('launch-all.sh');
  }

  onMajAddonsSunupac(): void {
    console.log('Updating Sunupac addons...');
    this.executeScript('maj_addons_sunupac.sh');
  }

  onMajDbSunupac(): void {
    console.log('Updating Sunupac database...');
    this.executeScript('maj_db_sunupac.sh');
  }

  onMajPortSunupac(): void {
    console.log('Updating Sunupac port...');
    this.executeScript('maj_port_sunupac.sh');
  }

  onSupprDbSunupac(): void {
    console.log('Deleting Sunupac database...');
    this.executeScript('suppr_db_sunupac.sh');
  }

  onSupprAllDbSunupac(): void {
    console.log('Deleting all Sunupac databases...');
    this.executeScript('suppr-alldb_sunupac.sh');
  }

  onMajDbSunulife(): void {
    console.log('Updating Sunulife database...');
    this.executeScript('maj_db_sunulife.sh');
  }

  onSupprDbSunulife(): void {
    console.log('Deleting Sunulife database...');
    this.executeScript('suppr_db_sunulife.sh');
  }

  onPreprod(): void {
    console.log('Sending to pre-production...');
    this.executeScript('preprod.sh');
  }
}
