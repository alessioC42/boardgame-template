import {
  drawHex,
  drawHexByOwnCoordinates,
  drawOccupyingAnimal,
  drawHexOutlineByOwnCoordinates,
} from "./draw_hex"
import { config } from "./config"
import { isAdjacentToBoard } from "../cascadia"

// eslint-disable-next-line no-unused-vars
export function render(state, ctx, resetOnClicks, client) {
  // remove everything
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, config.boardWidth, config.boardHeight)

  let chooseFromOfferingAndPlaceOnBoardState = {
    selectedOffering: null,
    newHexCoordinates: null,
  }

  const renderedHexCallback = (hex) => {
    console.log(hex.coordinates)
    if (hex.occupiedBy != null) return
    if (
      chooseFromOfferingAndPlaceOnBoardState.selectedOffering == null ||
      chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates == null
    )
      return
    let selectedAnimal =
      state.G.offering[chooseFromOfferingAndPlaceOnBoardState.selectedOffering]
        .animal

    if (
      !hex.validAnimals.some(
        (item) => item.displayName == selectedAnimal.displayName
      )
    ) {
      alert("You killed your animal.")
      client.moves.chooseFromOfferingAndPlaceOnBoard(
        chooseFromOfferingAndPlaceOnBoardState.selectedOffering,
        chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates,
        hex.rotation,
        hex.coordinates,
        false
      )
      return
    }
    client.moves.chooseFromOfferingAndPlaceOnBoard(
      chooseFromOfferingAndPlaceOnBoardState.selectedOffering,
      chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates,
      hex.rotation,
      hex.coordinates,
      true
    )
  }

  resetOnClicks()
  //renders board on canvas
  for (let x = 0; x < state.G.boards["0"].length; x++) {
    for (let y = 0; y < state.G.boards["0"].length; y++) {
      if (state.G.boards["0"][x][y] !== null) {
        drawHexByOwnCoordinates(ctx, state.G.boards["0"][x][y], () =>
          renderedHexCallback(state.G.boards["0"][x][y])
        )
      } else if (isAdjacentToBoard(state.G.boards["0"], [x, y])) {
        drawHexOutlineByOwnCoordinates(ctx, [x, y], () => {
          if (chooseFromOfferingAndPlaceOnBoardState.selectedOffering == null) {
            alert("No offering selected")
            return
          }
          if (
            chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates != null
          ) {
            return
          }

          //copy object
          let newHex = JSON.parse(
            JSON.stringify(
              state.G.offering[
                chooseFromOfferingAndPlaceOnBoardState.selectedOffering
              ].cell
            )
          )
          //render new cell
          newHex.coordinates = [x, y]
          drawHexByOwnCoordinates(
            ctx,
            newHex,
            () => renderedHexCallback(newHex),
            true
          )
          chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates =
            newHex.coordinates
        })
      }
    }
  }

  //renders Offering on canvas
  let dimension = 100

  for (let i = 0; i < 4; i++) {
    console.log(state.G.offering.length)
    try {
      drawHex(ctx, state.G.offering[i].cell, 100 + i * dimension, 100, () => {
        if (chooseFromOfferingAndPlaceOnBoardState.selectedOffering != null) {
          render(state, ctx, resetOnClicks, client)
        } else {
          chooseFromOfferingAndPlaceOnBoardState.selectedOffering = i
          ctx.beginPath()
          ctx.fillStyle = "rgba(150, 150, 150, 0.3)"
          ctx.rect(100 + i * dimension - config.hexRadius, 0, 100, 250)
          ctx.fill()
        }
      })
    } catch (e) {
      console.error(e)
      console.log(state)
      console.log(state.G)
      console.log(state.G.offering)
      console.log(state.G.offering[i])
    }

    ctx.translate(100 + i * dimension, 200)
    drawOccupyingAnimal(ctx, state.G.offering[i].animal)
    ctx.translate(-(100 + i * dimension), -200)
  }
}
