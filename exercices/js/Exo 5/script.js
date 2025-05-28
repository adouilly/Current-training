const tableau = [1, 2, 3, 4, 5];

// Affiche le tableau en mode "tableau visuel"
console.table(tableau);

const chiffres = [];

chiffres.push(10);
chiffres.push(20);
chiffres.push(30);

console.log("Après push :");
console.table(chiffres); // affiche sous forme de tableau indexé

const supprimé = chiffres.shift();

console.log("Élément supprimé :", supprimé);
console.log("Après suppression :");
console.table(chiffres);
