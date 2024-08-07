# calendar

Calendar generator

# TODO:

- data -> JSON + add 3 new models
- settings (parameter) + data -> default if not in localstorage
- ajouter jours fériés (colonne grise sans les salles (fine))
- enlever les colonnes du samedi + dimanche (2 parameters) -> jours fériés
- nombres de jours maximum -> en tenant compte des jours fériés et weekend
- possibilité de rentrer la durée exacte d'une leçon
- ajouter days-off récurrents par prof: checkbox lundi à vendredi (sauvegarde -> crud prof)
- ajouter days-off par prof parmi les jours selectionnés au départ: checkbox des jours précis dans la liste des jours selectionnés
- ajouter volume horaire pour la selection de dates par prof: (sauvegarde -> crud prof)
  - INDÉTERMINÉ
  - EXACTEMENT
  - MINIMUM
  - MAXIMUM
  - ENTRE
- ajouter preference de niveaux par prof (checkbox liste): 1ere col grande preference, 2e colonne petite pref, avec les options de grde pref en moins (sauvegarde -> crud prof)
- ajouter volume horaire de chaque cours cours
- un prof -> max 3 levels différents. un level -> max 3 profs différent
- validation:
  - Le professeur André a bien un volume horaire compris entre 30 et 50 heures.
  - Le professeur André est bien absent tous les vendredis et le 24 juillet.
  - En revanche, il a été impossible de l'assigner au niveau A2.1
- générer lessons et calendrier à partir de ces infos en tenant compte des weekend, jours fériés généraux et par prof, pause midi, et autres contraintes:
  - calendrier simplifié sans salles ni heures (Julien)
  - calendrier complet
- excel export
- checkbox parmi les listes des profs/levels/salles pour selectionner ceux disponibles + sauvegarde -> crud pour chacun des trois listes.
- plusieurs ecrans/pages differentes
- gérer les traduction (multilingue -> JSON)
- calendar fixed size + scroll inside
