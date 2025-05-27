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

let prenom = "John";
let nom = "Doe";

let nomComplet = `${prenom} ${nom}`;
console.log("Nom complet :", nomComplet);

let sujet = "Le chat";
let verbe = "mange";
let objet = "la souris";

let phrase = `${sujet} ${verbe} ${objet}`;
console.log("Phrase :", phrase);
