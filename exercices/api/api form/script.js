function createUser(firstName) {
  fetch('https://685a75c19f6ef96111567e0e.mockapi.io/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prenom: firstName,
    })
  })
 .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    alert(`Utilisateur créé avec succès : ${JSON.stringify(data)}`);
  })
  .catch((error) => {
    console.error('Erreur:', error);
    alert('Erreur lors de la création de l\'utilisateur');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const prenomInput = document.getElementById('firstName');
    if (!prenomInput) {
      console.error('Élément firstName non trouvé');
      return;
    }
    
    const firstName = prenomInput.value;
    console.log('Formulaire soumis avec prénom:', firstName);
    
    if (firstName.trim()) {
      createUser(firstName);
    } else {
      alert('Veuillez saisir un prénom');
    }
  });
});