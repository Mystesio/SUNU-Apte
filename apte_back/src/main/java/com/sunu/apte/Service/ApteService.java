package com.sunu.apte.Service;

import com.jcraft.jsch.*;
import org.springframework.stereotype.Service;
import java.io.*;

@Service
public class ApteService {

    private String lastOutputMessage = "";
    private String filteredOutputMessage = "";

    public String executeScript(String script, String pays) throws IOException, InterruptedException {
        if (script == null || script.isEmpty()) {
            lastOutputMessage = "Le chemin du script n'a pas été spécifié.";
            return lastOutputMessage;
        }
        if (pays == null || pays.isEmpty()) {
            lastOutputMessage = "Le pays n'a pas été spécifié.";
            return lastOutputMessage;
        }

        String username = "sunupac";
        String host = "10.12.13.9";
        int port = 22;
        String password = "sunupac";

        JSch jsch = new JSch();
        Session session = null;
        ChannelExec channel = null;

        StringBuilder output = new StringBuilder();
        StringBuilder filteredOutput = new StringBuilder();

        try {
            // Supprimer la clé d'hôte existante
            Process process = Runtime.getRuntime().exec("ssh-keygen -R " + host);
            process.waitFor();

            output.append("Clé d'hôte supprimée pour ").append(host).append("\n");

            session = jsch.getSession(username, host, port);
            session.setPassword(password);

            java.util.Properties config = new java.util.Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);

            session.connect();

            if (session.isConnected()) {
                output.append("Connexion SSH établie avec ").append(host).append("\n");
            } else {
                lastOutputMessage = "Échec de l'établissement de la connexion SSH avec " + host + "\n";
                return lastOutputMessage;
            }

            channel = (ChannelExec) session.openChannel("exec");
            String sshCommand = "echo " + password + " | sudo -S su -c 'cd script/" + pays + " && ./" + script + "'";
            channel.setCommand(sshCommand);
            channel.setErrStream(System.err);
            InputStream in = channel.getInputStream();
            OutputStream out = channel.getOutputStream();

            channel.connect();

            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out));

            writer.write(password + "\n");
            writer.flush();

            String line;
            StringBuilder errorOutput = new StringBuilder();

            // Lire le flux de sortie jusqu'à la fin de l'exécution du script
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
                if (line.startsWith("Echec") || 
                    line.startsWith("Il y a") || 
                    line.startsWith("Webservice Introuvable") || 
                    line.startsWith("Erreur") || 
                    line.startsWith("Addons Introuvable") || 
                    line.startsWith("backup introuvable") || 
                    line.startsWith("erreur")) {
                    filteredOutput.append(line).append("\n");
                }
            }

            // Lire le flux d'erreur jusqu'à la fin de l'exécution du script
            BufferedReader errReader = new BufferedReader(new InputStreamReader(channel.getErrStream()));
            while ((line = errReader.readLine()) != null) {
                errorOutput.append(line).append("\n");
            }

            int exitCode = channel.getExitStatus();
            if (exitCode == 0) {
                output.append("Script exécuté avec succès\n");
            } else {
                output.append("Échec de l'exécution du script\n");
            }

        } catch (JSchException e) {
            lastOutputMessage = "Erreur de connexion SSH : " + e.getMessage() + "\n";
        } catch (IOException e) {
            lastOutputMessage = "Erreur d'IO : " + e.getMessage() + "\n";
        } catch (InterruptedException e) {
            lastOutputMessage = "Erreur d'interruption : " + e.getMessage() + "\n";
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

        lastOutputMessage = output.toString(); // Mettre à jour le message de sortie du script
        filteredOutputMessage = filterOutputMessage(lastOutputMessage); // Mettre à jour le message filtré
        return filteredOutputMessage; // Retourner le message filtré
    }

    public String getLastOutputMessage() {
        return lastOutputMessage;
    }

    public String getFilteredOutputMessage() {
        return filteredOutputMessage;
    }

    private String filterOutputMessage(String message) {
        StringBuilder filteredOutput = new StringBuilder();
        for (String line : message.split("\n")) {
            if (line.startsWith("Echec") || 
                line.startsWith("Il y a") || 	
                line.startsWith("Webservice Introuvable") || 
                line.startsWith("Erreur") || 
                line.startsWith("Addons Introuvable") || 
                line.startsWith("backup introuvable") || 
                line.startsWith("erreur")) {
                filteredOutput.append(line).append("\n");
            }
        }
        return filteredOutput.toString();
    }
}
