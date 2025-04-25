# Dashboard Administratif Interactif

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
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
  - Fonction de déconnexion sécurisée
- **Widgets interactifs** : Statistiques, graphiques, tableaux et formulaires
- **Personnalisation** : Redimensionnement, mode compact et réarrangement par glisser-déposer
- **Thème jour/nuit** : Basculement entre les modes clair et sombre
- **Responsive** : S'adapte à toutes les tailles d'écran
- **Persistance des données** : État sauvegardé dans localStorage
- **Mises à jour en temps réel** : Simulation de données dynamiques
- **Layout CSS Grid responsive** pour l'organisation des widgets
- **Fonctionnalité de glisser-déposer** pour réorganiser les widgets
- **Sidebar rétractable** pour maximiser l'espace de travail
- **Adaptation mobile** avec menu hamburger
- **Animations fluides** pour les transitions et interactions
- **Visualisation de données** avec Chart.js
- **Widgets dynamiques** pour statistiques, graphiques, tableaux et formulaires

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
     - Vous pouvez ajouter plusieurs URIs de redirection (une pour chaque URL depuis laquelle vous accédez à l'application)
   - Cliquez sur "Create"
   - Copiez votre ID client OAuth 2.0 qui apparaît dans la fenêtre modale
   - Dans `login.html`, remplacez TOUS les `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` par votre ID client

3. Ouvrez le fichier `login.html` dans votre navigateur ou utilisez un serveur local comme Live Server pour VS Code.

### Dépannage de l'authentification Google

Si vous rencontrez l'erreur "The OAuth client was not found" (Erreur 401: invalid_client):

1. **Vérifiez votre ID client** : Assurez-vous que vous avez remplacé toutes les occurrences de `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` dans `login.html` par votre véritable ID client OAuth.

2. **Vérifiez les origines autorisées** : L'URL depuis laquelle vous accédez à votre application doit être exactement la même que celle configurée dans la console Google Cloud. Si vous utilisez `http://localhost:5500` avec Live Server, assurez-vous que cette origine est autorisée.

3. **Délai d'activation** : Parfois, les nouvelles configurations d'API Google nécessitent jusqu'à 10 minutes pour être activées. Attendez quelques minutes et réessayez.

4. **Mode Incognito** : Essayez d'accéder à votre application en mode navigation privée/incognito pour éviter des problèmes de cache ou de cookies.

### Dépannage de l'erreur "redirect_uri_mismatch"

Si vous voyez cette erreur, cela signifie que l'URI de redirection utilisée ne correspond pas à celles configurées :

1. **Déterminez l'URL exacte** que vous utilisez pour accéder à votre application. Par exemple:
   - `http://127.0.0.1:5500/exercices/html-css/css/exo7/v2/login.html`
   - `http://localhost:5500/exercices/html-css/css/exo7/v2/login.html`

2. **Ajoutez cette URL exacte** dans la console Google Cloud:
   - Allez sur la [Console Google Cloud](https://console.cloud.google.com/) > APIs & Services > Credentials
   - Modifiez votre ID client OAuth 2.0 existant
   - Ajoutez cette URL complète dans la section "URIs de redirection autorisées"
   - Enregistrez les modifications

3. **Important** : Les changements dans la console Google Cloud peuvent prendre jusqu'à 5-10 minutes pour se propager. Attendez quelques minutes avant de réessayer.

## Détails de l'authentification

### Méthodes de connexion

1. **Connexion standard** :
   - Utilisateur : `admin` / Mot de passe : `admin` (accès administrateur)
   - Utilisateur : `user` / Mot de passe : `user` (accès standard)

2. **Connexion Google** :
   - Utilise la nouvelle API Google Identity Services
   - Mise en œuvre de One Tap et du bouton de connexion
   - Vérification JWT et extraction des informations utilisateur

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
- Layout imbriqués avec grilles à l'intérieur de grilles

## Structure des fichiers

- `login.html` - Page d'authentification
- `index.html` - Structure du tableau de bord
- `css/base/` - Styles de base et normalisation
- `css/components/` - Styles des composants individuels
- `css/layout/` - Styles des layouts et structures
- `components/auth.js` - Gestion de l'authentificationpq.apps.googleusercontent.com


















<!-- Supprimez vos identifiants OAuth de ce fichier -->- Opera 60+- Edge 79+- Safari 12+- Firefox 63+- Chrome 70+## Compatibilité navigateur- **Google Identity Services** - Pour l'authentification Google- **Font Awesome** - Pour les icônes- **Chart.js** - Pour la visualisation de données## Bibliothèques externes- `components/script.js` - Logique principale et initialisation- `components/widgets.js` - Gestion et interaction des widgetsCode client : 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