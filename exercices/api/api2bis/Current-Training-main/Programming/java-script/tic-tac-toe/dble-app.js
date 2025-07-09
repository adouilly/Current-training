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

let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

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

cells.forEach((cell) => {
    cell.addEventListener('click', () => {
        const index = parseInt(cell.getAttribute('data-index'));

        // Si case déjà prise ou jeu terminé, on ne fait rien
        if (gameBoard[index] !== '' || !gameActive) return;

        // Jouer le coup
        gameBoard[index] = currentPlayer;
        updateCell(cell, currentPlayer); // Affiche l'image

        // Vérifier la victoire
        if (checkWin()) {
            message.textContent = `Le joueur ${currentPlayer} a gagné !`;
            gameActive = false; // Bloque le jeu
            highlightWinningCells(); // Optionnel : mettre en évidence les cases gagnantes
            return;
        }

        // Vérifier le match nul
        if (!gameBoard.includes('')) {
            message.textContent = 'Match nul !';
            gameActive = false;
            return;
        }

        // Passer au joueur suivant
        currentPlayer = currentPlayer === 'X' ? 'Y' : 'X';
    });
});

function highlightWinningCells() {
    for (const combo of winCombos) {
        const [a, b, c] = combo;
        if (
            gameBoard[a] &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {
            combo.forEach((index) => {
                cells[index].style.backgroundColor = 'lightgreen'; // Surlignage vert
            });
            break; // On arrête après avoir trouvé la combinaison gagnante
        }
    }
}

function updateCell(cell, playerSymbol) {
    cell.innerHTML = `<img src="${player[playerSymbol]}" alt="Joueur ${playerSymbol}">`;
}

restartButton.addEventListener('click', () => {
    // Réinitialiser les variables
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X'; // 'X' commence toujours

    // Nettoyer l'affichage
    cells.forEach((cell) => {
        cell.innerHTML = '';
        cell.style.backgroundColor = ''; // Retire le surlignage
    });
    message.textContent = '';
});
const scores = { X: 0, Y: 0 }; // Stocke les scores

// Dans checkWin(), après la victoire :
scores[currentPlayer]++;
updateScoreDisplay();

// Fonction pour afficher les scores
function updateScoreDisplay() {
    document.getElementById('scorePlayerOne').textContent = scores.X;
    document.getElementById('scorePlayerTwo').textContent = scores.Y;
}
