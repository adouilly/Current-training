// 1 - Création d'une variable age
let age;

// 2 - Affectation d'une valeur à cette variable
age = 19;

// 3 - Création d'une constante majeur avec la valeur 18
const majeur = 18;

// 4 - Affichage dans la console : est-ce que l'âge est supérieur à la majorité ?
console.log(age > majeur);

const checkbox = document.getElementById('checkMajeur');
const bouton = document.getElementById('verifier');
const ageInput = document.getElementById('ageInput');
const form = document.getElementById('formulaireInscription');
const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const emailInput = document.getElementById('email');
const verifierBtn = document.getElementById('verifier');
const envoyerBtn = form.querySelector('button[type="submit"]');

// Affichage du message de vérification
verifierBtn.addEventListener('click', function(e) {
  e.preventDefault();
  const age = parseInt(ageInput.value, 10);

  if (isNaN(age)) {
    alert("⚠️ Veuillez entrer un âge valide.");
    return;
  }

  if (age >= 18) {
    checkbox.checked = true;
    alert("Parfait, vous êtes majeur.");
  } else {
    checkbox.checked = false;
    alert("Vous n'avez rien à faire ici, revenez quand vous aurez 18 ans");
  }
});

// Empêche la case d'être cochée si < 18 et coche auto si >= 18
ageInput.addEventListener('input', function() {
  const age = parseInt(this.value, 10);
  checkbox.checked = !isNaN(age) && age >= 18;
  checkbox.disabled = isNaN(age) || age < 18;
  saveFormToLocalStorage();
});

// Empêche la case d'être cochée manuellement si < 18
checkbox.addEventListener('click', function(e) {
  const age = parseInt(ageInput.value, 10);
  if (isNaN(age) || age < 18) {
    e.preventDefault();
  }
});

// Sauvegarde les champs dans le localStorage à chaque saisie
[nomInput, prenomInput, emailInput, ageInput].forEach(input => {
  input.addEventListener('input', saveFormToLocalStorage);
});

// Sauvegarde l'état du formulaire
function saveFormToLocalStorage() {
  const data = {
    nom: nomInput.value,
    prenom: prenomInput.value,
    email: emailInput.value,
    age: ageInput.value
  };
  localStorage.setItem('formulaireInscription', JSON.stringify(data));
}

// Restaure l'état du formulaire au chargement
function restoreFormFromLocalStorage() {
  const data = localStorage.getItem('formulaireInscription');
  if (data) {
    const obj = JSON.parse(data);
    nomInput.value = obj.nom || '';
    prenomInput.value = obj.prenom || '';
    emailInput.value = obj.email || '';
    ageInput.value = obj.age || '';
    // Déclenche l'event input pour mettre à jour la checkbox
    ageInput.dispatchEvent(new Event('input'));
  }
}
restoreFormFromLocalStorage();

// Bouton envoyer : recharge la page
form.addEventListener('submit', function(e) {
  e.preventDefault();
  localStorage.removeItem('formulaireInscription');
  location.reload();
});

