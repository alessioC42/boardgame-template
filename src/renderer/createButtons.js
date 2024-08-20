import { ctx, onClick } from "../canvas"
import { config } from "./config"

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
