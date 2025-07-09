const wordsFrench = [
  'BONJOUR',
  'MERCI',
  'CHAT',
  'CHIEN',
  'MAISON',
  'VOITURE',
  'TABLE',
  'CHAISE',
  'LIVRE',
  'STYLO',
  'FENETRE',
  'PORTE',
  'LAMPE',
  'ECOLE',
  'BUREAU',
  'SALON',
  'PLAFOND',
  'RIDEAU',
  'MIROIR',
  'HORLOGE',
  'ORDINATEUR',
  'PORTABLE',
  'ECRAN',
  'CLAVIER',
  'SOURIS',
  'PHOTO',
  'FAMILLE',
  'ARGENT',
  'TRAVAIL',
  'REPOS',
  'VACANCES',
  'LOISIR',
  'DESSIN',
  'MUSIQUE',
  'DANSE',
  'FILM',
  'THEATRE',
  'CINEMA',
  'LECTURE',
  'CUISINE',
  'DESSERT',
  'REPAS',
  'DEJEUNER',
  'DINER',
  'PAIN',
  'FROMAGE',
  'FRUIT',
  'LEGUME',
  'VIANDE',
  'POISSON',
  'POULET',
  'GATEAU',
  'GLACE',
  'BOISSON',
  'EAU',
  'LAIT',
  'CAFE',
  'THE',
  'JUS',
  'ORANGE',
  'POMME',
  'BANANE',
  'FRAISE',
  'RAISIN',
  'CITRON',
  'SALADE',
  'SOUPE',
  'CREME',
  'BEURRE',
  'HUILE',
  'SEL',
  'POIVRE',
  'EPICE',
  'FLEUR',
  'PLANTE',
  'JARDIN',
  'ARBRE',
  'FORET',
  'MONTAGNE',
  'RIVIERE',
  'PLAGE',
  'NEIGE'
];

const stars = [...document.querySelectorAll('.container_stars img')]; //étoiles =tableau
console.log(stars);

const keyPress = [...document.querySelectorAll('.touch')]; // touches virtuelles clavier = tableau
console.log(keyPress);

const beginBtn = document.getElementById('beginBtn'); //bouton let's go
const newBtn = document.getElementById('newBtn'); //bouton newgame
const secretWord = document.querySelector('#secretWord'); // paragraphe mot
const imgPopup = document.querySelector('#imgPopup');
const textPopup = document.querySelector('#textPopup');
const popup = document.querySelector('#popup');
console.log(imgPopup);

let triesLeft = 12;
let currentWord;
let tableCurrentWord;
let correctCount = 0;

document.getElementById('closePopup').addEventListener('click', hidePopup);

// Choix aléatoire du mot par le bouton "Let's go"
beginBtn.addEventListener('click', () => {
  // Réinitialisation des variables
  secretWord.textContent = '';
  triesLeft = 12;
  correctCount = 0;

  //popup cachée

  //Réinitialisation des étoiles
  stars.forEach((star) => {
    star.src = './assets/images/gold-star.png'; // ou l'image d'étoile normale
  });

  // Réinitialisation du clavier
  keyPress.forEach((key) => {
    key.classList.remove('inactive');
    // key.style.color = 'var(--color2)';
    // key.style.backgroundColor = 'initial';
  });

  // Sélection d'un nouveau mot
  randomIndex = Math.floor(Math.random() * wordsFrench.length);
  currentWord = wordsFrench[randomIndex];
  tableCurrentWord = currentWord.split('');
  console.log(tableCurrentWord);

  // Affichage des points d'interrogation
  secretWord.textContent = '*'.repeat(tableCurrentWord.length);
});

// Click sur touches du clavier virtuel
keyPress.forEach((key) => {
  key.addEventListener('click', () => {
    if (!tableCurrentWord || !Array.isArray(tableCurrentWord)) return;
    key.classList.toggle('inactive');

    const pressLetter = key.textContent.toUpperCase();
    let correctGuess = false;
    let positionLetter = secretWord.textContent.split('');

    // Vérification de la lettre dans le mot
    for (let index = 0; index < tableCurrentWord.length; index++) {
      console.log(pressLetter, tableCurrentWord[index]);

      if (tableCurrentWord[index] === pressLetter) {
        positionLetter[index] = pressLetter;
        correctGuess = true;
        console.log(positionLetter);
      }
    }

    // Mise à jour du mot affiché
    secretWord.textContent = positionLetter.join('');

    if (correctGuess) {
      // Bonne lettre - ajout d'un smiley
      if (correctCount < stars.length) {
        stars[correctCount].src = './assets/images/smile.png';
        correctCount++;
      }

      // Vérification de la victoire
      if (secretWord.textContent === currentWord) {
        showPopup(true); // Affiche popup de victoire
        disableAllKeys();
      }
    } else {
      // Mauvaise lettre - éteindre une étoile
      const starIndex = 12 - triesLeft;
      if (stars[starIndex]) {
        stars[starIndex].src = './assets/images/cornes.png';
      }

      triesLeft--;

      if (triesLeft === 0 && secretWord.textContent !== currentWord) {
        showPopup(false); // Affiche popup de défaite
        disableAllKeys();
      }
    }
  });
});

newBtn.addEventListener('click', () => {
  hidePopup(); // Cache le popup
  beginBtn.click();
});

function disableAllKeys() {
  keyPress.forEach((key) => {
    key.classList.remove('inactive');
    // key.style.color = 'var(--color1)';
    // key.style.backgroundColor = 'var(--color2)';
  });
}

function showPopup(isWinner) {
  if (isWinner) {
    textPopup.textContent = 'Bravo tu as gagné !';
    imgPopup.src = './assets/images/smile.png';
  } else {
    textPopup.textContent = `Oups, tu as perdu ! Le mot était : ${currentWord}`;
    imgPopup.src = './assets/images/cornes.png';
  }
  popup.style.display = 'block';
}

function hidePopup() {
  popup.style.display = 'none';
}
