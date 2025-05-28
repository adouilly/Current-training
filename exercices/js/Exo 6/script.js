let data = {
  "id": "0001",
  "type": "donut",
  "name": "Cake",
  "ppu": 0.55,
  "batters": {
    "batter": [
      { "id": "1001", "type": "Rick" },
      { "id": "1002", "type": "Chocolate" },
      { "id": "1003", "type": "Blueberry" },
      { "id": "1004", "type": "Devil's Food" }
    ]
  },
  "topping": [
    { "id": "5001", "type": "None" },
    { "id": "5002", "type": "Glazed" },
    { "id": "5005", "type": "Morty" },
    { "id": "5007", "type": "helloWorld" },
    { "id": "5006", "type": "Chocolate with Sprinkles" },
    { "id": "5003", "type": "Chocolate" },
    { "id": "5004", "type": "Maple" }
  ]
};

// 1. Affichez le nom
console.log("Nom :", data.name);

// 2. Affichez le ppu
console.log("PPU :", data.ppu);

// 3. Affichez le contenu de topping
console.log("Toppings :", data.topping);

// 4. Affichez le type pour l'id 1004
console.log(data.batters.batter[3].type);

// 5. Affichez le type pour l'id 5004
console.log(data.topping[6].type);


// 6. Affichez l'id 5001
console.log(data.topping[0].id);

// 7. Rick est l'id 1001
let batter1001 = data.batters.batter[0].type + " est l'id " + data.batters.batter[0].id;
console.log(batter1001);

// 8. Concaténez le type de l'id 5004 avec le nom "Cake"
let topping5004 = data.name + " est l'id " + data.topping[6].id;
console.log(topping5004);



