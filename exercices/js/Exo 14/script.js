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