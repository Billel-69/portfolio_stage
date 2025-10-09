# Assistant IA

Cette extension ajoute une page `ia.html` permettant de poser des questions sur des documents personnels.

## Configuration

1. Copier le fichier `.env.example` vers `.env` et y placer votre clé OpenAI :
   ```bash
   cp .env.example .env
   # éditer le fichier .env et ajouter votre clé
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer le serveur :
   ```bash
   npm start
   ```

Le serveur charge les documents présents dans `data/documents.json` et interroge l'API OpenAI pour répondre aux questions envoyées depuis le formulaire de `ia.html`.
