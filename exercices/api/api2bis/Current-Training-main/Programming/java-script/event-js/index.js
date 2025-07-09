/*************************DEMOS***************************/

//const carre = document.getElementById('test');
// const body = document.body

// function changeSize(elem,w,h){
//     const carre = document.getElementById(elem);

//     carre.addEventListener("click", () => {
//     carre.style.backgroundColor = "yellow";
//     carre.style.width = w + "px";
//     carre.style.height = h + "px";

// })
// }

// changeSize("test", 300, 500)
// changeSize("demo2", 600, 10)

// carre.addEventListener("click", () => {
//     carre.style.backgroundColor = "yellow";
//     carre.style.width = w + "px";
//     carre.style.height = h + "px";

// })

//--------------------------------------------------------/
/*********************EXOS************************** */
//--------------------------------------------------------/

const title = document.querySelector('h3');
const cursorBlue = document.querySelector('.cursorBlue');
const cursorDarkBlue = document.querySelector('.cursorDarkBlue');

title.addEventListener('click', (e) => {
  title.classList.toggle('colorEffect');
  title.classList.toggle('loupEffect');
  console.log(e);
});

window.addEventListener('mousemove', (e) => {
  cursorBlue.style.top = e.pageY + 'px';
  cursorBlue.style.left = e.pageX + 'px';

  cursorDarkBlue.style.top = e.pageY + 'px';
  cursorDarkBlue.style.left = e.pageX + 'px';
});
