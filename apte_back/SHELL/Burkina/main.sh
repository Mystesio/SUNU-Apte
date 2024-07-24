#!/bin/bash


$pays="BURKINA"
$ISO_key="BF"


#Informations sur le serveur web services
backup_addons_dir="/mnt/backup_addons"
backup_db_dir="/mnt/backup_db/IARD"
backup_life_dir="/mnt/backup_db/VIE"
backup_webservices="/mnt/backup_webservices"
webservices_directory=/home/sunupac/webserservices/"$pays"
Preprod_dir=/home/sunupac/Preprod/"$pays"
web_server_user="sunupac"
web_server_ip="10.12.13.9"



# Informations sur le serveur app
app_server_user="sunupac"
app_server_ip="10.12.13.58"
app_server_directory=/home/sunupac/"$pays"/odoo-8.0-20171001/openerp/addons



# Informations sur le serveur de base de données
db_server_user="sunupac"
db_server_ip="10.12.13.4"
db_server_directory="/home/sunupac"



#Vérification de la chaine caractère en chiffre
function is_number() {
  if [[ -z $1 ]]; then
    return 1
  fi

  if [[ $1 =~ ^[0-9]+$ && ${#1} -le 4 ]]; then
    return 0
  else
    return 1
  fi
}

#Accès au serveur APP via SSH
function ssh_app() {
    command_to_run="$*"  
    ssh "$app_server_user@$app_server_ip" "$command_to_run"
}

#Accès au serveur WEB via SSH
function ssh_web() {
    command_to_run="$*"  
    ssh "$web_server_user@$web_server_ip" "$command_to_run"
}

#Accès au serveur DB via SSH
function ssh_db() {
    command_to_run="$*"  
    ssh "$db_server_user@$db_server_ip" "$command_to_run"
}

#copier et dezip le webservices de la backup d'un pays
function cp_dezip_webservices(){
webservices_directory=/home/sunupac/webserservices/"$pays"
echo  "Transfert du webservice"
ws_file=$( ssh_web "find "$backup_webservices" -type f -name "$ISO_key"*.tar.gz")
if [ $? -eq 0 ]; then
  ws_file=("$backup_webservices"/"$pays"/*.tar.gz)
   if [ $? -eq 0 ]; then
   ssh_web "cp $ws_file $webservices_directory"
    if [ $? -eq 0 ]; then
     ssh_web "tar -zxvf $webservices_directory/*.tar.gz -C $webservices_directory > /dev/null" 
        if [ $? -eq 0 ]; then
         ssh_web " rm  $webservices_directory/*.tar.gz"
          echo "$(date +'%Y-%m-%d %H:%M:%S')  WEBSERVICE :A JOUR " >> /home/sunupac/script/sunu_apte.log
          echo "Transfert webservices réussi"
        else 
       ssh_web " rm  $webservices_directory/*.tar.gz "
        echo "$(date +'%Y-%m-%d %H:%M:%S')   WEBSERVICE : ECHEC DECOMPRESSION " >> /home/sunupac/script/sunu_apte.log
        echo "Echec décompression"
        fi
      else 
      echo "Erreur lors du transfert. Veuillez vérifier les chemins d'accès pour $pays."
      echo "$(date +'%Y-%m-%d %H:%M:%S')   WEBSERVICE : ECHEC TRANSFERT " >> /home/sunupac/script/sunu_apte.log
    fi 
    else 
    echo "$(date +'%Y-%m-%d %H:%M:%S')   WEBSERVICE : WEBSERVICE INTROUVABLE" >> /home/sunupac/script/sunu_apte.log
    echo "Webservice Introuvable"
   fi
fi
}

#copier et dezip l'addon de la backup d'un pays
function copy_dezip_addons(){
  echo "Transfert des addons depuis le serveur web services vers le serveur app..."
tar_file=$(find "$backup_addons_dir" -type f -name "$ISO_key"*.tar.gz)
if [ $? -eq 0 ]; then
   tar_file="$backup_addons_dir"/"$pays"/*.tar.gz
   scp $tar_file "${app_server_user}@${app_server_ip}:${app_server_directory}"
  if [ $? -eq 0 ]; then
  echo "Décompression des addons..."
  ssh_app "tar -zxvf ${app_server_directory}/*.tar.gz -C ${app_server_directory} > /dev/null"
  if [ $? -eq 0 ]; then
    ssh_app "rm  ${app_server_directory}/*.tar.gz" 
    echo "Décompression terminé"
    echo "$(date +'%Y-%m-%d %H:%M:%S')   ADDONS : A JOUR " >> /home/sunupac/script/sunu_apte.log
    else 
    echo "Echec de décompression"
    echo "$(date +'%Y-%m-%d %H:%M:%S')   ADDONS : ECHEC DECOMPRESSION" >> /home/sunupac/script/sunu_apte.log
    ssh_app "rm  ${app_server_directory}/*.tar.gz" 
  fi
  else
  echo "$(date +'%Y-%m-%d %H:%M:%S')   ADDONS : ECHEC TRANSFERT" >> /home/sunupac/script/sunu_apte.log
  echo "Erreur lors du transfert. Veuillez vérifier les paramètres de connexion et les chemins d'accès pour $pays."
  fi
  else
  echo "$(date +'%Y-%m-%d %H:%M:%S')   ADDONS : ADDONS INTROUVABLE" >> /home/sunupac/script/sunu_apte.log
  echo "Addons Introuvable pour $pays"
   fi

}

#changer le port d'une instance SUNUPAC d'un pays



function changer_port() {
  # Information sur le fichier config.py
  app_server_port="/home/sunupac/${pays}/odoo-8.0-20171001/openerp/tools/config.py"

  # Extraire la valeur de xmlrpc-port du fichier config.py
Oldport=$(ssh_app "awk '/--xmlrpc-port/ {match(\$0, /[0-9]+/); print substr(\$0, RSTART, RLENGTH)}' ${app_server_port}")


  echo "Ancien port : ${Oldport}"
  
  read -p "Veuillez saisir le nouveau port : " Newport
  if [[ "$Newport" =~ ^[0-9]{4}$ ]] && [[ "$Oldport" =~ ^[0-9]{4}$ ]]; then
    echo "Connexion au port : ${Newport}"

    # Vérifie si le port est disponible
    while true; do
      ss -tuln | grep ":${Newport} " > /dev/null
      if [ $? -eq 0 ]; then
        echo "Le port ${Newport} n'est pas disponible"
        read -p "Veuillez saisir le nouveau port : " Newport
      else
        echo "Le port ${Newport} est disponible"
        break
      fi
    done
ssh_app "awk -v oldport='${Oldport}' -v newport='${Newport}' '{gsub(\"my_default=\" oldport, \"my_default=\" newport); print}' ${app_server_port} > temp && mv temp ${app_server_port}"



    if [ $? -eq 0 ]; then
      echo "Maintenant SUNUPAC ${pays} utilise le port ${Newport}."
    else
      echo "Erreur lors de la modification du config.py."
    fi
  else
    echo "Erreur ! Veuillez saisir uniquement 4 chiffres."
  fi
}



# Restaurer la base de données de la backup d'un pays
function restaurer_db(){
 
# Format de la base de données
db_server_database="db_sunupac_"$pays

echo "Transfert du fichier depuis le serveur web services vers le serveur db..."
db_file=$(find "$backup_db_dir" -type f -name "$ISO_key"*.backup)
if [ $? -eq 0 ]; then
db_file=("$backup_db_dir"/"$pays"/*.backup)
scp "$db_file" "${db_server_user}@${db_server_ip}:${db_server_directory}"
if [ $? -eq 0 ]; then
  ssh_db "dropdb -U ${db_server_user} ${db_server_database}  > /dev/null"
  ssh_db "createdb -U ${db_server_user} ${db_server_database}  > /dev/null"
  echo "Restauration de la base de données de "$db_server_database
  ssh_db "pg_restore -U ${db_server_user} -d ${db_server_database} '${db_server_directory}'/*.backup"
    if [ $? -eq 0 ]; then
     ssh_db "rm ${db_server_directory}/*.backup"
     echo "$(date +'%Y-%m-%d %H:%M:%S')   BD : BACKUP RESTAURE" >> /home/sunupac/script/sunu_apte.log
     echo "Restauration terminé du $pays"
     else
     ssh_db "rm ${db_server_directory}/*.backup"
     echo "$(date +'%Y-%m-%d %H:%M:%S')   BD : ECHEC RESTAURATION " >> /home/sunupac/script/sunu_apte.log
     echo "Echec de la Restauration $pays"
    fi
    else
    echo "$(date +'%Y-%m-%d %H:%M:%S')  BD : ECHEC TRANSFERT " >> /home/sunupac/script/sunu_apte.log
    echo "Erreur lors du transfert. Veuillez vérifier les paramètres de connexion et les chemins d'accès pour $pays."
 fi
else
echo "$(date +'%Y-%m-%d %H:%M:%S')   BD : BACKUP INTROUVABLE " >> /home/sunupac/script/sunu_apte.log
echo "backup introuvable du $pays"
fi
}

# Créer une instance SUNUPAC du pays
function launch(){
     recuperer_pays_bases

# Limite d'instances SUNUPAC 
 if [ ${#selected_countries[@]} -ge 5  ]; then
        echo "Il y a déjà 5 instances déployés sur les serveurs.Veuillez supprimer une base de données d'un pays pour libérer de l'espace."
        exit 1  
    else  
    echo "$(date +'%Y-%m-%d %H:%M:%S')  NOUVELLE INSTANCE SUNUPAC" >> /home/sunupac/script/sunu_apte.log
    echo "$(date +'%Y-%m-%d %H:%M:%S')  SUNUPAC $pays : " >> /home/sunupac/script/sunu_apte.log
    copy_dezip_addons
    changer_port
    restaurer_db
    lanch_sunupac
    fi

}

# Démarrer une instance SUNUPAC d'un pays
function lanch_sunupac(){
    ssh_app "./$pays/odoo-8.0-20171001/openerp-server"
    if [ $? -eq 0 ]; then
    echo "Veuillez entrer le pays"
    read -r pays
    ssh_app "./$pays/odoo-8.0-20171001/openerp-server"
    else
    echo "erreur au lancement de sunupac"
    fi
}


# Mise à jour des instances sunupac déployés 
function save_5() {
ssh_db "./end_db.sh"
recuperer_pays_bases
  echo "$(date +'%Y-%m-%d %H:%M:%S')  MAJ DES INSTANCES SUNUPAC DEPLOYES " >> /home/sunupac/script/sunu_apte.log
      for pays in "${selected_countries[@]}"; do
        echo "$(date +'%Y-%m-%d %H:%M:%S')  SUNUPAC $pays : " >> /home/sunupac/script/sunu_apte.log
        echo "Traitement pour le pays : $pays"
        copy_dezip_addons
        restaurer_db
    done 
    echo "$(date +'%Y-%m-%d %H:%M:%S') FIN DE MAJ ." >> /home/sunupac/script/sunu_apte.log

}

# Supprimer toutes les instances sunupac déployés
function delete_all() {
  recuperer_pays_bases
  ssh_db "./end_db.sh"
  echo "Suppression des bases de données pour les pays suivants :"
  for pays in "${selected_countries[@]}"; do
    db_name="db_sunupac_$pays"
    echo "  - $pays : $db_name"
    ssh_db "dropdb -U ${db_server_user} $db_name"
      if [ $? -eq 0 ]; then
      echo "Base de données $db_name supprimée avec succès."
      echo "$(date +'%Y-%m-%d %H:%M:%S') SUNUPAC $pays SUPPRIME " >> /home/sunupac/script/sunu_apte.log
    else
      echo "Erreur lors de la suppression de la base de données $db_name."
      echo "$(date +'%Y-%m-%d %H:%M:%S') SUNUPAC $pays :ECHEC SUPPRIMEE " >> /home/sunupac/script/sunu_apte.log
    fi
  done
}

# Lister toutes les instances sunupac déployés
function recuperer_pays_bases() {
  selected_countries=()
  db_names=$(ssh_db "psql -U ${db_server_user} -l -t | cut -d '|' -f 1 | sed '/^\s*$/d'")

  for db_name in $db_names; do
    if [[ $db_name =~ ^db_sunupac_(.+)$ ]]; then
      pays=${BASH_REMATCH[1]}
      selected_countries+=("$pays")
    fi
  done
    echo "Liste des instances SUNUPAC déployés:"  "${selected_countries[@]}"
}


# Supprimer une instance sunupac déployé
function supprimer_bases_pays() {

   recuperer_pays_bases
    db_name="db_sunupac_$pays"
    echo "Suppression de la base de données $db_name..."
    ssh_db "./end_db.sh"
    ssh_db "dropdb -U ${db_server_user} $db_name"
    if [ $? -eq 0 ]; then
      echo "Base de données $db_name supprimée avec succès."
    else
      echo "Erreur lors de la suppression de la base de données $db_name."
    fi

}

# Compresser l'addon
function compresser_addon() {
  app_server_directory=/home/sunupac/"$pays"/odoo-8.0-20171001/openerp/addons
    tar_file="$ISO_key-$(date +'%Y%m%d').tar.gz"
    echo "Compression des addons"
    ssh_app "tar -zcvf "$app_server_directory/$tar_file" -C "$app_server_directory" . > /dev/null"
    tar_dir="$app_server_directory/$tar_file"
    if [ $? -eq 0 ]; then
        echo "Addon compressé avec succès."
        echo "Envoi des addons $pays en Preprod"
        scp   "${app_server_user}@${app_server_ip}:$tar_dir" "$Preprod_dir"
         if [ $? -eq 0 ]; then
         ssh_app "rm $tar_dir"
         echo "Envoi terminé"
         else
           echo "Erreur lors de l'envoi"
         fi
    else
        echo "Erreur lors de la compression de l'addon."
    fi
}

# Créer une sauvegarde de la base de données
function sauvegarder_db() { 
    echo "Sauvegarde de la base de données pour le pays : $pays"
    db_name="db_sunupac_$pays"
    db_dump="$ISO_key-$(date +'%Y%m%d').backup"

    ssh_db "pg_dump -U $db_server_user $db_name > $db_dump "
    if [ $? -eq 0 ]; then
        echo "Sauvegarde de la base de données réussie."
        echo "Envoi de la base données $pays en Preprod"
        scp "${db_server_user}@${db_server_ip}:$db_dump" "$Preprod_dir"
         if [ $? -eq 0 ]; then
         echo "Envoi Terminé"
         ssh_db "rm $db_dump"
         else
         echo "Erreur lors de l'envoi"
         fi
    else
        echo "Erreur lors de la sauvegarde de la base de données."
    fi
}

#Créer dump avec addons et DB pour un pays en preprod
function envoi_preprod(){
 ssh_db "./end_db.sh"
 demander_isokey 
 Preprod_dir=/home/sunupac/Preprod/"$pays"
 compresser_addon
 sauvegarder_db

}


###############################################SUNU LIFE#################################################################################################################

# Restaurer la base de données de la backup d'un pays
function restaurer_db_life(){

# Format de la base de données
db_server_database="db_SUNULIFE_"$pays

echo "Transfert du fichier depuis le serveur web services vers le serveur db..."
db_file=$(find "$backup_life_dir" -type f -name "$ISO_key"*.backup)
if [ $? -eq 0 ]; then
db_file=("$backup_life_dir"/"$pays"/*.backup)
scp "$db_file" "${db_server_user}@${db_server_ip}:${db_server_directory}"
if [ $? -eq 0 ]; then
  ssh_db "./end_db.sh"
  ssh_db "dropdb -U ${db_server_user} ${db_server_database}"
  ssh_db "createdb -U ${db_server_user} ${db_server_database}"
  echo "Restauration de la base de données de "$db_server_database
  ssh_db "pg_restore -U ${db_server_user} -d ${db_server_database} '${db_server_directory}'/*.backup"
    if [ $? -eq 0 ]; then
     ssh_db "rm ${db_server_directory}/*.backup"
     echo "Restauration terminé du $pays"
     else
     ssh_db "rm ${db_server_directory}/*.backup"
     echo "Echec de la Restauration $pays"
    fi
    else 
    echo "Erreur lors du transfert. Veuillez vérifier les paramètres de connexion et les chemins d'accès pour $pays."
 fi
else
echo "backup introuvable du $pays"
fi
}

function supprimer_db_life() {
    
    db_name="db_SUNULIFE_$pays"
    echo "Suppression de la base de données $db_name..."
    ssh_db "./end_db.sh"
    ssh_db "dropdb -U ${db_server_user} $db_name"
    if [ $? -eq 0 ]; then
      echo "Base de données $db_name supprimée avec succès."
    else
      echo "Erreur lors de la suppression de la base de données $db_name."
    fi
}
