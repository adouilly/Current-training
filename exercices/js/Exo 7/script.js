// --- 1. Création et affichage d'un objet personne ---
let personne = {
  nom: "Alice",
  age: 25,
  ville: "Paris"
};

// Affichage des propriétés
console.log("Nom :", personne.nom);
console.log("Âge :", personne.age);
console.log("Ville :", personne.ville);

// --- 2. Création et modification d'un objet compte bancaire ---
let compteBancaire = {
  solde: 1000,
  titulaire: "John Doe"
};

// Modification du solde
compteBancaire.solde += 500; // Ajoute 500 au solde existant

// Affichage du nouveau solde
console.log("Titulaire :", compteBancaire.titulaire);
console.log("Nouveau solde :", compteBancaire.solde);
