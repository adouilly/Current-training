// Exercice 1 : Récupération des éléments HTML
const bouton = document.getElementById('monBouton');
const paragraphe = document.getElementById('monParagraphe');

// Exercice 1 : Ajout d'un écouteur d'événement sur le bouton
bouton.addEventListener('click', function() {
    paragraphe.textContent = 'Hello, world!';
});

// Exercice 2 : Récupération des éléments pour le changement de style
const boutonCouleur = document.getElementById('boutonCouleur');
const paragrapheTexte = document.getElementById('paragrapheTexte');

// Exercice 2 : Changement de couleur au clic
boutonCouleur.addEventListener('click', function() {
    paragrapheTexte.style.color = 'red';
});

// Exercice 3 : Récupération des éléments pour la création d'éléments
const boutonAjouter = document.getElementById('boutonAjouter');
const maListe = document.getElementById('maListe');

// Exercice 3 : Création et ajout d'un nouvel élément de liste
boutonAjouter.addEventListener('click', function() {
    // Créer un nouvel élément <li>
    const nouvelElement = document.createElement('li');
    
    // Ajouter le texte à l'élément
    nouvelElement.textContent = 'Nouvel élément';
    
    // Ajouter l'élément à la liste
    maListe.appendChild(nouvelElement);
});

// Exercice 4 : Récupération des éléments pour la suppression
const boutonSupprimer = document.getElementById('boutonSupprimer');

// Exercice 4 : Suppression du premier élément de la liste
boutonSupprimer.addEventListener('click', function() {
    const premierElement = maListe.firstElementChild;
    if (premierElement) {
        premierElement.remove();
    }
});

// Exercice 5 : Gestion d'événements multiples (version optimisée)
const boutonsIds = ['bouton1', 'bouton2', 'bouton3'];

// Fonction gestionnaire d'événements unique
function gestionnaireClick(event) {
    console.log(`Vous avez cliqué sur le bouton avec l'ID: ${event.target.id}`);
}

// Ajout du gestionnaire à tous les boutons en une boucle
boutonsIds.forEach(id => {
    const bouton = document.getElementById(id);
    bouton.addEventListener('click', gestionnaireClick);
});