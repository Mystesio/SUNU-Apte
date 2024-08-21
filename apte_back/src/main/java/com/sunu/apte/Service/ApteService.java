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
        StringBuilder filteredOutput = new StringBuilder();

        try {
            // Supprimer la clé d'hôte existante
            Process process = Runtime.getRuntime().exec("ssh-keygen -R " + host);
            process.waitFor();

            session = jsch.getSession(username, host, port);
            session.setPassword(password);

            java.util.Properties config = new java.util.Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);

            session.connect();

            if (!session.isConnected()) {
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

            int exitCode = channel.getExitStatus();
            if (exitCode == 0) {
                output.append("Script exécuté avec succès\n");
            } else {
                output.append("Échec de l'exécution du script\n");
            }

        } catch (JSchException | IOException | InterruptedException e) {
            return "Erreur lors de l'exécution du script : " + e.getMessage();
        } finally {
            if (channel != null && channel.isConnected()) {
                channel.disconnect();
            }
            if (session != null && session.isConnected()) {
                session.disconnect();
            }
        }

        return filteredOutput.length() > 0 ? filteredOutput.toString() : output.toString();
    }

    // Supprimez la méthode getFilteredOutputMessage(), car nous ne l'utilisons plus
}
