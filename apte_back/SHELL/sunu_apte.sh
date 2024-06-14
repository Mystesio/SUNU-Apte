#!/bin/bash


# shellcheck source=main.sh
source main.sh

while true; do
# Afficher le menu
echo "Choisissez une option :"
echo "1. Réplication d'une instance SUNUPAC"
echo "2. Mise à jour  de toutes les instances SUNUPAC"
echo "3. Options"
echo "4. Lancer une instance SUNUPAC"
echo "5. Preprod"
echo "6. SUNULIFE"
echo "7. Quitter"


# Demander à l'utilisateur de choisir une option
read option

# Vérifier l'option choisie
case $option in
    1)
        echo "Réplication d'une instance SUNUPAC"
        ./launch.sh 
        ;;
    2)
        echo "Mise à jour  de toutes les instances SUNUPAC"
        ./launch-all.sh 
        ;;
    3)
        echo "Options"
        ./update-sunupac.sh 
        ;;
    4)
        echo "Lancer une instance SUNUPAC"
        ./SUNUPAC-START.sh 
        ;;
    5)
        echo "Preprod"
        ./Preprod.sh
        ;;    
    6)
        echo "SUNULIFE"
        ./sunulife.sh
        ;;    

    7)
        echo "Au revoir!"
        exit 0
        ;;

   
    *)
        echo "Option invalide!"
        ;;
esac
done