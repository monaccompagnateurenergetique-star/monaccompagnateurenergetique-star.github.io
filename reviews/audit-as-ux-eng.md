# Audit UX : créateur de modèles d'Atelier PDF

**Regard** : ingénieur UX
**Date** : 12 novembre 2026
**Périmètre** : `app/index.html`, créateur de modèles (`editerDocument`), menu latéral

## Résumé

L'utilisateur (artisan, débutant en informatique) compose un document en posant des blocs sur une page. Il doit pouvoir placer des blocs côte à côte, ajouter une signature et retrouver de la place à l'écran sans chercher dans des réglages.

## Parcours

| Étape | Avant | Après (v78) |
|---|---|---|
| Ajouter une date | FAIL : la date occupe toute la ligne, rien ne peut aller à côté | OK : la date prend la moitié, une « Place libre » s'affiche à droite |
| Mettre un bloc à côté d'un autre | FAIL : réglage « Moitié » caché dans le panneau, à faire sur les deux blocs | OK : cliquer la place libre puis un bloc, ou glisser un bloc sur le bord gauche / droit d'un autre |
| Ajouter une signature | FAIL : un bloc « Signatures » à deux signataires, réglages imbriqués, « 1 signature » coupe quand même en deux | OK : un bloc = une signature (« Signature client », « Signature entreprise »), trois réglages |
| Désélectionner un bloc | FAIL : obligé de cliquer un autre bloc | OK : un clic dans le vide de la page |
| Gagner de la place | FAIL : menu latéral fixe | OK : bouton pour replier le menu, mémorisé |

## Verdict : APPROUVÉ AVEC RÉSERVES

## Problèmes critiques (corrigés)

| # | Problème | Effet sur l'utilisateur | Correction |
|---|---|---|---|
| 1 | Largeur des blocs invisible | Impossible de deviner qu'on peut faire des colonnes | Largeurs 1/3, 1/2, 2/3 ; date et nombre en 1/2 par défaut ; place libre visible et cliquable ; dépôt sur le côté d'un bloc |
| 2 | Bloc signature à deux têtes | Réglages illogiques (« qui signe » répété, mention pour l'entreprise) | Un bloc par signature ; la mention « Lu et approuvé » n'est proposée que pour le client |
| 3 | Pas de désélection | Barre d'outils du bloc toujours affichée, gêne la lecture | Clic sur le fond = désélection, le panneau de droite revient au thème |
| 4 | Dépôt sous une ligne à plusieurs blocs | Le bloc se glissait entre les deux | « Au-dessus / en dessous » vise toute la ligne |

## Recommandations (pas encore faites)

| # | Sujet | Effet | Piste |
|---|---|---|---|
| 1 | Téléphone : pas de dépôt sur le côté depuis la palette | Les colonnes se font par la place libre ou le réglage Largeur | Acceptable ; à revoir si besoin |
| 2 | Annuler (Ctrl+Z) limité à la suppression d'un bloc | Une erreur de déplacement se rattrape à la main | Historique d'annulation du modèle |
| 3 | Question à plusieurs réponses | Manque pour certaines fiches de visite | Nouveau type « Cases multiples » |
| 4 | Formulaire du vrai remplissage | Habillage moins soigné que l'essai du créateur | Reprendre les cartes par section |

## Cohérence

- Même geste pour déplacer un bloc et pour en ajouter un depuis la palette (glisser, indicateur vert).
- Pas de barre verticale colorée : les indicateurs de dépôt sur le côté sont une zone teintée, pas un liseré.
- Le PDF reprend exactement les colonnes de l'éditeur.

## Détail du verdict

- Découvrabilité : RÉUSSI (place libre visible, astuce sous la palette)
- Parcours complet : RÉUSSI
- Rattrapage d'erreur : RÉSERVES (annulation limitée)
- Retours du système : RÉUSSI
- Cohérence : RÉUSSI
