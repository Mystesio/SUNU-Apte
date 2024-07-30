import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApteService } from 'app/service/apte.service'; // Assurez-vous que le chemin est correct

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

  bugs: string[] = [];
  activities: string[] = [];
  sauvegardes: string[] = [];
  scriptOutput: string = '';
  countries: Country[] = [
    { name: 'Benin', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Burkina', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Congo', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Mali', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Mauritanie', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Niger', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'RDC', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Senegal', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false },
    { name: 'Togo', sunulifeState: 'Inactif', sunupacState: 'Inactif', menuVisible: false }
  ];

  constructor(private apteService: ApteService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('ngOnInit - initializing component');
    this.updateBugs();
    this.updateCountryStates();
  }

  updateBugs(): void {
    console.log('updateBugs - updating bugs');
    this.bugs = this.apteService.getBugs();
    console.log('updateBugs - bugs:', this.bugs);
    this.cdr.detectChanges();
  }

  updateCountryStates(): void {
    console.log('updateCountryStates - fetching data');
    this.apteService.getListePays().subscribe({
      next: response => {
        console.log('updateCountryStates - response:', response);
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
        console.log('updateCountryStates - countries:', this.countries);
        this.cdr.detectChanges();
      },
      error: err => {
        console.log('updateCountryStates - error:', err);
        this.bugs.push(err);
        this.updateBugs();
      }
    });
  }
  
  addActivity(action: string): void {
    this.activities.unshift(action);
    if (this.activities.length > 10) {
      this.activities.pop();
    }
    console.log('addActivity - activities:', this.activities);
    this.cdr.detectChanges();
  }

  addSauvegarde(sauvegarde: string): void {
    this.sauvegardes.unshift(sauvegarde);
    if (this.sauvegardes.length > 10) {
      this.sauvegardes.pop();
    }
    console.log('addSauvegarde - sauvegardes:', this.sauvegardes);
    this.cdr.detectChanges();
  }

  executeScript(script: string, pays: string): void {
    console.log(`Executing script: ${script} for country: ${pays}`);
    this.apteService.executeScript(script, pays).subscribe({
      next: response => {
        console.log(`Script executed successfully: ${script} for country: ${pays}`);
        this.scriptOutput = response;
        this.updateBugs();
        console.log('executeScript - scriptOutput:', this.scriptOutput);
      },
      error: err => {
        console.log(`Error executing script: ${script} for country: ${pays}`);
        this.scriptOutput = err;
        this.updateBugs();
        console.log('executeScript - error:', err);
      }
    });
  }

  toggleMenu(country: Country): void {
    country.menuVisible = !country.menuVisible;
    console.log('toggleMenu - country:', country);
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
    this.countries.forEach(country => this.executeScript('launch-all.sh', 'pays'));
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
