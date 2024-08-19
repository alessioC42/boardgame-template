import { getNeighbourCoordinates } from "../cascadia"
import {
  getNeighbourAnimals,
  countAnimalList,
  getNeighbourAnimalsOfType,
  addCoordsToListIfNotAlreadyInList,
} from "./scoring"

export const foxConditions = [
  {
    title: "Benachbarte Tierart",
    calculate: (board) => {
      let points = 0
      for (let x = 0; x < board[0].length; x++) {
        for (let y = 0; y < board[1].length; y++) {
          if (board[x][y].occupiedBy.displayName == "Fuchs") {
            let neighbourAnimals = getNeighbourAnimals(board, [x, y])
            neighbourAnimals = neighbourAnimals.filter(
              (item) => item.displayName != "Fuchs"
            )
            let counts = countAnimalList(neighbourAnimals)
            let foxCount = 0
            for (let neighbourAnimal in counts) {
              if (foxCount < counts[neighbourAnimal]) {
                foxCount = counts[neighbourAnimal]
              }
            }
            points += foxCount
          }
        }
      }
      return points
    },
  },
]

export const bearConditions = [
  {
    title: "Paare",
    calculate: (board) => {
      let pairCounts = 0
      for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
          if (board[x][y].occupiedBy.displayName == "Bär") {
            let neighbourAnimals = getNeighbourAnimals(board, [x, y])
            if (countAnimalList(neighbourAnimals)["Bär"] == 1) {
              let possibleCoords = getNeighbourCoordinates([x, y])
              for (let coordinates of possibleCoords) {
                const [pX, pY] = coordinates
                if (board[pX][pY].occupiedBy.displayName != "Bär") continue
                let animalList = getNeighbourAnimals(board, coordinates)
                let counts = countAnimalList(animalList)
                if (counts["Bär"] == 1) {
                  pairCounts += 1
                }
              }
            }
          }
        }
      }
      pairCounts = pairCounts / 2
      switch (pairCounts) {
        case 0:
          return 0
        case 1:
          return 4
        case 2:
          return 11
        case 3:
          return 19
        default:
          return 27
      }
    },
  },
]

export const bussardConditions = [
  {
    title: "Einzelgänger",
    calculate: (board) => {
      let foundBussards = 0
      for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
          if (board[x][y].occupiedBy.displayName == "Bussard") {
            let neighbourAnimals = getNeighbourAnimals(board, [x, y])
            let bussardInList = false

            for (let neighbourAnimal of neighbourAnimals) {
              if (neighbourAnimal.displayName == "Bussard") {
                bussardInList = true
                break
              }
            }
            if (bussardInList) break
            foundBussards += 1
          }
        }
      }
      let victoryPointScale = [0, 2, 5, 8, 11, 14, 18, 22, 26]

      return foundBussards > 8 ? 26 : victoryPointScale[foundBussards]
    },
  },
]

export const fishConditions = [
  {
    title: "Formationen",
    calculate: (board) => {
      let victoryPoints = 0
      for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
          if (board[x][y].occupiedBy.displayName == "Lachs") {
            let coordsInChain = [[x, y]]

            let running = true

            while (running) {
              let chainLengthBeforeIteration = coordsInChain.length
              for (const coords of coordsInChain) {
                let neighbourFishes = getNeighbourAnimalsOfType(
                  board,
                  coords,
                  "Lachs"
                )
                let fishCount = neighbourFishes.length

                if (fishCount > 2) {
                  running = false
                  break
                }
                if ([1, 2].includes(fishCount)) {
                  for (let newNeighbourCords of neighbourFishes) {
                    addCoordsToListIfNotAlreadyInList(
                      coordsInChain,
                      newNeighbourCords
                    )
                  }
                }
              }

              if (chainLengthBeforeIteration == coordsInChain.length) break
            }
            let victoryPointScale = [0, 2, 5, 8, 12, 16, 20, 25]
            victoryPoints +=
              coordsInChain.length > 7
                ? 25
                : victoryPointScale[coordsInChain.length]
          }
        }
      }
      return victoryPoints
    },
  },
]
