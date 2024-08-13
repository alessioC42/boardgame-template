import { animals } from "./models/animals";
import { biomes } from "./models/biomes";
import { INVALID_MOVE } from 'boardgame.io/core';

export const Cascadia = {
  // Tutorial things go here
  setup: function setup(foo) {
    console.log(foo)
    let boards = {}
    for (let player of foo.ctx.playOrder) {
      boards[player] = createEmptyBoard()
    }
    let animalStack = intitialAnimals()
    let hexStack = initialHexCells()

    let offering = []
    for (let i = 0; i < 4; i++){
      offering.push({
        cell: hexStack.pop(),
        animal: animalStack.pop()
      })
    }

    return { boards, animalStack, hexStack, offering }
  },
  
  moves: {
    changeAnimalOffering: ({ G }) => {
      let lastAnimal = null
      let counter
      for (let item of G.offering.concat(G.offering)) {
        if (lastAnimal = null) {
          lastAnimal = item.animal
          counter = 1
          continue
        }
        if (lastAnimal = item.animal) {
          counter += 1
        } else {
          lastAnimal = item.animal
          counter = 1
        }
        if (counter === 3) {
          changeOfferingsWhere(
            function (animal) {
              return animal === lastAnimal
            }, G)
          return G
        }
      }
      return INVALID_MOVE
    },
    
  }
};


function changeOfferingsWhere(validation, G) {
  killedAnimals = []
  for (let i = 0; i < 4; i++) {
    if (validation(G.offering[i].animal)) {
      killedAnimals.push(G.offering[i])
      G.offering[i] = G.animalStack.pop()
    }
  }
  G.animalStack = shuffle(G.animalStack.concat(killedAnimals))
}


function intitialAnimals() {
  let animalsStack = []
  for (let animal in animals) {
    animalsStack.concat(Array(20).fill(animal))
  }
  return shuffle(animalsStack)
}

function initialHexCells() {
  let cells = []
  cells.push(createHexCell(biomes.forest, biomes.water, [animals.deer, animals.bear]))
  cells.push(createHexCell(biomes.forest, biomes.desert, [animals.deer, animals.bear]))
  cells.push(createHexCell(biomes.water, biomes.mountains, [animals.deer, animals.bear]))
  cells.push(createHexCell(biomes.forest, biomes.forest, [animals.deer]))
  return shuffle(cells)
}

function createEmptyBoard() {
  let board = []

  for (let x = 0; x <= 50; x++) {
    board[x] = []
    for (let y = 0; y <= 50; y++) {
      board[x][y] = []
      for (let z = 0; z <= 50; z++) {
        board[x][y][z] = null
      }
    }
  }

  return board
}

function createHexCell(biomeA, biomeB, validAnimals, rotation = 0, occupiedBy = null) {
  return {biomeA, biomeB, validAnimals, rotation, occupiedBy}
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}