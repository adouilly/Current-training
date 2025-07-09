const winCombos = [
  [0, 1, 2], // ligne 1
  [3, 4, 5], // ligne 2
  [6, 7, 8], // ligne 3
  [0, 3, 6], // colonne 1
  [1, 4, 7], // colonne 2
  [2, 5, 8], // colonne 3
  [0, 4, 8], // diagonale principale
  [2, 4, 6] // diagonale secondaire
];
const case0 = document.getElementById('C0');
const case1 = document.getElementById('C1');
const case2 = document.getElementById('C2');
const case3 = document.getElementById('C3');
const case4 = document.getElementById('C4');
const case5 = document.getElementById('C5');
const case6 = document.getElementById('C6');
const case7 = document.getElementById('C7');
const case8 = document.getElementById('C8');

let gameBoard = ['', '', '', '', '', '', '', '', ''];
let matchNull = document.getElementById('matchNull');
let counterHandleClick = 0;
let isTurnLocked = false;

let winner = false;
let scoreX = 0;
let scoreY = 0;
let reStartButton = document.getElementById('startGame');
let startNewGame = document.getElementById('newGame');
//**********joueur principal
let currentPlayer = 'X';

//*********images des joueurs
const player = {
  X: 'images/playerX.png',
  Y: 'images/playerY.png'
};

//**********élèments du Dom

const cells = document.querySelectorAll('.cell');
// console.log('nombre de cases trouvées :', cells.length);//9

const message = document.getElementById('matchNull');
const restartButton = document.getElementById('newGame');
let combo;

//parcourir chaque case et lui ajouter un écouteur clic
cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const index = cell.getAttribute('data-index');
    // console.log('cas cliquée ! index :', index);

    //comptage des clics
    if (counterHandleClick == 9 || winner == true) {
      return;
    }

    //vérifier si cas vide
    if (gameBoard[index] !== '') {
      return; // case déjà jouée, on sort
    } //si cellule strictement différente de vide on ne fait rien, donc si déjà remplie
    //image pour chaque joueur en utilisant la variable dynamique cuurentPlayer
    counterHandleClick++;
    matchOver();
    cell.style.backgroundImage = `url("${player[currentPlayer]}")`;
    gameBoard[index] = currentPlayer;

    //1er ligne----------------------
    if (
      gameBoard[0] === currentPlayer &&
      gameBoard[1] === currentPlayer &&
      gameBoard[2] === currentPlayer
    ) {
      winner = true;
      document.querySelector('[data-index="0"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="1"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="2"]').style.backgroundColor =
        'var(--color2)';
      counterPoint();
    }

    //2éme ligne----------------------

    if (
      gameBoard[3] === currentPlayer &&
      gameBoard[4] === currentPlayer &&
      gameBoard[5] === currentPlayer
    ) {
      winner = true;
      document.querySelector('[data-index="3"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="4"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="5"]').style.backgroundColor =
        'var(--color2)';
      counterPoint();
    }

    //3émeligne----------------------
    if (
      gameBoard[6] === currentPlayer &&
      gameBoard[7] === currentPlayer &&
      gameBoard[8] === currentPlayer
    ) {
      winner = true;
      document.querySelector('[data-index="6"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="7"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="8"]').style.backgroundColor =
        'var(--color2)';
      counterPoint();
    }

    //4émeligne----------------------
    if (
      gameBoard[0] === currentPlayer &&
      gameBoard[3] === currentPlayer &&
      gameBoard[6] === currentPlayer
    ) {
      winner = true;
      document.querySelector('[data-index="0"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="3"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="6"]').style.backgroundColor =
        'var(--color2)';
      counterPoint();
    }

    //5émeligne----------------------
    if (
      gameBoard[1] === currentPlayer &&
      gameBoard[4] === currentPlayer &&
      gameBoard[7] === currentPlayer
    ) {
      winner = true;
      document.querySelector('[data-index="1"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="4"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="7"]').style.backgroundColor =
        'var(--color2)';
      counterPoint();
    }

    //6émeligne----------------------
    if (
      gameBoard[2] === currentPlayer &&
      gameBoard[5] === currentPlayer &&
      gameBoard[8] === currentPlayer
    ) {
      winner = true;
      document.querySelector('[data-index="2"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="5"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="8"]').style.backgroundColor =
        'var(--color2)';
      counterPoint();
    }

    //7émeligne----------------------
    if (
      gameBoard[0] === currentPlayer &&
      gameBoard[4] === currentPlayer &&
      gameBoard[8] === currentPlayer
    ) {
      winner = true;
      document.querySelector('[data-index="0"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="4"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="8"]').style.backgroundColor =
        'var(--color2)';
      counterPoint();
    }

    //8émeligne----------------------
    if (
      gameBoard[2] === currentPlayer &&
      gameBoard[4] === currentPlayer &&
      gameBoard[6] === currentPlayer
    ) {
      winner = true;
      document.querySelector('[data-index="2"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="4"]').style.backgroundColor =
        'var(--color2)';
      document.querySelector('[data-index="6"]').style.backgroundColor =
        'var(--color2)';

      counterPoint();
    }

    //changement de joueur
    if (winner === false) {
      if (currentPlayer === 'X') {
        currentPlayer = 'Y';
      } else {
        currentPlayer = 'X';
      }
    }
  }); //fin 1er if
}); //fin 1er if

function counterPoint() {
  if (currentPlayer === 'X') {
    scoreX++;
    document.getElementById('score-x').textContent = scoreX;
    matchNull.textContent = `cross wins`;
    matchNull.style.color = `red`;
    console.log(scoreX);
  } else {
    scoreY++;
    document.getElementById('score-y').textContent = scoreY;
    console.log(scoreX);
    matchNull.textContent = `ball wins`;
    matchNull.style.color = `red`;
    console.log(scoreY);
  }
} // ✅ OK
/**
 * fonction permettant d'établir le matchNull
 */
function matchOver() {
  if (counterHandleClick === 9 && winner === false) {
    matchNull.textContent = 'draw';
    matchNull.style.color = 'red';
  }
}

reStartButton.addEventListener('click', () => {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  cells.forEach((cell) => {
    cell.style.backgroundImage = '';
    cell.style.backgroundColor = '';
  });
  counterHandleClick = 0;
  winner = false;
});

startNewGame.addEventListener('click', () => {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  cells.forEach((cell) => {
    cell.style.backgroundImage = '';
    cell.style.backgroundColor = '';
    scoreX = 0;
    document.getElementById('score-x').textContent = scoreX;
    scoreY = 0;
    document.getElementById('score-y').textContent = scoreY;
    winner = false;
    counterHandleClick = 0;
    currentPlayer = 'X';
    matchNull.textContent = 'cross starts';
  });
});
