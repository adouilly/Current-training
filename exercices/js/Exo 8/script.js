// Exemple d'utilisation

verifAge(12);

function verifAge(age) {
  if (age >= 18) {
    console.log("Vous êtes majeur");
  } else {
    console.log("Vous êtes mineur");
  }
}

levelVerif(15);

function levelVerif(level) {
  if (level >= 10) {
    console.log("Vous avez un bon niveau");
  } else {
    console.log("Vous devez vous entraîner");
  }
}

function verifAge(age) {
  if (age >= 18) {
    return "Vous êtes majeur";
  } else {
    return "Vous êtes mineur";
  }
}

function levelVerif(level) {
  if (level >= 10) {
    return "Vous avez un bon niveau";
  } else {
    return "Vous devez vous entraîner";
  }
}

// Exemple d'utilisation
console.log(verifAge(12));
console.log(levelVerif(15));