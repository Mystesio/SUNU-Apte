#!/bin/bash

# shellcheck source=main.sh
source main.sh

while true; do
    # Afficher le menu
    echo "Choisissez une option :"
    echo "1. Mise à jour de la base de données d'une instance SUNUPAC"
    echo "2. Mise à jour des addons d'une instance SUNUPAC"
    echo "3. Changer le port d'une instance SUNUPAC"
    echo "4. Suppression d'une base de données"
    echo "5. Suppression de tous les base de données"
    echo "6. Quitter"
    
    # Demander à l'utilisateur de choisir une option
    read option
    
    # Vérifier l'option choisie
    case $option in
        
        1)
            echo "Mise à jour  de la base de données d'une instance SUNUPAC"
            recuperer_pays_bases
            demander_isokey
            restaurer_db
        ;;
        2)
            echo "Mise à jour  des addons d'une instance SUNUPAC"
            recuperer_pays_bases
            demander_isokey
            copy_dezip_addons
        ;;
        3)
            echo " Changer le port d'une instance SUNUPAC"
            recuperer_pays_bases
            demander_pays
            changer_port
        ;;
        
        4)
            echo "Suppression d'une bases de données"
            supprimer_bases_pays
        ;;
        
        5)
            echo "Suppression tous les bases de données"
            delete_all
        ;;  
        6)
            echo "Au revoir!"
            exit 0
        ;;
        *)
            echo "Option invalide!"
        ;;
    esac
done