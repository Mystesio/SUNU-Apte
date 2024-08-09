package com.sunu.apte.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sunu.apte.Service.ApteService;

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
    public String executeScript(@RequestBody Map<String, String> params) {
        String script = params.get("script");
        String pays = params.get("pays");
        try {
            return apteService.executeScript(script, pays);
        } catch (IOException | InterruptedException e) {
            return "Erreur lors de l'exécution du script : " + e.getMessage();
        }
    }

    @GetMapping("/report")
    public Map<String, String> getFilteredOutputMessage() {
        String message = apteService.getFilteredOutputMessage();
        Map<String, String> response = new HashMap<>();
        if (message != null && !message.isEmpty()) {
            response.put("message", message);
        } else {
            response.put("message", "aucun message disponible");
        }
        return response;
    }



 
}
