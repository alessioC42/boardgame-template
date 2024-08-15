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
      boards[player] = createInitialBoard()
    }
    let animalStack = intitialAnimals()
    let hexStack = initialHexCells()

    let pineCones = {}
    for (let player of foo.ctx.playOrder) {
      pineCones[player] = 2
    }

    let offering = []
    for (let i = 0; i < 4; i++){
      offering.push({
        cell: hexStack.pop(),
        animal: animals.bear//animalStack.pop()
      })
    }
    return { boards, animalStack, hexStack, offering, pineCones, }
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
            function (animal) {
              return animal == lastAnimal
            }, G)
          return G
        }
      }
      return INVALID_MOVE
    },
    usePineConeForAnimalExchange: ({ G, playerID }, changeIndeces) => {
      if (G.pineCones[playerID] < 1) {
        return INVALID_MOVE
      }
      changeOfferingsWhere((_animal, index) => index in changeIndeces, G)
      G.pineCones[playerID] -= 1
    },
    /**
     * offeringIndex=4 when `usePineConeForCustomChoice` is used before
     */
    chooseFromOfferingAndPlaceOnBoard: ({ G, playerID }, offeringIndex, coordinatesHexPlacement, hexRotation, coordiantesAnimalPlacement, placeAnimal) => {
      const[newHexX, newHexY] = coordinatesHexPlacement
      if (!isAdjacentToBoard(G.boards[playerID], coordinatesHexPlacement)) return INVALID_MOVE

      let chosenOffering = G.offering.pop(offeringIndex)
      G.boards[playerID][newHexX][newHexY] = chosenOffering.cell
      G.boards[playerID][newHexX][newHexY].coordinates = coordinatesHexPlacement

      G.boards[playerID][newHexX][newHexY].rotation = hexRotation

      if (!placeAnimal) return G
      
      if (!canAnimalBePlaced(G.boards[playerID], coordiantesAnimalPlacement, chosenOffering.animal)) return G
      
      G.boards[playerID][newHexX][newHexY].occupiedBy = chosenOffering.animal
      
      if (G.boards[playerID][newHexX][newHexY].validAnimals.length === 1) {
        G.pineCones[playerID] += 1
      }

      return G
    },
    usePineConeForCustomChoice: ({ G, playerID }, hexIndex, animalIndex) => {
      if (G.pineCones[playerID] < 1 || hexIndex > 3 || animalIndex > 3) {
        return INVALID_MOVE
      }

      let animal, cell

      //hex
      cell = G.offering[hexIndex].cell
      G.offering[hexIndex].cell = G.hexStack.pop()

      //animal
      animal = G.offering[animal].animal
      G.offering[animal].animal = G.animalStack.pop()

      G.offering[4] = { animal, cell }

      return G
    }
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
  ensureNoOverpopulation(G)
}

function ensureNoOverpopulation(G) {
  while (G.offering[0].animal == G.offering[1].animal && G.offering[2].animal == G.offering[3].animal && G.offering[1].animal == G.offering[2].animal) {
    changeOfferingsWhere(() => true, G)
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


function createHexCell(biomeA, biomeB, validAnimals, rotation = 0, occupiedBy = null, coordinates = null) {
  return {biomeA, biomeB, validAnimals, rotation, occupiedBy, coordinates}
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

function createInitialBoard() {
  let board = []
  for (let x = 0; x < 50; x++) {
    board[x] = []
    for (let y = 0; y < 50; y++) {
      board[x][y] = null
    }
  }
  board[24][24] = createHexCell(biomes.forest, biomes.desert, [animals.deer, animals.bear], 0, null, [24,24])
  board[25][24] = createHexCell(biomes.water, biomes.mountains, [animals.deer, animals.bear], 0, null, [25,24])
  board[25][23] = createHexCell(biomes.forest, biomes.forest, [animals.deer], 0, null, [25,23])

}

function isAdjacentToBoard(board, coordinates) {
  for (let row of board){
    for (let item of row) {
      if (item.coordinates == coordinates) {
        return false
      }
      if (item == null) {
        continue
      }
      if (isAdjacent(item.coordinates, coordinates)) {
        return true
      }
    }
  }
  return false
}

function canAnimalBePlaced(board, coordinates, animal) {
  const [x, y] = coordinates
  if (board[x][y] == null) return false

  return board[x][y].validAnimals.includes(animal)
}

function isAdjacent(coordinatesA, coordinatesB) {
  let xDistance = coordinatesA[0] - coordinatesB[0]
  let yDistance = coordinatesA[1] - coordinatesB[1]

  if (Math.abs(xDistance) > 1 && Math.abs(yDistance) > 1) {
    return false
  }
  if ((xDistance > 0 && yDistance > 0) || (xDistance < 0 && yDistance < 0)) {
    return false
  }
  return true
}