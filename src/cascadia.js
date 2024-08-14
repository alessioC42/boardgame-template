/** @import { Game } from "boardgame.io" */

import { animals } from "./models/animals";
import { biomes } from "./models/biomes";
import { INVALID_MOVE } from 'boardgame.io/core';

/**  @type {Game} */
export const Cascadia = {
  // Tutorial things go here
  setup: function setup(foo) {
    let boards = {}
    for (let player of foo.ctx.playOrder) {
      boards[player] = createEmptyBoard()
    }
    let animalStack = intitialAnimals()
    let hexStack = initialHexCells()

    let pineCones = {}
    for (let player of foo.ctx.playOrder) {
      pineCones[player] = 0
    }

    let offering = []
    for (let i = 0; i < 4; i++){
      offering.push({
        cell: hexStack.pop(),
        animal: animals.bear//animalStack.pop()
      })
    }
    return { boards, animalStack, hexStack, offering, pineCones}
  },
  
  moves: {
    changeAnimalOffering: ( {G} ) => {
      let lastAnimal = null
      let counter
      /*
      We take two times the same list and appand them on one another, 
      than we search three times the same number next to each other
      */
      for (let item of G.offering.concat(G.offering)) {
        if (lastAnimal == null) {
          lastAnimal = item.animal.toString()
          counter = 1
          continue
        }
        if (lastAnimal == item.animal) {
          counter += 1
        } else {
          lastAnimal = item.animal
          counter = 1
        }
        if (counter == 3) {
          changeOfferingsWhere(
            function (animal, _i) {
              return animal == lastAnimal
            }, G)
          return G
        }
      }
      return INVALID_MOVE
    },
    usePineConeForAnimalExchange: ({ G, playerID }, changeIndeces) => {
      if (pineCones[playerID] < 1) {
        return INVALID_MOVE
      }
      changeOfferingsWhere((_animal, index) => index in changeIndeces, G)
      pineCones[playerID] -= 1
    },
  }
};


function changeOfferingsWhere(validation, G) {
  let killedAnimals = []
  for (let i = 0; i < 4; i++) {
    if (validation(G.offering[i].animal, i)) {
      killedAnimals.push(G.offering[i])
      G.offering[i].animal = G.animalStack.pop()
    }
  }
  G.animalStack = shuffle(G.animalStack.concat(killedAnimals))
  ensureNoOverpopulation()
}

function ensureNoOverpopulation(G) {
  while (G.offering[0].animal == G.offering[1].animal && G.offering[2].animal == G.offering[3].animal && G.offering[1].animal == G.offering[2].animal) {
    changeOfferingsWhere((_animal, _i) => true, G)
  }
}

function intitialAnimals() {
  let animalsStack = []
  for (let animal in animals) {
    for (let i = 0; i < 20; i++) {
      animalsStack.push(animals[animal])
    }
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