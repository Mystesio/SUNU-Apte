package com.sunu.apte.Service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Service
public class ApteService {

    private String script;
    private final BlockingQueue<String> promptQueue = new LinkedBlockingQueue<>();
    private final BlockingQueue<String> responseQueue = new LinkedBlockingQueue<>();

    public void setScript(String script) {
        this.script = script;
    }

    public String executeScript(ScriptInputHandler inputHandler) throws IOException, InterruptedException {
        if (script == null || script.isEmpty()) {
            return "Le chemin du script n'a pas été spécifié.";
        }

        // Chemin complet du script pour WSL
        String scriptDirectory = "/mnt/c/Users/william.amoussou/Documents/SUNU-APTE/apte_back/SHELL/";
        
        // Commande pour exécuter le script avec WSL
        String[] command = {"wsl.exe", "-e", "bash", "-c", "cd " + scriptDirectory + " && ./" + script};

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true); // Combine les flux de sortie et d'erreur
        System.out.println("Executing command: " + String.join(" ", command));
        
        Process process = processBuilder.start();
        System.out.println("Process started: " + process.toString());
        
        
        
        try {
        	
        	BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
            
            System.out.println("Reader: " + reader);
            System.out.println("Writer: " + writer);

            StringBuilder output = new StringBuilder();
            String line;
            
            reader.readLine();
            System.out.println(line);
            
            
            while (line != null) {
            	
            	 System.out.println(line != null);
            	 
                System.out.println("Script output: " + line);  // Ajoutez ce journal
                output.append(line).append("\n");
                
                System.out.println(output);

                if (line.contains("read -p")) {
                    System.out.println("Prompt detected: " + line);
                    promptQueue.put(line);  // Ajoute le prompt à la file d'attente

                    String userInput = responseQueue.take();  // Attendre la réponse de l'utilisateur
                    System.out.println("User input: " + userInput);
                    writer.write(userInput + "\n");
                    writer.flush();
                }
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

    public String getPrompt() throws InterruptedException {
        return promptQueue.take();  // Récupère le prochain prompt
    }

    public void sendResponse(String response) throws InterruptedException {
        responseQueue.put(response);  // Envoie la réponse utilisateur
    }

    public interface ScriptInputHandler {
        String getUserInput(String prompt);
    }
}
