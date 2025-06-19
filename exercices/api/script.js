// Récupérer le conteneur
const gridCharacters = document.querySelector('.grid-characters');

// Fonction pour afficher un personnage
function displayCharacter(character) {
    const characterDiv = document.createElement('div');
    characterDiv.className = 'character-card';
    
    characterDiv.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <h3>${character.name}</h3>
    `;
    
    gridCharacters.appendChild(characterDiv);
}

// Fonction récursive pour charger toutes les pages
function loadPage(pageNumber) {
    return fetch(`https://rickandmortyapi.com/api/character?page=${pageNumber}`)
        .then(response => response.json())
        .then(data => {
            // Afficher tous les personnages de cette page
            data.results.forEach(character => {
                displayCharacter(character);
            });
            
            // Si ce n'est pas la dernière page, charger la suivante
            if (pageNumber < data.info.pages) {
                return loadPage(pageNumber + 1);
            }
        });
}

// Fonction pour récupérer et afficher les personnages
function fetchCharacters() {
    loadPage(1).catch(error => {
        console.error('Erreur lors de la récupération des personnages:', error);
    });
}

// Appeler la fonction au chargement de la page
fetchCharacters();
