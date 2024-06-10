package com.sunu.apte.Entity;

public class ScriptRequest {
    private String script;

    // Getters and Setters
    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getUserInput(String prompt) {
        // Implémentez la logique pour obtenir l'entrée utilisateur ici
        return prompt;
    }
}