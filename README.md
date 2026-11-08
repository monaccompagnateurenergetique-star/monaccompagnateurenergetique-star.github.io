# Atelier PDF

Lecteur et éditeur de PDF qui fonctionne entièrement dans le navigateur, conçu d'abord pour le téléphone.
Il lit, remplit les formulaires (testé sur le Cerfa 16089*02, mandat MaPrimeRénov'), signe, tamponne, scanne, fusionne, organise, compresse, numérote, ajoute des filigranes et convertit en images.
**Aucun document n'est envoyé sur internet** : tout est traité sur l'appareil.

## Contenu du dossier

| Élément | Rôle |
|---|---|
| `index.html` | Page de présentation (accueil du site) |
| `confidentialite.html` | Politique de confidentialité (exigée par le Play Store) |
| `assets/` | Images de la page de présentation |
| `app/index.html` | **Toute l'appli** (HTML, CSS et JavaScript dans un seul fichier, sans étape de construction) |
| `app/lib/` | pdf.js 3.11.174 et pdf-lib 1.17.1, en local pour le hors-ligne. **Ne pas mettre à jour sans tests** |
| `app/manifest.webmanifest` | Fiche d'identité de l'appli installable (nom, icônes, menu « Partager » d'Android) |
| `app/sw.js` | Service worker : fonctionnement hors ligne et réception des fichiers partagés |
| `app/icons/` | Icônes 192, 512 et « maskable » |
| `store/` | Fiche Play Store (textes) et bannière 1024×500 |
| `outils/serveur.ps1` | Petit serveur local pour tester sur l'ordinateur |
| `test/` | Cerfa 16089*02 officiel, utilisé pour les tests |
| `.nojekyll` | Indispensable pour que GitHub Pages publie le dossier `.well-known/` (étape Android) |

Données enregistrées sur l'appareil (localStorage uniquement) : `atelierpdf.stamps.v1` (signatures et tampons) et `atelierpdf.prefs.v1` (réglages).

## Tester sur l'ordinateur

1. Ouvrir PowerShell dans ce dossier.
2. Lancer :
   ```
   powershell -ExecutionPolicy Bypass -File outils\serveur.ps1
   ```
3. Ouvrir http://localhost:8080/app/ dans Chrome. Pour simuler un téléphone : F12, puis l'icône téléphone, puis 390 × 844.
4. Arrêter le serveur avec Ctrl+C.

## Publier une nouvelle version

À **chaque** modification d'un fichier de `app/`, ouvrir `app/sw.js` et augmenter le numéro :
`const VERSION = 'atelier-v1';` → `'atelier-v2'`, puis `'atelier-v3'`, etc.
Sans cela, les téléphones qui ont déjà installé l'appli garderont l'ancienne version.

## Mise en ligne sur GitHub Pages (pas à pas)

Le site doit être à la racine du domaine, donc dans un dépôt nommé exactement `<TON-PSEUDO>.github.io`.

1. **Créer le dépôt** : sur github.com, « New repository », nom `<TON-PSEUDO>.github.io`, visibilité **Public**, sans README, puis « Create repository ».
2. **Envoyer les fichiers**, au choix :
   - *Sans installer d'outil* : sur la page du dépôt, « uploading an existing file », glisser **le contenu** de ce dossier (pas le dossier lui-même), puis « Commit changes ». Attention : `.nojekyll` est un fichier caché, vérifier qu'il a bien été envoyé.
   - *Avec Git* (à installer depuis git-scm.com) :
     ```
     git init
     git add .
     git commit -m "Atelier PDF, première version"
     git branch -M main
     git remote add origin https://github.com/<TON-PSEUDO>/<TON-PSEUDO>.github.io.git
     git push -u origin main
     ```
3. **Activer Pages** : Settings → Pages → Source « Deploy from a branch », branche `main`, dossier `/ (root)`, puis Save.
4. Patienter 1 à 2 minutes, puis ouvrir `https://<TON-PSEUDO>.github.io/app/`.
5. **Vérifier l'installation** : dans Chrome sur Android, menu ⋮, « Installer l'application ». L'icône doit apparaître et l'appli doit s'ouvrir sans barre d'adresse.

## Étapes suivantes

1. Remplacer `[ADRESSE E-MAIL DE CONTACT]` dans `confidentialite.html` et `store/fiche-play-store.md`.
2. Fonction « Modèles » (PDF pré-remplis enregistrés en IndexedDB, date du jour mise automatiquement).
3. Paquet Android avec PWABuilder (https://www.pwabuilder.com) à partir de `https://<TON-PSEUDO>.github.io/app/`, puis ajout de `.well-known/assetlinks.json` à la racine du site. **Garder précieusement la clé de signature** fournie par PWABuilder : sans elle, impossible de publier une mise à jour.
4. Fiche Google Play Console à l'aide de `store/fiche-play-store.md`, et captures d'écran.
5. Plus tard : Excel → PDF.

## Points techniques sensibles

- Export (`construirePdf`) : remplissage des champs (pdf-lib) → flatten → écriture et relecture (flush) → `embedPage` de chaque page → dessin des éléments posés.
- Coordonnées des éléments posés : en points PDF, origine en haut à gauche de la page telle qu'on la voit. La conversion vers le repère PDF (origine en bas, rotation de la page) se fait uniquement à l'export (`versUtilisateur`).
- Rendu : `AnnotationMode.ENABLE_FORMS` en mode édition (champs saisissables), `ENABLE_STORAGE` en lecture, pour les vignettes et pour les images.
- PDF protégés par mot de passe : ils s'ouvrent après saisie du mot de passe, puis sont exportés sous forme d'images (pdf-lib ne sait pas les réécrire).
