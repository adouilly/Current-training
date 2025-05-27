// Affichage de la date et heure actuelles
console.log("Date et heure actuelles :", new Date().toLocaleString());

// Boucle de 1 à 5
for (let i = 1; i <= 5; i++) {
    console.log("Nombre :", i);
}

// Table de multiplication par 3
let n = 3;
for (let i = 1; i <= 10; i++) {
    console.log(`${n} x ${i} = ${n * i}`);
}

// Vérification si un nombre est pair ou impair
let nombre = 7;
if (nombre % 2 === 0) {
    console.log(nombre, "est pair");
} else {
    console.log(nombre, "est impair");
}

// Fonction pour inverser une chaîne
function inverser(texte) {
    return texte.split('').reverse().join('');
}
console.log(inverser("Javascript"));

// Génération d'un nombre aléatoire
let alea = Math.floor(Math.random() * 100) + 1;
console.log("Nombre aléatoire :", alea);

// Parcours d'un tableau de fruits
let fruits = ["pomme", "banane", "cerise"];
fruits.forEach(fruit => console.log(fruit));

// Recherche du maximum dans un tableau
let nombres = [12, 5, 8, 130, 44];
console.log("Max :", Math.max(...nombres));

// Fonction pour compter les voyelles
function compterVoyelles(texte) {
    return (texte.match(/[aeiouy]/gi) || []).length;
}
console.log("Voyelles :", compterVoyelles("Bonjour à tous !"));

// Timer de 2 secondes
setTimeout(() => {
    console.log("2 secondes se sont écoulées !");
}, 2000);