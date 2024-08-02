# calendar
Calendar generator

# TODO:
trier automatiquement le tableau des leçons date.
possibilité de trier le tableau des leçons par professeur, niveau et date.
couleur des cases de leçons dans le calendrier: en fonction du professeur ou niveau ?
filtrer tableau final en fonction des const: salles, professeurs et niveaux, sous forme de trois tableaux de deux colonnes: value et action (show/hide).

- Afficher une seule fois les info du cours par block + title avec heure de début et fin du block (title avec la meme info pour chaque quart d’heure du block)
- Refactoring code. getComputedStyle(document.documentElement).getPropertyValue
- pas besoin de calendardata ? Seulement rooms, times et days.
- instead of room, teacher and level names, use ids, then translate
