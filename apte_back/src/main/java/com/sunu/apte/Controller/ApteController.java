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
                String result = apteService.executeScript(prompt -> {
                    try {
                        apteService.sendResponse(prompt);
                        return apteService.getPrompt();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return "Erreur: interruption lors de la lecture de l'entrée utilisateur.";
                    }
                });
                // You can log the result or handle it here if necessary
                System.out.println(result);
            } catch (IOException | InterruptedException e) {
                // Log exception
                e.printStackTrace();
            }
        }).start();
        return "Script en cours d'exécution";
    }
}

