# Dashboard Administratif Interactif

## Description
Ce projet est un tableau de bord administratif interactif, créé avec HTML, CSS et JavaScript. Il met en œuvre des fonctionnalités avancées de layout CSS Grid et de manipulation d'éléments par glisser-déposer.

## Fonctionnalités

- **Layout CSS Grid responsive** pour l'organisation des widgets
- **Fonctionnalité de glisser-déposer** pour réorganiser les widgets
- **Alternance entre différentes dispositions de grille** via les boutons de layout
- **Sidebar rétractable** pour maximiser l'espace de travail
- **Adaptation mobile** avec menu hamburger
- **Animations fluides** pour les transitions et interactions
- **Visualisation de données** avec Chart.js
- **Widgets dynamiques** pour statistiques, graphiques, tableaux et formulaires

## Techniques CSS avancées utilisées

- `grid-template-areas` pour définir des zones nommées
- `grid-template-columns` avec `fr`, `minmax()` et `auto-fill`
- CSS Variables (propriétés personnalisées) pour la thématisation
- Media queries pour le responsive design
- Transitions et animations CSS pour les retours visuels
- Layout imbriqués avec grilles à l'intérieur de grilles

## Structure des fichiers

- `index.html` - Structure du tableau de bord
- `styles.css` - Styles et mise en page
- `reset.css` - Reset CSS pour normaliser le style entre navigateurs
- `script.js` - Logique interactive et initialisation
- `components/data.js` - Données pour les widgets
- `components/chart.js` - Configuration et gestion des graphiques

## Bibliothèques externes

- **Chart.js** - Pour la visualisation de données
- **Font Awesome** - Pour les icônes

## Compatibilité navigateur

- Chrome 70+
- Firefox 63+
- Safari 12+
- Edge 79+
- Opera 60+