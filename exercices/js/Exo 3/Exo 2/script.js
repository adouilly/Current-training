// Redéfinir console.log pour afficher dans la page aussi
(function () {
  const divConsole = document.getElementById('consoleVirtuelle');
  const oldLog = console.log;

  console.log = function (...args) {
    // Afficher dans la vraie console
    oldLog.apply(console, args);

    // Afficher dans la page
    const ligne = document.createElement('div');
    ligne.textContent = args.join(' ');
    divConsole.appendChild(ligne);
  };
})();

// Exemple : toutes tes opérations de base
let a = 5, b = 3;
console.log("Addition :", a + b);

let x = 10, y = 7;
console.log("Soustraction :", x - y);

let m = 4, n = 6;
console.log("Multiplication :", m * n);

let d1 = 20, d2 = 4;
console.log("Division :", d1 / d2);

let r1 = 20, r2 = 6;
console.log("Modulo :", r1 % r2);
