# Activer Google Drive dans Atelier PDF (environ 10 minutes, gratuit)

Google exige qu'une appli qui se connecte à Drive ait un **identifiant** (« ID client »).
Tu le crées une seule fois depuis ton compte Google, puis tu me l'envoies. Je le mets dans l'appli et on teste.

> Cet identifiant n'est **pas** un mot de passe : il est public (il finit par `.apps.googleusercontent.com`).
> Si Google t'affiche aussi un « code secret du client » (client secret), **ne me l'envoie pas** : on n'en a pas besoin.

## 1. Créer le projet
1. Va sur **https://console.cloud.google.com** et connecte-toi avec ton compte Google.
2. En haut à gauche, clique sur le sélecteur de projet → **Nouveau projet**.
3. Nom : `Atelier PDF` → **Créer**. Vérifie ensuite que ce projet est bien sélectionné en haut.

## 2. Activer l'API Google Drive
1. Menu ☰ → **API et services** → **Bibliothèque**.
2. Cherche `Google Drive API` → clique dessus → **Activer**.

## 2 bis. Activer le sélecteur de fichiers de Google
1. Dans la barre de recherche en haut, tape `Google Picker API`.
2. Clique sur le résultat **Google Picker API** → **Activer**.
   (C'est ce qui permet de choisir un PDF ou un dossier dans tout ton Drive depuis l'appli.)

## 3. Écran de consentement (ce que verront les utilisateurs)
1. Menu ☰ → **Google Auth Platform** (ou « API et services → Écran de consentement OAuth ») → **Commencer**.
2. Nom de l'application : `Atelier PDF` ; adresse e-mail d'assistance : ton adresse.
3. Audience : **Externe**.
4. Coordonnées : ton adresse e-mail → accepte les conditions → **Créer**.
5. Rubrique **Accès aux données** → **Ajouter ou supprimer des niveaux d'accès** → coche
   `.../auth/drive.file` (« Afficher, créer et supprimer uniquement les fichiers Google Drive que vous utilisez avec cette application ») → **Mettre à jour** → **Enregistrer**.
6. Rubrique **Audience** → **Utilisateurs test** → **Ajouter des utilisateurs** → ajoute ton adresse Gmail (et celles des personnes qui testeront).

## 4. Créer l'identifiant
1. Rubrique **Clients** → **Créer un client**.
2. Type d'application : **Application Web**. Nom : `Atelier PDF Web`.
3. **Origines JavaScript autorisées** → **Ajouter un URI** :
   - `https://monaccompagnateurenergetique-star.github.io`
   - `http://localhost:8080` (pour mes tests sur ton PC)
4. **URI de redirection autorisés** → **Ajouter un URI** (attention : ici, avec `/app/` et le `/` final) :
   - `https://monaccompagnateurenergetique-star.github.io/app/`
   - `http://localhost:8080/app/`
   → **Créer** (ou **Enregistrer** si le client existe déjà).
5. Copie l'**ID client** (il ressemble à `123456789-abc...xyz.apps.googleusercontent.com`) et **envoie-le-moi**.

## 5. Plus tard : ouvrir à tout le monde
Tant que l'appli est « En test », seuls les utilisateurs test (100 maximum) peuvent se connecter.
Avant la sortie publique, dans **Audience**, clique sur **Publier l'application**.
L'accès `drive.file` est le plus léger de Google. Il ne demande pas d'audit de sécurité.
Google vérifiera seulement le nom, le logo, la page d'accueil et la [politique de confidentialité](confidentialite.html), qui est déjà prête. Il manquera juste l'adresse e-mail de contact.
