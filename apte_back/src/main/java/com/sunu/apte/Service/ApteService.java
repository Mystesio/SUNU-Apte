package com.sunu.apte.Service;

import java.io.*;
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

        BufferedReader scriptReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        OutputStreamWriter scriptWriter = new OutputStreamWriter(process.getOutputStream());

        StringBuilder output = new StringBuilder();
        String line;

        while ((line = scriptReader.readLine()) != null) {
            output.append(line).append("\n");

            if (line.startsWith("read -p")) {
                String userInput = inputHandler.getUserInput(line);
                scriptWriter.write(userInput + "\n");
                scriptWriter.flush();
            }
        }

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

