package com.sunu.apte.Controller;

import com.sunu.apte.Entity.ScriptRequest;
import com.sunu.apte.Service.ApteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/shell")
public class ApteController {

    @Autowired
    private ApteService apteService;

    private final BlockingQueue<String> promptQueue = new LinkedBlockingQueue<>();
    private final BlockingQueue<String> responseQueue = new LinkedBlockingQueue<>();

    @PostMapping("/execute")
    public String handleRequest(@RequestBody ScriptRequest request, @RequestParam(required = false) String response) {
        // Handle script execution
        if (request.getScript() != null) {
            apteService.setScript(request.getScript());
            try {
                return apteService.executeScript(prompt -> {
                    try {
                        promptQueue.put(prompt);
                        return responseQueue.take();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return "Erreur: interruption lors de la lecture de l'entrée utilisateur.";
                    }
                });
            } catch (IOException | InterruptedException e) {
                return "Erreur lors de l'exécution du script: " + e.getMessage();
            }
        }

        // Handle user response
        if (response != null) {
            try {
                responseQueue.put(response);
                return "Réponse reçue";
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return "Erreur: interruption lors de l'envoi de la réponse utilisateur.";
            }
        }

        // Handle prompt request
        try {
            return promptQueue.take();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "Erreur: interruption lors de la récupération du prompt.";
        }
    }
}

