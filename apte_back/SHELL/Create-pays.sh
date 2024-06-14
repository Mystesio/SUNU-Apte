#!/bin/bash

backup_db_dir="/mnt/backup_db/IARD"

for pays_dir in "$backup_db_dir"/*; do
    pays=$(basename "$pays_dir")
    mkdir /home/sunupac/$pays
done