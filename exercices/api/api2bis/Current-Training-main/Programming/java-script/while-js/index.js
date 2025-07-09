// let valueNumber = 78; //type number
// let attemtps = 0;
// let maxAttemtps = 5;

// let message = parseInt(
//   prompt('veuillez rentrer le chiffre du jour, compris entre 1 et 100 :')
// ); //prompt est une fonction et message un objet mais si parseInt pour prompt message devient de type number
// console.log(message);

// //Demandez à l'utilisateur de deviner un nombre entre 1 et 100. Utilisez une boucle while pour permettre à l'utilisateur de saisir des nombres jusqu'à ce qu'il devine correctement.

// while (message !== valueNumber && attemtps < maxAttemtps - 1) {
//   attemtps++;
//   console.log(attemtps);

//   if (message !== valueNumber) {
//     alert('vous avez perdu');
//   }

//   message = parseInt(
//     prompt(`essayer de nouveau !  ${maxAttemtps - attemtps} essaies restants`)
//   );

//   console.log(maxAttemtps, message);
// }

// alert('vous avez gagné');

//***********************exo 2********************** */
// Compter de 1 à 10
// Objectif : Utiliser une boucle while pour afficher les nombres de 1 à 10 dans la console.
// let number = 1;

// while (number <= 10) {
//   console.log(number);
//   number++;
// }

//  Somme des nombres de 1 à 100
// Objectif : Calcule la somme des nombres de 1 à 100.tant que tout les chiffres entre 1 et 100 ne sont pas tous additionnés
let chiffre = 0;
let newChiffre = 0;

while (newChiffre <= 100) {
  newChiffre++;
  chiffre = chiffre + newChiffre;

  //   console.log(chiffre);
}

//  Deviner un nombre
// Objectif : Demander à l'utilisateur de deviner un nombre entre 1 et 10 jusqu'à ce qu’il trouve la bonne réponse.
let secretNumber = 6;
let devinette = parseInt(
  prompt('Devinez le chiffre magique compris entre 1 et 10')
);
let checkIn = true;

while (devinette !== secretNumber || devinette > 10) {
  devinette = parseInt(prompt('Recommencer'));
}

alert('vous avez trouvé!');

//  Entrée valide
// Objectif : Demander à l'utilisateur d'entrer "oui" ou "non" jusqu'à ce qu'il donne une réponse valide.

//  Afficher les nombres pairs jusqu’à un nombre donné
// Objectif : Demander un nombre à l'utilisateur et afficher tous les nombres pairs jusqu'à ce nombre.
