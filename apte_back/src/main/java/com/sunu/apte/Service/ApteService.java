package com.sunu.apte.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import org.springframework.stereotype.Service;

@Service
public class ApteService {

    private String script;

    public void setScript(String script) {
        this.script = script;
    }

    public String executeScript(ScriptInputHandler inputHandler) throws IOException, InterruptedException {
        if (script == null || script.isEmpty()) {
            return "Le chemin du script n'a pas été spécifié.";
        }

        String command = "wsl " + script;

        Process process = Runtime.getRuntime().exec(command);

        // To handle user input prompts and responses
        BufferedReader scriptReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        OutputStreamWriter scriptWriter = new OutputStreamWriter(process.getOutputStream());

        StringBuilder output = new StringBuilder();
        String line;

        while ((line = scriptReader.readLine()) != null) {
            if (line.startsWith("Veuillez")) { // assuming the prompt starts with "Entrez"
                String userInput = inputHandler.getUserInput(line);
                scriptWriter.write(userInput + "\n");
                scriptWriter.flush();
            }
            output.append(line).append("\n");
        }

        // Capture any errors from the script
        while ((line = errorReader.readLine()) != null) {
            output.append("ERROR: ").append(line).append("\n");
        }

        int exitCode = process.waitFor();
        if (exitCode == 0) {
            return "Script exécuté avec succès\n" + output.toString();
        } else {
            return "Échec de l'exécution du script\n" + output.toString();
        }
    }

    public interface ScriptInputHandler {
        String getUserInput(String prompt);
    }
}

