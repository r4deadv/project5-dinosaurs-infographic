// Get data from JSON
async function getData() {
  const response = await fetch("./dino.json");
  const res = await response.json();
  return res.Dinos;
}

// Create a Creature parent class
class Creature {
  constructor(species, weight, height, diet) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.fact = null;
  }
}
// Create Dino Constructor
class Dino extends Creature {
  constructor(species, weight, height, diet, where, when, fact) {
    super(species, weight, height, diet);
    this.where = where;
    this.when = when;
    super.fact = fact;
  }
}

// Create Human constructor
class Human extends Creature {
  constructor(species, weight, height, diet) {
    super(species, weight, height, diet);
  }
}

// Create Dino Compare Method 1 height
// NOTE: Weight in JSON file is in lbs, height in inches.
function compareHeight(dinoHeight, humanHeight, dinoName) {
  const ratio = dinoHeight / humanHeight;
  const ratio2 = humanHeight / dinoHeight;
  if (ratio === 1) {
    return `You and ${dinoName} have the same height.`;
  } else if (ratio > 1) {
    return `The ${dinoName} is ${ratio.toFixed(1)} times taller than you.`;
  } else {
    return `You are ${ratio2.toFixed(1)} times taller than ${dinoName}.`;
  }
}

// Create Dino Compare Method 2 weight
// NOTE: Weight in JSON file is in lbs, height in inches.
function compareWeight(dinoWeight, humanWeight, dinoName) {
  const ratio = dinoWeight / humanWeight;
  const ratio2 = humanWeight / dinoWeight;

  if (ratio === 1) {
    return `You and ${dinoName} are the same weight.`;
  } else if (ratio > 1) {
    return `The ${dinoName} is ${ratio.toFixed(1)} times heavier than you.`;
  } else {
    return `You are ${ratio2.toFixed(1)} times heavier than ${dinoName}.`;
  }
}

// Create Dino Compare Method 3 diet
// NOTE: Weight in JSON file is in lbs, height in inches.
function compareDiet(dinoDiet, humanDiet, dinoName) {
  if (dinoDiet === humanDiet) {
    return `You and ${dinoName} eat the same things.`;
  } else {
    return `${dinoName} has different diet than you.`;
  }
}

//Get random number
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//Replace fact with other info or compare methods
function randomFact(
  dinoName,
  dinoHeight,
  humanHeight,
  dinoWeight,
  humanWeight,
  dinoDiet,
  humanDiet,
  dinoWhere,
  dinoWhen,
  dinoFact
) {
  switch (getRandomInt(1, 7)) {
    case 1:
      return compareHeight(dinoHeight, humanHeight, dinoName);
    case 2:
      return compareWeight(dinoWeight, humanWeight, dinoName);
    case 3:
      return compareDiet(dinoDiet, humanDiet, dinoName);
    case 4:
      return `${dinoName} lived in ${dinoWhere}.`;
    case 5:
      return `${dinoName} lived during ${dinoWhen} era.`;
    case 6:
      return dinoFact;
  }
}

// function onsubmit event on form - logic for hide form, draw grid, create dino object, create human object, append tiles on grid
function startMotor() {
  // Remove form from screen
  let form = document.getElementById("dino-compare");
  form.classList.add("hidden");
  event.preventDefault();

  // On button click, prepare and display infographic
  const grid = document.getElementById("grid");

  // parse data from JSON
  getData().then((res) => {
    // Create Dino Objects
    let dinoArr = res.map(
      (dino) =>
        new Dino(
          dino.species,
          Number(dino.weight),
          Number(dino.height),
          dino.diet,
          dino.where,
          dino.when,
          dino.fact
        )
    );

    // Use IIFE to get human data from form
    const human = (function () {
      const humanName = document.getElementById("name").value;
      const humanFeet = Number(document.getElementById("feet").value);
      const humanInches = Number(document.getElementById("inches").value);
      const humanHeight = Number(humanFeet * 12 + humanInches);
      const humanWeight = Number(document.getElementById("weight").value);
      const humanDiet = document.getElementById("diet").value.toLowerCase();

      // Create Human Object
      const humanObject = new Human(
        humanName,
        humanWeight,
        humanHeight,
        humanDiet
      );
      humanObject.fact = "You are human.";

      //   console.log(humanObject);
      return humanObject;
    })();

    //add human into dino array
    dinoArr.splice(4, 0, human);
    //console.log(dinoArr);

    //create grid with tiles
    dinoArr.forEach((dino, index) => {
      // Generate Tiles for each Dino in Array
      const tile = document.createElement("div");
      tile.classList.add("grid-item");

      const name = document.createElement("h3");
      const image = document.createElement("img");
      const fact = document.createElement("p");

      name.innerText = dino.species;

      if (index === 4) {
        image.setAttribute("src", `/images/human.png`);
      } else {
        image.setAttribute("src", `/images/${dino.species.toLowerCase()}.png`);
      }

      if (dino.species === "Pigeon") {
        fact.innerText = "All birds are Dinosaurs";
      } else if (index === 4) {
        fact.innerText = human.fact;
      } else {
        fact.innerText = randomFact(
          dino.species,
          dino.height,
          human.height,
          dino.weight,
          human.weight,
          dino.diet,
          human.diet,
          dino.where,
          dino.when,
          dino.fact
        );
        // console.log(
        //   `dino name: ${dino.species} dino height: ${dino.height} human height: ${human.height} dino weight: ${dino.weight} human weight: ${human.weight} dino diet: ${dino.diet} human diet: ${human.diet} dino where: ${dino.where} dino when :${dino.when} dino fact: ${dino.fact} `
        // );
      }

      // Add tiles to DOM
      tile.appendChild(name);
      tile.appendChild(image);
      tile.appendChild(fact);
      grid.appendChild(tile);
    });
  });
}

//click event replaced with onsubmit event
// document.getElementById("btn").addEventListener("click", startMotor);
