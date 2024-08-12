# calendar

Calendar generator

# TODO:

- settings (parameter) + data -> default if not in localstorage
- chaque case remplie par un professeur consomme 4 heures de son volume horaire, vu qu'il y a 20 séances de 4 heures dans la session.
- ajouter days-off récurrents par prof

- ajouter days-off par prof parmi les jours selectionnés au départ: checkbox des jours précis dans la liste des jours selectionnés
- ajouter volume horaire pour la selection de dates par prof: (sauvegarde -> crud prof)
  - INDÉTERMINÉ
  - EXACTEMENT
  - MINIMUM
  - MAXIMUM
  - MINIMUM et MAXIMUM
- ajouter preference de niveaux par prof

- ajouter volume horaire de chaque cours

- un prof -> max 3 levels différents. un level -> max 3 profs différent
- un prof par jour max
- validation:
  - Le professeur André a bien un volume horaire compris entre 30 et 50 heures.
  - Le professeur André est bien absent tous les vendredis et le 24 juillet.
  - En revanche, il a été impossible de l'assigner au niveau A2.1
- générer lessons et calendrier à partir de ces infos en tenant compte des weekend, jours fériés généraux et par prof, et autres contraintes
- excel export
- checkbox parmi les listes des profs/levels/salles pour selectionner ceux disponibles + sauvegarde -> crud pour chacun des trois listes.
- plusieurs ecrans/pages differentes
- gérer les traduction (multilingue -> JSON)
- calendar fixed size + scroll inside
