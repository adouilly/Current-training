const prenom = 'John';
const nom = 'Doe';
const nameGirl = 'Alice';
let nomComplet = `${prenom} ${nom}`;
const subject = ' le chat';
const eat = 'mange';
let meal = 'une souris';
let numberSeven = 7;
let numberTwo = 2;
let result;
let tab = [1, 2, 3, 4, 5];
let chiottes = [];

const mealSubject = `${subject} ${eat} ${meal}`;
// console.log(mealSubject);

//Fonction de salutation : Écrivez une fonction nommée saluer qui prend le nom "Alice" en tant que paramètre et renvoie une chaîne de salutation personnalisée. Par exemple, elle doit renvoyer "Bonjour, Alice!".

function salutation(name) {
  return `bonjour, ${name}`;
}
salutation(nameGirl);
// console.log(salutation(nameGirl));

//Fonction de multiplication : Écrivez une fonction nommée multiplication qui prend les nombres 7 et 8 en tant que paramètres et renvoie leur produit.
function multiply(a, b) {
  return a * b;
}
multiply(numberTwo, numberSeven);
// console.log(multiply(numberSeven, numberTwo));

// Création et affichage d'un tableau : Écrivez un programme qui crée un tableau avec les nombres 1, 2, 3, 4, 5, puis affiche chaque élément du tableau dans la console.,

// Ajout et suppression d'éléments d'un tableau : Écrivez un programme qui crée un tableau vide, ajoute les nombres 10, 20, 30 à ce tableau à l'aide de la méthode push(), puis supprime le premier élément à l'aide de la méthode shift().
tab.push(20, 30, 40);

tab.shift();

chiottes.push('brosse');

chiottes.shift();
