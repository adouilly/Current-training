const btnBurger = document.querySelector('#burger');
const btnCross = document.querySelector('#cross');
const sideBar = document.querySelector('.sideBar');

btnBurger.addEventListener('click', () => {
  sideBar.classList.toggle('play');
  btnCross.classList.toggle('place');
});

btnCross.addEventListener('click', () => {
  sideBar.classList.remove('play');
  btnCross.classList.remove('place');
  document.body.classList.remove('no-scroll');
});
