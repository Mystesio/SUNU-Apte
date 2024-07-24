package com.sunu.apte.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sunu.apte.Service.ApteService;

import java.io.IOException;

@RestController
@CrossOrigin
@RequestMapping("/shell")
public class ApteController {

    @Autowired
    private ApteService apteService;

    @PostMapping("/execute")
    public String executeScript(@RequestParam String script, @RequestParam String pays) {
        try {
            return apteService.executeScript(script, pays);
        } catch (IOException | InterruptedException e) {
            return "Erreur lors de l'exécution du script : " + e.getMessage();
        }
    }
    
    @GetMapping("/liste-pays")
    public String listePays() {
        try {
            return apteService.listePays();
        } catch (IOException | InterruptedException e) {
            return "Erreur lors de l'exécution du script liste_pays.sh : " + e.getMessage();
        }
    }
}
