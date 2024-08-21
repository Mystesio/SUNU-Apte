package com.sunu.apte.Controller;

import com.sunu.apte.DTO.ScriptDto;
import com.sunu.apte.Service.ApteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/shell")
public class ApteController {

    @Autowired
    private ApteService apteService;

    @PostMapping("/execute")
    public Map<String, String> executeScript(@RequestBody ScriptDto params) {
        Map<String, String> response = new HashMap<>();
        String script = params.getScript();
        String pays = params.getPays();

        try {
            // Exécuter le script et obtenir le message filtré immédiatement
            String filteredOutput = apteService.executeScript(script, pays);
            response.put("output", filteredOutput);
        } catch (IOException | InterruptedException e) {
            response.put("error", "Erreur lors de l'exécution du script : " + e.getMessage());
        }

        return response;
    }
}

