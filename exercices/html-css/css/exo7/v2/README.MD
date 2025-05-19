# Dashboard Administratif Interactif

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![Licence](https://img.shields.io/badge/license-MIT-green.svg)

Un tableau de bord administratif interactif avec widgets personnalisables, thème clair/sombre, fonctionnalités de glisser-déposer et système d'authentification.

## Description
Ce projet est un tableau de bord administratif interactif, créé avec HTML, CSS et JavaScript. Il met en œuvre des fonctionnalités avancées de layout CSS Grid et de manipulation d'éléments par glisser-déposer.

## 📋 Fonctionnalités

- **Authentification complète** : 
  - Page de connexion moderne et adaptative
  - Connexion standard avec nom d'utilisateur/mot de passe
  - Authentification avec Google via l'API Google Identity
  - Gestion des profils et des sessions utilisateurs
  - Fonction de déconnexion sécurisée avec animation de transition
- **Widgets interactifs** : Statistiques, graphiques, tableaux et formulaires
- **Personnalisation avancée** : 
  - Redimensionnement des widgets
  - Mode compact optimisé avec résumés concis
  - Réarrangement par glisser-déposer
  - Hauteur égalisée pour les widgets sur une même ligne
- **Thème jour/nuit** : Basculement entre les modes clair et sombre
- **Responsive** : S'adapte à toutes les tailles d'écran
- **Persistance des données** : État sauvegardé dans localStorage
- **Mises à jour en temps réel** : Simulation de données dynamiques
- **Animations et transitions** : Loaders, effets visuels et retours utilisateur
- **Interface utilisateur améliorée** :
  - Écrans de chargement fluides entre les pages
  - Contraste optimisé pour une meilleure lisibilité
  - Boutons et contrôles accessibles

## 🚀 Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/votre-utilisateur/dashboard-admin.git
```

2. Pour utiliser l'authentification Google, vous devez obtenir un ID client OAuth 2.0 :
   - Allez sur la [Console Google Cloud](https://console.cloud.google.com/)
   - Créez un nouveau projet ou sélectionnez un projet existant
   - Activez l'API "Google Identity Services" pour votre projet
   - Accédez à "APIs & Services > Credentials"
   - Cliquez sur "Create Credentials" et sélectionnez "OAuth client ID"
   - Configurez l'écran de consentement OAuth :
     - Type d'utilisateur : Externe
     - Nom de l'application : AdminPanel Dashboard
     - Domaine autorisé : votre domaine (localhost pour le développement)
     - Logo de l'application : facultatif
     - Email de contact du développeur : votre email
   - Pour le type d'application, choisissez "Web application"
   - Nom : "AdminPanel Web Client" (ou autre nom descriptif)
   - Ajoutez vos origines JavaScript autorisées :
     - Pour le développement local : `http://localhost`, `http://localhost:5500`, `http://127.0.0.1:5500` (pour Live Server)
     - Pour la production : ajoutez votre domaine de production
   - Ajoutez vos URI de redirection autorisées :
     - **IMPORTANT** : Ajoutez l'URL EXACTE vers où vous accédez à votre application
     - Par exemple : `http://127.0.0.1:5500/login.html`, `http://localhost:5500/login.html`, ou l'URL complète de votre serveur.
   - Cliquez sur "Create"
   - Copiez votre ID client OAuth 2.0 qui apparaît dans la fenêtre modale
   - Dans `login.html`, remplacez TOUS les `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` par votre ID client

3. Ouvrez le fichier `login.html` dans votre navigateur ou utilisez un serveur local comme Live Server pour VS Code.

## Détails de l'authentification

### Méthodes de connexion

1. **Connexion standard** :
   - Utilisateur : `admin` / Mot de passe : `admin` (accès administrateur)
   - Utilisateur : `user` / Mot de passe : `user` (accès standard)

2. **Connexion Google** :
   - Options de connexion standard et alternative
   - Sécurisé par l'API Google Identity Services
   - Mode popup pour éviter les problèmes de redirection

### Gestion des sessions

- Les données de session sont stockées dans localStorage
- Les profils utilisateurs contiennent : nom, email, avatar, rôle
- Interface adaptée selon le type d'utilisateur et la méthode de connexion

## Techniques CSS avancées utilisées

- `grid-template-areas` pour définir des zones nommées
- `grid-template-columns` avec `fr`, `minmax()` et `auto-fill`
- CSS Variables (propriétés personnalisées) pour la thématisation
- Media queries pour le responsive design
- Transitions et animations CSS pour les retours visuels
- Flexbox pour l'alignement et la distribution du contenu
- Layout imbriqués avec grilles à l'intérieur de grilles

## JavaScript avancé

- Architecture modulaire avec séparation des responsabilités
- Gestion d'événements et délégation
- Manipulation dynamique du DOM
- Persistance des données avec localStorage
- API Drag and Drop personnalisée
- Animation par requestAnimationFrame

## Bibliothèques externes

- **Chart.js** - Pour la visualisation de données
- **Font Awesome** - Pour les icônes
- **Google Identity Services** - Pour l'authentification Google

## Compatibilité navigateur

- Chrome 70+
- Firefox 63+
- Safari 12+
- Edge 79+
- Opera 60+

## Nouveautés dans la version 2.1.0

- Loaders de transition entre les pages
- Amélioration de la mise en page des widgets compacts
- Correction de bugs d'affichage et d'alignement
- Égalisation automatique de la hauteur des widgets sur une même ligne
- Amélioration du contraste pour une meilleure accessibilité