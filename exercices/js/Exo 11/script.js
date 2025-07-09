// === INITIALISATION DU JEU ===
// Math.random() génère un nombre décimal entre 0 (inclus) et 1 (exclus)
// * 100 donne un nombre entre 0 et 99.999...
// Math.floor() arrondit vers le bas (supprime les décimales)
// + 1 décale la plage de 1-100 au lieu de 0-99
const nombreSecret = Math.floor(Math.random() * 100) + 1;

// Compteur pour suivre le nombre de tentatives de l'utilisateur
let nombreEssais = 0;

// Variable booléenne pour contrôler la boucle while
// false = le nombre n'est pas encore trouvé, continuer la boucle
// true = nombre trouvé, sortir de la boucle
let devine = false;

// Afficher un message d'accueil à l'utilisateur
alert("Bienvenue dans le jeu de devinette ! Vous devez deviner un nombre entre 1 et 100.");

// === BOUCLE PRINCIPALE DU JEU ===
// La boucle while continue tant que devine = false
// Dès que l'utilisateur trouve le bon nombre, devine devient true et la boucle s'arrête
while (!devine) {
    // Demander à l'utilisateur de saisir un nombre
    // prompt() retourne une chaîne de caractères ou null si annulé
    let valeur = prompt('Veuillez entrer une valeur entre 1 et 100 :');
    
    // === GESTION DE L'ANNULATION ===
    // Si l'utilisateur clique sur "Annuler", prompt() retourne null
    if (valeur === null) {
        alert("Jeu annulé !");
        break; // Sortir immédiatement de la boucle while
    }

    // === CONVERSION ET VALIDATION ===
    // parseInt() convertit la chaîne en nombre entier
    // Si la chaîne ne peut pas être convertie, parseInt() retourne NaN
    let nombreSaisi = parseInt(valeur);
    
    // Incrémenter le compteur d'essais
    nombreEssais++;

    // Vérifier si l'entrée est valide
    // isNaN() vérifie si la valeur n'est pas un nombre
    // Vérifier aussi si le nombre est dans la plage 1-100
    if (isNaN(nombreSaisi) || nombreSaisi < 1 || nombreSaisi > 100) {
        alert("Veuillez entrer un nombre valide entre 1 et 100 !");
        nombreEssais--; // Décrémenter car ce n'est pas un essai valide
        continue; // Retourner au début de la boucle sans exécuter le reste
    }

    // === LOGIQUE DE COMPARAISON ===
    // Comparer le nombre saisi avec le nombre secret
    if (nombreSaisi === nombreSecret) {
        // VICTOIRE : le nombre est trouvé
        devine = true; // Ceci va arrêter la boucle while
        // Afficher un message de félicitations avec le nombre d'essais
        alert(`Félicitations ! Vous avez trouvé le nombre ${nombreSecret} en ${nombreEssais} essai(s) !`);
    } else if (nombreSaisi < nombreSecret) {
        // Le nombre saisi est trop petit
        alert("Trop petit ! Essayez un nombre plus grand.");
    } else {
        // Le nombre saisi est trop grand (nombreSaisi > nombreSecret)
        alert("Trop grand ! Essayez un nombre plus petit.");
    }
    
    // La boucle continue automatiquement si devine est toujours false
}

// === FIN DU SCRIPT ===
// Le script se termine quand :
// 1. L'utilisateur trouve le bon nombre (devine = true)
// 2. L'utilisateur annule le jeu (break dans le if valeur === null)
