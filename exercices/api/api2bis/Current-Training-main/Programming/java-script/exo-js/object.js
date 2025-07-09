//Affichez le nom
// Affichez le ppu
// Affichez le contenu de topping
// Affichez le type pour l'id 1004
// Affichez le type pour l'id 5004
// Affichez l'id 5001

// Concaténez l'id 1001 et le type Rick dans une phrase ("Rick est l'id 1001")
// Concaténez le type de l'id 5004 avec le name "cake" de la même manière que précédemment

let data = {
  id: '0001',
  type: 'donut',
  name: 'Cake',
  ppu: 0.55,
  batters: {
    batter: [
      { id: '1001', type: 'Rick' },
      { id: '1002', type: 'Chocolate' },
      { id: '1003', type: 'Blueberry' },
      { id: '1004', type: "Devil's Food" }
    ]
  },

  topping: [
    { id: '5001', type: 'None' },
    { id: '5002', type: 'Glazed' },
    { id: '5005', type: 'Morty' },
    { id: '5007', type: 'helloWorld' },
    { id: '5006', type: 'Chocolate with Sprinkles' },
    { id: '5003', type: 'Chocolate' },
    { id: '5004', type: 'Maple' }
  ]
};

console.log(data);
console.log(data.name);
console.log(data.ppu);
console.log(data.batters.batter[3]);
console.log(data.topping[6]);
console.log(data.topping[0]);

let part1 = data.batters.batter[0].type;
let part2 = data.batters.batter[0].id;

let phrase =
  data.batters.batter[0].type + " est l'id " + data.batters.batter[0].id;
console.log(phrase);

let phraseTwo = data.topping[6].type + " est l'id " + data.name;
console.log(phraseTwo);

let phraseThree = `${part1}  est l'id  ${part2}`;
console.log(phraseThree);

// Création et affichage d'un objet : Écrivez un programme qui crée un objet représentant une personne avec des propriétés telles que nom avec la valeur "Alice", age avec la valeur 25, ville avec la valeur "Paris", puis affiche les propriétés de cet objet dans la console.,

let identity = { nom: 'Alice', age: 26, ville: 'Paris' };
console.log(identity);

// Modification d'un objet : Écrivez un programme qui crée un objet représentant un compte bancaire avec des propriétés telles que solde avec la valeur 1000 et titulaire avec la valeur "John Doe", puis modifie le solde de ce compte en ajoutant la valeur 500.

let dataBanq = { soldeCompte: 1000, titulaire: 'Jhon Doe' };
console.log(dataBanq);
dataBanq.soldeCompte += 500;
console.log(dataBanq);
