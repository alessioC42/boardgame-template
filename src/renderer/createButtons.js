import { ctx, onClick } from "../canvas"
import { config } from "./config"
import { drawOccupyingAnimal } from "./draw_hex"
import { cards, renderVictoryConditionCard} from "./victory_condition_cards"

export function createPlayerFieldButtons(
  stateCtx,
  player,
  isOwnPlayer,
  callback
) {
  let isActivePlayer = stateCtx.currentPlayer == stateCtx.playOrder[player]

  ctx.beginPath()
  ctx.fillStyle = "rgba(150, 150, 150, 0.7)"
  ctx.rect(50, config.boardHeight - player * 75 - 150, 50, 50)
  if (isOwnPlayer) {
    ctx.strokeStyle = "black"
    ctx.stroke()
  }
  ctx.fill()
  ctx.closePath()

  ctx.fillStyle = isActivePlayer ? "yellow" : "black"
  ctx.font = "30px serif"
  ctx.textAlign = "center"
  ctx.fillText(
    `${stateCtx.playOrder[player]}`,
    75,
    config.boardHeight - player * 75 - 117.5
  )

  onClick(50, config.boardHeight - player * 75 - 150, 50, 50, callback)
}
export function createPlayerFieldButtonsForEachPlayer(
  stateCtx,
  ownPlayerID,
  callback
) {
  for (let i = stateCtx.playOrder.length - 1; i >= 0; i--) {
    createPlayerFieldButtons(stateCtx, i, ownPlayerID == i, () =>
      callback(stateCtx.playOrder[i])
    )
  }
}

export function createVictoryConditionButtons(ctx, cardNumber, rerender) {
  ctx.beginPath()
  ctx.fillStyle = "rgba(150, 150, 150, 0.7)"
  ctx.rect(config.boardWidth-cardNumber*75-100, 25, 50, 50)

  ctx.fill()
  ctx.closePath()

  ctx.translate(config.boardWidth-cardNumber*75-100+25, 50)
  drawOccupyingAnimal(ctx, cards[cardNumber].animal)
  ctx.translate(-(config.boardWidth-cardNumber*75-100+25), -50)

  let onlyDelete = true
  onClick(config.boardWidth - cardNumber * 75 - 100, 25, 50, 50, () => {
  
    if (onlyDelete) {
      renderVictoryConditionCard(ctx, cards[cardNumber])
      onlyDelete = false
    }
    
    onClick(0, 0, config.boardWidth, config.boardHeight, () => {
      rerender()
    })
  })
}

export function animalExchangeButtonIfThree(ctx, callback) {
  let xPosition = config.boardWidth / 3 - 60
  let yPosition = 50
  ctx.beginPath()
  ctx.fillStyle = "rgba(150, 150, 150, 0.7)"
  ctx.rect(xPosition, yPosition, 75, 75)

  ctx.fill()
  ctx.closePath()


  ctx.fillStyle = "black"
  ctx.font = "25px serif"
  ctx.textAlign = "center"
  ctx.fillText(
    `${"redo"}`,
    xPosition+40,
    yPosition+40
  )


  onClick(xPosition, yPosition, 75, 75, callback)
}