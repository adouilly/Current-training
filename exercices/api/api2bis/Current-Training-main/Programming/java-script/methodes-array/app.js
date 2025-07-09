const nombres = [1, 5, 12, 8, 130, 44];

nombres.forEach((nombre) => {
  console.log(nombre);
});

const newNombres = nombres.map(function (number) {
  return number * 2;
});

console.log(newNombres);
console.table(newNombres);

const heightNumbers = nombres.filter((number) => {
  return number >= 10;
});

console.log(heightNumbers);
