import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pays } from 'app/model/pays.model';
import { ApteService } from 'app/service/apte.service';
import { PaysService } from 'app/service/pays.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  activities: string[] = [];
  sauvegardes: string[] = [];
  paysList: Pays[] = []; // Tableau pour stocker la liste des pays
  reportScript: string[] = []; // Tableau pour stocker les 10 dernières réponses


  constructor(private apteService: ApteService, private paysService: PaysService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('ngOnInit - initializing component');
    this.loadPaysList(); // Charger la liste des pays au démarrage

  }

 // Méthode pour charger la liste des pays
loadPaysList(): void {
  this.paysService.getListePays().subscribe({
    next: pays => {
      this.paysList = pays.map(p => ({ ...p, menuVisible: false }));
      console.log('Pays list loaded:', this.paysList);
      this.cdr.detectChanges(); // Détecter les changements
 
    },
    error: err => {
      console.log('Error loading pays list:', err);
    }
  });
}


  toggleMenu(pays: Pays): void {
    pays.menuVisible = !pays.menuVisible;
    this.cdr.detectChanges(); // Détecter les changements
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
    this.apteService.executeScript(script, pays, { observe: 'response' }).subscribe({
      next: response => {
        console.log('Response Status:', response.status);
        console.log('Response Body:', response.body);
        if (response.status === 200) {
          console.log(`Script executed successfully: ${script} for country: ${pays}`);
        } else {
          console.log(`Unexpected response status: ${response.status}`);
        }
      },
      error: err => {
        console.log(`Error executing script: ${script} for country: ${pays}`);
        console.log('executeScript - error:', err);
      }
    });
  }
  
  updateReportScript(): void {
    console.log('updateReportScript called');
  
    this.apteService.report().subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Response reçu:', response);
  
        const message = response.body?.message; // Extraire le message du JSON
  
        if (message) {
          this.reportScript.unshift(message);
          if (this.reportScript.length > 10) {
            this.reportScript.pop();
          }
        } else {
          console.error('Le message reçu est vide ou null');
        }
  
        console.log('reportScript updated:', this.reportScript);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching report:', err);
      }
    });
  }
  
  
  


  onLaunch(countryName: string): void {
    console.log(`Sauvegarde de SUNUPAC ${countryName}`);
    this.addSauvegarde(`Sauvegarde de SUNUPAC ${countryName}`);
    this.executeScript('launch.sh', countryName);
    this.updateReportScript();
  }

  onLaunchAll(): void {
    console.log(`Sauvegarde des environnements Sunupac`);
    this.addSauvegarde(`Sauvegarde des environnements SUNUPAC`);
    this.executeScript('launch-all.sh', 'pays');
    this.updateReportScript();
  }

  onMajAddonsSunupac(countryName: string): void {
    console.log(`Mise à jour des addons de Sunupac pour ${countryName}...`);
    this.addActivity(`Mise à jour des addons de SUNUPAC ${countryName}`);
    this.executeScript('maj_addons_sunupac.sh', countryName);
    this.updateReportScript();
  }

  onMajDbSunupac(countryName: string): void {
    console.log(`Mise à jour de la base de données Sunupac pour ${countryName}...`);
    this.addActivity(`Mise à jour de la base de données de SUNUPAC ${countryName}`);
    this.executeScript('maj_db_sunupac.sh', countryName);
    this.updateReportScript();
  }

  onMajDbSunulife(countryName: string): void {
    console.log(`Mise à jour de la base de données Sunulife pour ${countryName}...`);
    this.addActivity(`Mise à jour de la base de données de SUNULIFE ${countryName}`);
    this.executeScript('maj_db_sunulife.sh', countryName);
    this.updateReportScript();
  }

  onPreprod(countryName: string): void {
    console.log(`Envoi en pré-production pour ${countryName}...`);
    this.addActivity(`Envoi en pré-production pour ${countryName}`);
    this.executeScript('preprod.sh', countryName);
    this.updateReportScript();
  }
}
