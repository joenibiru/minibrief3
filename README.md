# Portfolio de Jonathan Lacoste

Site statique HTML/CSS/JavaScript, sans installation de dépendances.

## Consultation locale

Avec Node.js installé, ouvrir `demarrer-portfolio.cmd`, puis http://127.0.0.1:8080.
Ou, depuis ce dossier :

```powershell
node serve.mjs
```

Arrêter le serveur avec Ctrl+C. Si le port est occupé : `$env:PORT=8081; node serve.mjs`.
Un serveur statique de votre éditeur, tel que Live Server, convient également.

## Structure

- `index.html` : contenu, prestations, réalisations et parcours.
- `styles/style.css` : palette, mise en page et adaptations responsive.
- `JS/main.js` : menu mobile, visionneuse native et ancienne ancre `#creations`.
- `images/portfolio/` : visuels optimisés ; les fichiers sources historiques sont conservés.
- `assets/CV-Jonathan-Lacoste.pdf` : CV conservé.

Les anciennes ancres sont conservées. La galerie `#creations` s’ouvre lors d’une navigation directe.
Le contact utilise mailto et tel, comme l’existant. Aucun envoi de formulaire n’est simulé.
La préférence de réduction des mouvements est respectée.

## Contenu à enrichir

Ajouter les outils et contributions exacts des nouvelles réalisations lorsqu’ils sont confirmés.
Ajouter l’URL de la démonstration Maison Biscélia si elle est disponible.
Laeti-Réflexologie est présenté comme site vitrine, sans affirmer un statut de projet client non documenté.

## Contrôles

```powershell
node --check JS/main.js
node --check serve.mjs
```

Il n’existe pas de compilation, de lint configuré ni de suite de tests dans ce projet.

## Direction visuelle et mouvement
Éclairs SVG, scène facettée et perspective CSS. Le bouton de l’introduction met les animations en pause. La préférence système prefers-reduced-motion désactive les mouvements. Les effets et leurs styles figurent à la fin de styles/style.css et JS/main.js.

