package com.sunu.apte.Service;

import com.jcraft.jsch.*;
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

        String username = "sunupac";
        String host = "10.12.13.9";
        int port = 22;
        String password = "sunupac";

        JSch jsch = new JSch();
        Session session = null;
        ChannelExec channel = null;

        StringBuilder output = new StringBuilder();
        int promptCount = 0; // Compteur pour les lignes qui commencent par read -r ou read -p

        try {
            // Supprimer la clé d'hôte existante
            Process process = Runtime.getRuntime().exec("ssh-keygen -R " + host);
            process.waitFor();

            output.append("Clé d'hôte supprimée pour ").append(host).append("\n");

            session = jsch.getSession(username, host, port);
            session.setPassword(password);

            // Ajouter ce bloc pour désactiver la vérification de la clé d'hôte
            java.util.Properties config = new java.util.Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);

            session.connect();

            if (session.isConnected()) {
                output.append("Connexion SSH établie avec ").append(host).append("\n");
            } else {
                return "Échec de l'établissement de la connexion SSH avec " + host + "\n";
            }

            // Exécuter les commandes supplémentaires via le shell
            channel = (ChannelExec) session.openChannel("exec");
            String sshCommand = "echo " + password + " | sudo -S su -c 'cd script && ./" + script + "'";
            channel.setCommand(sshCommand);
            channel.setErrStream(System.err);

            InputStream in = channel.getInputStream();
            OutputStream out = channel.getOutputStream();

            channel.connect();

            if (channel.isConnected()) {
                output.append("Canal SSH connecté et commande exécutée: ").append(sshCommand).append("\n");
            } else {
                return "Échec de l'établissement du canal SSH pour la commande " + sshCommand + "\n";
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out));

            writer.write(password + "\n");
            writer.flush();

            String line;
            StringBuilder errorOutput = new StringBuilder();

            output.append("Début de la lecture des lignes du script\n");
            while ((line = reader.readLine()) != null) {
                output.append("Ligne lue: ").append(line).append("\n");

                // Vérification des motifs généraux de l'invite
                if (line.trim().startsWith("read -p") || line.trim().startsWith("read -r")) {
                    output.append("Prompt trouvé dans la ligne: ").append(line).append("\n");
                    promptQueue.put(line);
                    String userInput = responseQueue.take();
                    writer.write(userInput + "\n");
                    writer.flush();
                    promptCount++; // Incrémenter le compteur pour chaque ligne de prompt trouvée
                }
            }
            output.append("Fin de la lecture des lignes du script\n");
            output.append("Nombre total de prompts détectés: ").append(promptCount).append("\n");

            BufferedReader errReader = new BufferedReader(new InputStreamReader(channel.getErrStream()));
            while ((line = errReader.readLine()) != null) {
                errorOutput.append("Erreur: ").append(line).append("\n");
            }

            int exitCode = channel.getExitStatus();
            if (exitCode == 0) {
                return "Script exécuté avec succès\n" + output.toString();
            } else {
                return "Échec de l'exécution du script\n" + output.toString() + "\nErreur: " + errorOutput.toString();
            }
        } catch (JSchException e) {
            output.append("Erreur de connexion SSH : ").append(e.getMessage()).append("\n");
        } catch (IOException e) {
            output.append("Erreur d'IO : ").append(e.getMessage()).append("\n");
        } catch (InterruptedException e) {
            output.append("Erreur d'interruption : ").append(e.getMessage()).append("\n");
            Thread.currentThread().interrupt(); // Réinterrompt le thread courant
        } finally {
            if (channel != null && channel.isConnected()) {
                channel.disconnect();
                output.append("Canal SSH déconnecté\n");
            }
            if (session != null && session.isConnected()) {
                session.disconnect();
                output.append("Session SSH déconnectée\n");
            }
        }
        return output.toString();
    }

    public String getPrompt() throws InterruptedException {
        return promptQueue.take();
    }

    public void sendResponse(String response) throws InterruptedException {
        responseQueue.put(response);
    }

    public interface ScriptInputHandler {
        String getUserInput(String prompt);
    }
}

