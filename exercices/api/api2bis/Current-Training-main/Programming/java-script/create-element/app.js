const btn = document.createElement('button');
const paragrapher = document.createElement('p');
const containerButton = document.querySelector('.container-button');
const numberTwo = document.querySelector('.numberTwo');
const btnTwo = document.createElement('button');
const paragrapherTwo = document.createElement('p');
const btnThree = document.createElement('button');
const numberThree = document.querySelector('.numberThree');
const listing = document.querySelector('.listing');
let autorisation = true;
const numberFour = document.querySelector('.numberFour');
const btnFour = document.createElement('button');
const numberFive = document.querySelector('.numberFive');
const btnFive = document.createElement('button');
const btnSix = document.createElement('button');
const btnSeven = document.createElement('button');

//EXO
btn.textContent = 'BOUTON';

containerButton.appendChild(btn);
containerButton.appendChild(paragrapher);

btn.addEventListener('click', () => {
  paragrapher.textContent = 'Hello World !';
});

//EXO

btnTwo.textContent = 'BOUTON';
paragrapherTwo.textContent = "j'ai changé de couleur";
numberTwo.appendChild(btnTwo);
numberTwo.appendChild(paragrapherTwo);

btnTwo.addEventListener('click', () => {
  paragrapherTwo.style.color = 'red';
});

//EXO 3

numberThree.appendChild(btnThree);
btnThree.textContent = 'listing';
btnThree.addEventListener('click', () => {
  if (autorisation == true) {
    const liSup = document.createElement('li');
    listing.appendChild(liSup);
    liSup.textContent = 'nouveau';
    autorisation = false;
  }
});

//EXO 4

btnFour.textContent = 'disappaers';
numberFour.appendChild(btnFour);

btnFour.addEventListener('click', () => {
  disappears.style.visibility = 'hidden';
});

//Exo 5
btnFive.textContent = 'bouton 5';
btnSix.textContent = 'bouton 6';
btnSeven.textContent = 'bouton 7';
numberFive.append(btnFive, btnSix, btnSeven);

function pressDownMessage(pressBtn) {
  switch (pressBtn) {
    case btnFive:
      btnFive.addEventListener('click', () => {
        alert('bouton 5');
      });

      break;
    case btnSix:
      btnSix.addEventListener('click', () => {
        alert('bouton 6');
      });

      break;
    case btnSeven:
      btnSeven.addEventListener('click', () => {
        alert('bouton 7');
      });

      break;

    default:
      alert("vous n'avez appuyé sur aucun bouton !");
      break;
  }
}
pressDownMessage(btnFive);
pressDownMessage(btnSix);
pressDownMessage(btnSeven);
/*
autre possibilité :
function pressDownMessage(event) {
  alert(event.target.textContent);
}

btnFive.addEventListener('click', pressDownMessage);
btnSix.addEventListener('click', pressDownMessage);
btnSeven.addEventListener('click', pressDownMessage);
*/
