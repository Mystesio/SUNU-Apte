package com.sunu.apte.Service;

import com.jcraft.jsch.*;
import org.springframework.stereotype.Service;
import java.io.*;

@Service
public class ApteService {

    public String executeScript(String script, String pays) throws IOException, InterruptedException {
        if (script == null || script.isEmpty()) {
            return "Le chemin du script n'a pas été spécifié.";
        }
        if (pays == null || pays.isEmpty()) {
            return "Le pays n'a pas été spécifié.";
        }

        String username = "sunupac";
        String host = "10.12.13.9";
        int port = 22;
        String password = "sunupac";

        JSch jsch = new JSch();
        Session session = null;
        ChannelExec channel = null;

        StringBuilder output = new StringBuilder();

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
                return "Échec de l'établissement de la connexion SSH avec " + host + "\n";
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
                output.append("Erreur: ").append(errorOutput.toString()).append("\n");
            }

            return output.toString(); // Retourne le message de sortie du script
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
        return output.toString(); // Retourne le message de sortie du script

    }
    public String listePays() throws IOException, InterruptedException {
        String script = "liste_pays.sh";
        String pays = "pays";  // Non utilisé pour ce script

        return executeScript(script, pays);
    }

}
