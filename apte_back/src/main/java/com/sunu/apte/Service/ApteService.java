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

        // Chemin complet du script pour WSL
        String scriptDirectory = "/mnt/c/Users/william.amoussou/Documents/SUNU-APTE/apte_back/SHELL";
        

        // Commande pour exécuter le script avec WSL
        String[] command = {"wsl", "cd", scriptDirectory, "&&", "./" + script};

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        System.out.println("Executing command: " + String.join(" ", command));
        
        Process process = processBuilder.start();
        System.out.println("Process started: " + process.toString());

        try (BufferedReader scriptReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
             BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
             BufferedWriter scriptWriter = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {

            StringBuilder output = new StringBuilder();
            String line;

            while ((line = scriptReader.readLine()) != null) {
                output.append(line).append("\n");

                if (line.startsWith("read -p")) {
                    System.out.println("Prompt detected: " + line);
                    String userInput = inputHandler.getUserInput(line);
                    System.out.println("User input: " + userInput);
                    scriptWriter.write(userInput + "\n");
                    scriptWriter.flush();
                }
            }

            while ((line = errorReader.readLine()) != null) {
                output.append("ERROR: ").append(line).append("\n");
            }

            int exitCode = process.waitFor();
            System.out.println("Process exit code: " + exitCode);
            if (exitCode == 0) {
                return "Script exécuté avec succès\n" + output.toString();
            } else {
                return "Échec de l'exécution du script\n" + output.toString();
            }
        } catch (IOException | InterruptedException e) {
            process.destroy();
            System.out.println("Exception occurred: " + e.getMessage());
            throw e;
        }
    }

    public interface ScriptInputHandler {
        String getUserInput(String prompt);
    }
}

