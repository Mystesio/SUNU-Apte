package com.sunu.apte.Service;

import com.sunu.apte.Entity.Pays;
import com.sunu.apte.Repository.PaysRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaysService {

    @Autowired
    private PaysRepository paysRepository;
    
    @Autowired
    private ApteService apteService;

    public List<Pays> getAllPays() {
        // Retourne uniquement les instances qui ont un nom non nul
        return paysRepository.findAll().stream()
                .filter(pays -> pays.getName() != null)
                .collect(Collectors.toList());
    }

    public String listePays() throws IOException, InterruptedException {
        String script = "liste_pays.sh";
        String pays = "pays";  // Non utilisé pour ce script

        // Assurez-vous que executeScript est une méthode qui exécute le script et renvoie la sortie
        return apteService.executeScript(script, pays);
    }

    public List<Pays> updatePays() throws IOException, InterruptedException {
        // Exécuter le script liste_pays.sh
        listePays(); 
        // Récupérer la sortie du script
        String lastOutput = apteService.getLastOutputMessage(); 
       

        // Filtrer et récupérer la ligne contenant les instances SUNUPAC déployées
        String activeLine = lastOutput.lines()
                .filter(line -> line.startsWith("Liste des instances SUNUPAC déployés:"))
                .findFirst()
                .orElse("");



        List<String> activeCountries = List.of(activeLine.replace("Liste des instances SUNUPAC déployés:", "").trim().split(" "));
        List<Pays> countries = getAllPays();
        countries.forEach(country -> {
            String countryName = country.getName();
            if (countryName != null && activeCountries.contains(countryName.toUpperCase())) {
                country.setSunupacState(true);
            } else {
                country.setSunupacState(false);
            }
        });
        return countries;
    }
}


