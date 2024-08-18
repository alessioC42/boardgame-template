import {
  isAdjacentToBoard,
  isAdjacent,
  getNeighbourCoordinates,
} from "../cascadia"
export function scoring() {}

function getNeighbourAnimals(board, coordinates) {
  let neighbourCoordinates = getNeighbourCoordinates(coordinates)
  let animals = []
  for (let nC of neighbourCoordinates) {
    if (board[nC[0]][nC[1]].occupiedBy != null) {
      animals.push(board[nC[0]][nC[1]].occupiedBy)
    }
  }

  return animals
}
