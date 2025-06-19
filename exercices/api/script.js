// Récupérer le conteneur
const gridCharacters = document.querySelector('.grid-characters');

// Fonction pour récupérer et afficher les personnages
async function fetchCharacters() {
    try {
        // Récupérer d'abord les informations sur la première page pour connaître le nombre total de pages
        const firstPageResponse = await fetch('https://rickandmortyapi.com/api/character');
        const firstPageData = await firstPageResponse.json();
        
        // Afficher les personnages de la première page
        firstPageData.results.forEach(character => {
            const characterDiv = document.createElement('div');
            characterDiv.className = 'character-card';
            
            characterDiv.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <h3>${character.name}</h3>
            `;
            
            gridCharacters.appendChild(characterDiv);
        });
        
        // Récupérer le nombre total de pages
        const totalPages = firstPageData.info.pages;
        
        // Parcourir les pages restantes (à partir de la page 2)
        for (let page = 2; page <= totalPages; page++) {
            const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
            const data = await response.json();
            
            // Afficher les personnages de cette page
            data.results.forEach(character => {
                const characterDiv = document.createElement('div');
                characterDiv.className = 'character-card';
                
                characterDiv.innerHTML = `
                    <img src="${character.image}" alt="${character.name}">
                    <h3>${character.name}</h3>
                `;
                
                gridCharacters.appendChild(characterDiv);
            });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des personnages:', error);
    }
}

// Appeler la fonction au chargement de la page
fetchCharacters();
