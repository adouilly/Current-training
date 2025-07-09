const words = [
  'apple',
  'banana',
  'grape',
  'orange',
  'peach',
  'house',
  'table',
  'chair',
  'window',
  'door',
  'happy',
  'smile',
  'laugh',
  'angry',
  'sleep',
  'school',
  'teacher',
  'student',
  'pencil',
  'paper',
  'water',
  'juice',
  'bread',
  'cheese',
  'pizza',
  'green',
  'blue',
  'red',
  'white',
  'black',
  'sun',
  'moon',
  'cloud',
  'rain',
  'storm',
  'cat',
  'dog',
  'bird',
  'horse',
  'sheep',
  'car',
  'truck',
  'train',
  'plane',
  'boat',
  'shirt',
  'pants',
  'shoes',
  'hat',
  'dress'
];

const stars = document.querySelectorAll('.container_stars img');
const beginBtn = document.getElementById('beginBtn');
const newBtn = document.getElementById('newBtn');
const secretWord = document.querySelector('#secretWord');
const keyPress = document.querySelectorAll('.touch');

let triesLeft = 12;
let currentWord;
let tableCurrentWord;
let correctCount = 0;

// Choix aléatoire du mot par le bouton "Let's go"
beginBtn.addEventListener('click', () => {
  // Réinitialisation des variables
  secretWord.textContent = '';
  triesLeft = 12;
  correctCount = 0;

  // Réinitialisation des étoiles
  stars.forEach((star) => {
    star.src = './assets/images/gold-star.png'; // ou l'image d'étoile normale
  });

  // Réinitialisation du clavier
  keyPress.forEach((key) => {
    key.classList.remove('inactive');
    key.style.color = 'var(--color2)';
    key.style.backgroundColor = 'initial';
  });

  // Sélection d'un nouveau mot
  randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];
  tableCurrentWord = currentWord.split('');

  // Affichage des points d'interrogation
  secretWord.textContent = '?'.repeat(tableCurrentWord.length);
});

// Click sur touches du clavier virtuel
keyPress.forEach((key) => {
  key.addEventListener('click', () => {
    if (key.classList.contains('inactive')) return;

    key.style.color = 'var(--color1)';
    key.style.backgroundColor = 'var(--color2)';
    key.classList.add('inactive');

    const pressLetter = key.textContent;
    let correctGuess = false;
    let positionLetter = secretWord.textContent.split('');

    // Vérification de la lettre dans le mot
    for (let index = 0; index < tableCurrentWord.length; index++) {
      if (tableCurrentWord[index] === pressLetter) {
        positionLetter[index] = pressLetter;
        correctGuess = true;
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
        setTimeout(() => alert('Bravo ! 🎉 Tu as gagné !'), 100);
        disableAllKeys();
      }
    } else {
      // Mauvaise lettre - éteindre une étoile
      const starIndex = 12 - triesLeft - 1;
      if (stars[starIndex]) {
        stars[starIndex].src = './assets/images/illustration-cornes.png';
      }

      triesLeft--;

      if (triesLeft === 0) {
        setTimeout(() => alert(`Perdu ! Le mot était : ${currentWord}`), 100);
        disableAllKeys();
      }
    }
  });
});

newBtn.addEventListener('click', () => {
  beginBtn.click(); // déclenche le même comportement que le bouton Let's Go
});

function disableAllKeys() {
  keyPress.forEach((key) => {
    key.classList.add('inactive');
    key.style.color = 'var(--color1)';
    key.style.backgroundColor = 'var(--color2)';
  });
}
