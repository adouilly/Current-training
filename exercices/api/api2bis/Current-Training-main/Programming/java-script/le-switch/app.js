// const day = prompt('choisissez votre jour de reservation');
// const dayMenu = document.querySelector('.menuJour');

// switch (day) {
//   case 'lundi':
//     dayMenu.textContent = 'Spaghetti Bolognaise';
//     console.log('lundi');

//     return;
//   case 'mardi':
//     dayMenu.textContent = 'Poulet Rôti';
//     console.log('mardi');

//     return;

//   case 'mercredi':
//     dayMenu.textContent = 'Risoto aux saint-jacques';
//     console.log();

//     return;

//   case 'jeudi':
//     dayMenu.textContent = 'poisson pané';

//     return;
//   case 'vendredi':
//     dayMenu.textContent = 'salade composée';

//     return;
//   case 'samedi':
//     dayMenu.textContent = 'Pizza Margherita';
//     return;
//   case 'dimanche':
//     dayMenu.textContent = 'fermé';
//     return;

//   default:
//     dayMenu.textContent =
//       "merci de bien vouloir nous recontacter aux heures d'ouverture";
//     return;
//
// let month = 'Janvier';
// let today = new Date();

//------------------------------------------------------------------------
//*******************exo n°2******************************************** */
//-------------------------------------------------------------------------

//Écrivez une fonction qui prend en entrée un mois (1 pour janvier, 2 pour février, etc.) et retourne le nombre de jours dans ce mois. Assurez-vous de gérer correctement le cas de février pour les années bissextiles (29 jours) et non bissextiles (28 jours).

// function additionDay(month) {
//   switch (month) {
//     case 'Janvier':
//       console.log('il y a 31 jours');
//       return 31;
//     case 'Février':
//       console.log('il y a 28 ou 29 jours');
//       return 28;
//     case 'Mars':
//       console.log('il y a 31 jours');
//       return 31;
//     case 'Avril':
//       console.log('il y a 30 jours');
//       return 30;
//     case 'Mai':
//       console.log('il y a 31 jours');
//       return 31;
//     case 'Juin':
//       console.log('il y a 30 jours');
//       return 30;
//     case 'Juillet':
//       console.log('il y a 31 jours');
//       return 31;
//     case 'Août':
//       console.log('il y a 31 jours');
//       return 31;
//     case 'Septembre':
//       console.log('il y a 30 jours');
//       return 30;
//     case 'Octobre':
//       console.log('il y a 31 jours');
//       return 31;
//     case 'Novembre':
//       console.log('il y a 30 jours');
//       return 30;
//     case 'Décembre':
//       console.log('il y a 31 jours');
//       return 31;
//     default:
//       console.log('Mois non reconnu ou format incorrect.');
//       break;
//   }
// }

// additionDay('Février');

// correction de l'excercie précèdent :Écrivez une fonction qui prend en entrée un mois (1 pour janvier, 2 pour février, etc.) et retourne le nombre de jours dans ce mois. Assurez-vous de gérer correctement le cas de février pour les années bissextiles (29 jours) et non bissextiles (28 jours).

function combienDeJourDansLeMois(a) {
  switch (a) {
    case 1:
      console.log('Le mois de janvier comporte 31 jours');
      return 31;

    case 2:
      let year = new Date();
      console.log('Le mois de février comporte 28 ou 29 jours');

      if (
        (year.getFullYear % 4 === 0 && year.getFullYear % 100 > 0) ||
        year.getFullYear % 400 === 0
      ) {
        console.log('on est sur une année bissextile');
        return 29;
      } else {
        console.log("ce n'est pas une année bissextile");
        return 28;
      }

    case 3:
      console.log('Le mois de mars comporte 31 jours');
      return 31;

    case 4:
      console.log('Le mois de avril comporte 30 jours');
      return 30;

    case 5:
      console.log('Le mois de mai comporte 31 jours');
      return 31;

    case 6:
      console.log('Le mois de juin comporte 30 jours');
      return 30;

    case 7:
      console.log('Le mois de juillet comporte 31 jours');
      return 31;

    case 8:
      console.log('Le mois de août comporte 31 jours');
      return 31;

    case 9:
      console.log('Le mois de septembre comporte 30 jours');
      return 30;

    case 10:
      console.log('Le mois de octobre comporte 31 jours');
      return 31;

    case 11:
      console.log('Le mois de novembre comporte 30 jours');
      return 30;

    case 12:
      console.log('Le mois de décembre comporte 31 jours');
      return 31;

    default:
      console.log(
        "Le mois sélectionner n'est pas disponible, veuillez entrer un nombre entre 1 et 12"
      );
      break;
  }
}

let nombreDeJour = combienDeJourDansLeMois(2);
console.log(nombreDeJour);
