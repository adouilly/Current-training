const containerGrid = document.querySelector('.containerGrid'); // container images

fetch('https://rickandmortyapi.com/api/character')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    for (let index = 1; index <= data.info.pages; index++) {
      fetch(`https://rickandmortyapi.com/api/character?page=${index}`)
        .then((response) => response.json())
        .then((data) => {
          data.results.forEach((element) => {
            //nom du personnage
            const nom = element.name;

            // Créer une div pour créer une carte personnage
            const divName = document.createElement('div');

            divName.style.padding = '15px';
            divName.style.textAlign = 'center';

            // Ajouterla div dans le containerGrid
            containerGrid.appendChild(divName);
            //créer un paragraphe qui sera l'enfant de la div

            const paragrapherName = document.createElement('p');
            // Ajouter le texte du nom dans la balise p
            paragrapherName.textContent = nom;

            paragrapherName.classList.add('name');
            divName.appendChild(paragrapherName);

            // image correspondat au personnage
            const image = element.image;
            //creation div pour la photo du personnage
            const divImage = document.createElement('img');
            divImage.style.padding = '5px';

            // liens de l'image
            divImage.src = image;
            //divImage enfant de la divName
            divName.appendChild(divImage);
          });
        });
    }
  });
