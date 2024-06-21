package com.sunu.apte.Controller;

import com.sunu.apte.Entity.ScriptRequest;
import com.sunu.apte.Service.ApteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/shell")
public class ApteController {

    @Autowired
    private ApteService apteService;

    @GetMapping("/prompt")
    public String getPrompt() {
        try {
            return apteService.getPrompt();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "Erreur: interruption lors de la récupération du prompt.";
        }
    }

    @PostMapping("/script")
    public String executeScript(@RequestBody ScriptRequest request) {
        if (request.getScript() == null || request.getScript().isEmpty()) {
            return "Erreur: Le script n'a pas été spécifié.";
        }

        apteService.setScript(request.getScript());
        new Thread(() -> {
            try {
                apteService.executeScript(prompt -> {
                    try {
                        apteService.sendResponse(prompt);
                        return apteService.getPrompt();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return "Erreur: interruption lors de la lecture de l'entrée utilisateur.";
                    }
                });
            } catch (IOException | InterruptedException e) {
                // Log exception
            }
        }).start();
        return "Script en cours d'exécution";
    }
}


