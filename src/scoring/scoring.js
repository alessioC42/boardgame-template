import {
  isAdjacentToBoard,
  isAdjacent,
  getNeighbourCoordinates,
} from "../cascadia"
export function scoring() {}

export function getNeighbourAnimals(board, coordinates) {
  let neighbourCoordinates = getNeighbourCoordinates(coordinates)
  let animals = []
  for (let nC of neighbourCoordinates) {
    if (board[nC[0]][nC[1]].occupiedBy != null) {
      animals.push(board[nC[0]][nC[1]].occupiedBy)
    }
  }

  return animals
}

export function getNeighbourAnimalsOfType(board, coordinates, displayName) {
  let result = []
  let neighbourCoordinates = getNeighbourCoordinates(coordinates)
  for (let nC of neighbourCoordinates) {
    const [x, y] = nC
    if (board[x][y].displayName == displayName) {
      result.push(coordinates)
    }
  }
  return result
}

export function countAnimalList(list) {
  let counts = {}
  for (let animal of list) {
    if (counts[animal.displayName] == undefined) {
      counts[animal.displayName] = 0
    }
    counts[animal.displayName] += 1
  }
  return counts
}

export function addCoordsToListIfNotAlreadyInList(list, coords) {
  for (let item of list) {
    if (item[0] == coords[0] && item[1] == item[1]) {
      return
    }
  }
  list.push(coords)
  return list
}
