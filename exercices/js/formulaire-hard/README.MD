Formulaire Multi-étapes / Multi-step Form
Description / Description
Ce projet est un formulaire de demande de devis multi-étapes avec un design moderne de type "glassmorphism". Il offre une expérience utilisateur fluide avec validation en temps réel, sauvegarde automatique des données et plusieurs fonctionnalités avancées.

This project is a multi-step quote request form with a modern "glassmorphism" design. It offers a smooth user experience with real-time validation, automatic data saving, and several advanced features.

Fonctionnalités / Features
Interface multi-étapes / Multi-step interface

Navigation intuitive entre les étapes / Intuitive navigation between steps
Barre de progression visuelle / Visual progress bar
Animations de transition fluides / Smooth transition animations
Validation avancée / Advanced validation

Validation en temps réel des champs / Real-time field validation
Messages d'erreur contextuels / Contextual error messages
Validation des formats (email, téléphone, etc.) / Format validation (email, phone, etc.)
Persistance des données / Data persistence

Sauvegarde automatique dans le localStorage / Automatic saving to localStorage
Restauration des données à la reconnexion / Data restoration on reconnection
Préservation du contenu en cas de rafraîchissement / Content preservation on refresh
Personnalisation et accessibilité / Customization and accessibility

Design responsive pour tous les appareils / Responsive design for all devices
Support WCAG 2.1 AA / WCAG 2.1 AA support
Optimisé pour les lecteurs d'écran / Optimized for screen readers
Sécurité renforcée / Enhanced security

Protection anti-bots / Anti-bot protection
Prévention des injections XSS / XSS injection prevention
Protection CSRF / CSRF protection
Limitation de débit / Rate limiting

Structure du projet / Project structure
formulaire-hard/
│
├── index.html          # Structure HTML principale / Main HTML structure
├── styles.css          # Styles principaux / Main styles
├── reset.css           # Reset CSS / CSS reset
├── script.js           # Logique principale du formulaire / Main form logic
├── validators.js       # Validateurs de champs / Field validators
└── README.md           # Documentation / Documentation

Technologies utilisées / Technologies used
HTML5
CSS3 (Flexbox, Grid, Variables CSS, Animations)
JavaScript vanilla (ES6+)
localStorage API
Fetch API
Mesures de sécurité / Security measures
Le formulaire intègre plusieurs couches de sécurité pour protéger contre les attaques courantes :

1. Protection anti-bots / Anti-bot protection
Champ honeypot caché pour détecter les soumissions automatisées
Validation côté client et côté serveur
2. Protection contre les injections / Injection protection
Échappement HTML pour toutes les entrées utilisateur
Validation de format stricte pour chaque type de champ
3. Protection CSRF / CSRF protection
Tokens CSRF uniques générés pour chaque session
Validation du token à chaque soumission
4. Limitation de débit / Rate limiting
Limitation du nombre de soumissions par période
Protection contre les attaques par force brute
5. Gestion sécurisée des erreurs / Secure error handling
Messages d'erreur génériques pour ne pas révéler d'informations sensibles
Journalisation des erreurs côté serveur

Installation / Installation
Clonez ce dépôt / Clone this repository
git clone [url-du-depot]

Ouvrez le fichier index.html dans votre navigateur ou utilisez un serveur local Open index.html in your browser or use a local server

Personnalisation / Customization
Modification des couleurs / Color modification
Le projet utilise des variables CSS pour faciliter la personnalisation. Modifiez les valeurs dans la section :root du fichier styles.css.

The project uses CSS variables for easy customization. Modify the values in the :root section of the styles.css file.

Ajout/Suppression d'étapes / Adding/Removing steps
Pour ajouter une étape, créez une nouvelle section avec la classe form-step et un attribut data-step, puis ajoutez les champs nécessaires.

To add a step, create a new section with the form-step class and a data-step attribute, then add the necessary fields.

Accessibilité / Accessibility
Le formulaire est conçu pour être accessible selon les normes WCAG 2.1 niveau AA :

Structure sémantique HTML / Semantic HTML structure
Contraste des couleurs approprié / Appropriate color contrast
Attributs ARIA / ARIA attributes
Navigation au clavier / Keyboard navigation
Support des lecteurs d'écran / Screen reader support
Mode préféré réduit de mouvement / Reduced motion preference mode
Performance / Performance
Le formulaire est optimisé pour des performances rapides :

CSS et JavaScript minifiés / Minified CSS and JavaScript
Utilisation minimale de librairies externes / Minimal use of external libraries
Lazy loading des ressources / Lazy loading of resources
Optimisation des animations / Animation optimization
Licence / License
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

This project is licensed under the MIT License. See the LICENSE file for more details.