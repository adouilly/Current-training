// Console virtuelle - redirige console.log vers la page HTML aussi
(function () {
  const divConsole = document.getElementById('consoleVirtuelle');
  const oldLog = console.log;

  // Fonction pour échapper les caractères HTML pour éviter les injections (sécurité)
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  console.log = function (...args) {
    // Affiche dans la vraie console
    oldLog.apply(console, args);

    // Formate les arguments en chaîne sécurisée
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');

    // Crée un élément div pour la ligne, échappe le contenu et ajoute un saut de ligne
    const ligne = document.createElement('div');
    ligne.innerHTML = escapeHtml(message);

    divConsole.appendChild(ligne);

    // Scroll automatique vers le bas pour voir la dernière ligne
    divConsole.scrollTop = divConsole.scrollHeight;
  };
})();