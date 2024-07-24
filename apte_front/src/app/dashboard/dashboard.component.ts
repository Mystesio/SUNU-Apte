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
  countries: Country[] = [
    { name: 'Bénin', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Burkina', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Congo', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Mali', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Mauritanie', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Niger', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'RDC', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Sénégal', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Togo', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false }
  ];

  constructor(private apteService: ApteService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.updateErrors();
    this.updateCountryStates();
  }

  updateErrors(): void {
    this.errors = this.apteService.getErrors();
  }

  updateCountryStates(): void {
    this.apteService.getListePays().subscribe({
      next: response => {
        const lines = response.split('\n');
        const activeLine = lines.find(line => line.startsWith("Liste des instances SUNUPAC déployés:"));
        if (activeLine) {
          const activeCountries = activeLine.replace("Liste des instances SUNUPAC déployés:", "").trim().split(' ');
          this.countries.forEach(country => {
            if (activeCountries.includes(country.name.toUpperCase())) {
              country.sunupacState = 'Actif';
            } else {
              country.sunupacState = 'Inactif';
            }
          });
        } else {
          this.countries.forEach(country => {
            country.sunupacState = 'Inactif';
          });
        }
        this.cdr.detectChanges();
      },
      error: err => {
        this.errors.push(err);
        this.cdr.detectChanges();
      }
    });
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

  executeScript(script: string, pays: string): void {
    console.log(`Executing script: ${script} for country: ${pays}`);
    this.apteService.executeScript(script, pays).subscribe({
      next: response => {
        console.log(`Script executed successfully: ${script} for country: ${pays}`);
        this.scriptOutput = response;
      },
      error: err => {
        console.log(`Error executing script: ${script} for country: ${pays}`);
        this.scriptOutput = err;
        console.log(err);
        this.updateErrors();
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
    this.executeScript('launch.sh', countryName);
  }

  onLaunchAll(): void {
    console.log(`Sauvegarde des environnements Sunupac`);
    this.addSauvegarde(`Sauvegarde des environnements SUNUPAC`);
    this.countries.forEach(country => this.executeScript('launch-all.sh', country.name));
  }

  onMajAddonsSunupac(countryName: string): void {
    console.log(`Mise à jour des addons de Sunupac pour ${countryName}...`);
    this.addActivity(`Mise à jour des addons de SUNUPAC ${countryName}`);
    this.executeScript('maj_addons_sunupac.sh', countryName);
  }

  onMajDbSunupac(countryName: string): void {
    console.log(`Mise à jour de la base de données Sunupac pour ${countryName}...`);
    this.addActivity(`Mise à jour de la base de données de SUNUPAC ${countryName}`);
    this.executeScript('maj_db_sunupac.sh', countryName);
  }

  onMajDbSunulife(countryName: string): void {
    console.log(`Mise à jour de la base de données Sunulife pour ${countryName}...`);
    this.addActivity(`Mise à jour de la base de données de SUNULIFE ${countryName}`);
    this.executeScript('maj_db_sunulife.sh', countryName);
  }

  onPreprod(countryName: string): void {
    console.log(`Envoi en pré-production pour ${countryName}...`);
    this.addActivity(`Envoi en pré-production pour ${countryName}`);
    this.executeScript('preprod.sh', countryName);
  }
}
