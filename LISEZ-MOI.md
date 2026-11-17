# CongoMotors — Black Label Premium Automotive Showroom

Site statique (HTML/CSS/JS, GSAP + ScrollTrigger en local, polices Manrope & Space Grotesk en local). Aucune dépendance réseau.
Lancer : `python3 -m http.server 8080` puis ouvrir http://localhost:8080 (ou déployer le dossier tel quel sur Vercel/Netlify/Render static).

## Pages
index · showroom (51 fiches, recherche + filtres) · vehicule?id=… · location · recherche · a-propos · contact · admin

## ÉLÉMENTS À FOURNIR (rien n'est inventé)
1. **Vidéo 360°** : aucune vidéo libre de droits n'a pu être obtenue (accès réseau limité lors de la construction). Déposer
   `assets/video/hero-360.mp4` (H.264, ≤ 6 Mo, 1280×720, muette), idéalement `hero-360.webm` et `hero-360-poster.jpg`.
   Elle sera lue automatiquement (muette, bouton Pause). Sans fichier : repli élégant avec le logo et une mention « fichier à fournir ».
   Une fois la vidéo en place, supprimer la ligne `.hero-note` de `index.html`.
2. **Photographies** des 51 véhicules : aucune photo n'est affichée tant qu'une vraie photo du bon modèle sous licence n'est pas fournie.
   Placer les fichiers dans `assets/images/vehicles/<id>/` (WebP) et les déclarer dans `data/images.js`, ex. :
   `window.CM_IMAGES={"toyota-hilux":["assets/images/vehicles/toyota-hilux/avant.webp", ...]};` — ou les ajouter via l'admin (démo).
   Conserver la licence/attribution de chaque image.
3. **Données réelles** : année, prix, kilométrage, carburant, boîte, disponibilité → `data/vehicles.js` (`null` = « À confirmer »).
   Passer `example:false` seulement pour un véhicule réellement en stock. Parc de location : `rental:true`.
4. **Adresses exactes** des showrooms, historique, chiffres et témoignages : volontairement absents.
5. **Logo** : fichier de référence (capture TikTok) utilisé tel quel ; fournir le PNG/SVG source pour un rendu net en grand format.

## Limites de la version démo
- Administration (`admin.html`) : **aucune authentification**, données dans le `localStorage` du navigateur (non partagées, non sécurisées).
  Export/import JSON possible. Ne pas la considérer comme un système de gestion en production.
- Les formulaires **préparent** un message WhatsApp (+242 06 793 34 69) que le visiteur doit envoyer lui-même ; rien n'est envoyé automatiquement.
- Backend futur : remplacer les fonctions de `js/store.js` par des appels API (GET/POST/PUT/DELETE /vehicles, POST /requests) et protéger `admin.html`.
