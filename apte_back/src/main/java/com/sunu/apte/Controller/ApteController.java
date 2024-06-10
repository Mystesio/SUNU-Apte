package com.sunu.apte.Controller;

import com.sunu.apte.Entity.ScriptRequest;
import com.sunu.apte.Service.ApteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
@RequestMapping("/shell")
public class ApteController {

    @Autowired
    private ApteService apteService;

    @PostMapping("/execute")
    public String executeScript(@RequestBody ScriptRequest request) {
        try {
            return apteService.executeScript(prompt -> {
                // Send prompt to frontend and wait for response
                // This can be implemented using WebSockets or long-polling in a real-time application
                return request.getUserInput(prompt);
            });
        } catch (IOException | InterruptedException e) {
            return "Erreur lors de l'exécution du script: " + e.getMessage();
        }
    }

    

    
}


