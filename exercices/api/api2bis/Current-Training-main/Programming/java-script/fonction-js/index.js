//Créez une fonction qui prend en entrée l'âge d'une personne et affiche "Majeur" si l'âge est supérieur ou égal à 18, sinon affichez "Mineur".

//if est une structure de contrôle-----------

function majorite(age) {
  if (age >= 18) {
    console.log('majeur');
  } else {
    console.log('mineur');
  }
}

majorite(44);

function verifAge(age) {
  if (age >= 18) {
    return 'majeur';
  } else {
    return 'mineur';
  }
}

let verif = verifAge(18);
console.log(verif);

//---------------------Boucle for ---------------------
//Affichez les nombres pairs de 1 à 20 en utilisant une boucle for.exemple cous de structure for  :
// let tab = ['Bordeaux', 'Montpellier', 'Toulouse', 'Dunkerque'];
// console.log(tab.length);

// let mot = '';
// console.log(tab[0].length);

// for (let i = 0; i < tab[0].length; i = i + 1) {
//   mot += tab[0][i];
//   console.log(mot);
// }

// let tab = [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
// ];
// let numberIndex = 0;
// let baseIndex = -1;

// for (baseIndex; baseIndex < tab.length; baseIndex += 2) {
//   numberIndex = tab[baseIndex];
//   break;
// }

let baseNumber = 2;
let pair = 0;

for (baseNumber; baseNumber <= 20; baseNumber += 2) {
  pair = baseNumber;
  //   console.log(pair);
}

// autre solution avec le modulo
for (let n = 1; n <= 20; n++) {
  if (n % 2 === 0) {
    // console.log(n);
  }
}
