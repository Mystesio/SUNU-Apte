#!/bin/bash

# shellcheck source=main.sh
source main.sh



while true; do
# Afficher le menu
echo "Choisissez une option :"
echo "1. Restauration d'un base de données  SUNULIFE"
echo "2. Supprimer la base de données SUNULIFE"
echo "3. Quitter"


# Demander à l'utilisateur de choisir une option
read option

# Vérifier l'option choisie
case $option in
    1)
        echo "Restauration d'un base de données  SUNULIFE"
         restaurer_db_life
        ;;
    2)
        echo  "Supprimer la base de données SUNULIFE"
        supprimer_db_life
        ;;

    3)
        echo "Au revoir!"
        exit 0
        ;;

   
    *)
        echo "Option invalide!"
        ;;
esac
done
