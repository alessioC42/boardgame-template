import { animals } from "../models/animals"
import { config } from "./config"
import { onClick } from "../canvas"

export function drawHex(ctx, hex, x, y, callback, isGrey = false) {
  ctx.translate(x, y)

  let translateRotation = (Math.PI / 3) * hex.rotation

  let grad = ctx.createLinearGradient(-config.hexRadius, 0, config.hexRadius, 0)
  grad.addColorStop(0, hex.biomeA.color)
  grad.addColorStop(1, hex.biomeB.color)

  ctx.rotate(translateRotation)
  ctx.beginPath()

  for (let i = 0; i < 6; i++) {
    // calculate the rotation
    const rotation = (Math.PI / 3) * i - Math.PI / 6

    // for the first point move to
    if (i === 0) {
      ctx.moveTo(
        config.hexRadius * Math.cos(rotation),
        config.hexRadius * Math.sin(rotation)
      )
    } else {
      // for the rest draw a line
      ctx.lineTo(
        config.hexRadius * Math.cos(rotation),
        config.hexRadius * Math.sin(rotation)
      )
    }
  }
  // Create linear gradient

  ctx.fillStyle = grad
  ctx.fill()
  if (isGrey) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)"
    ctx.fill()
  }
  ctx.closePath()
  ctx.stroke()

  ctx.rotate(-translateRotation)

  if (hex.occupiedBy == null) {
    drawValidAnimals(ctx, hex.validAnimals)
  } else {
    drawOccupyingAnimal(ctx, hex.occupiedBy)
  }
  drawCoordinates(ctx, hex.coordinates)

  const size = [config.hexRadius, config.hexRadius / 2]
  onClick(x - size[0] / 2, y - size[1] / 2, size[0], size[1], callback)

  ctx.translate(-x, -y)
}

function drawCoordinates(ctx, coordinates) {
  ctx.fillStyle = "black"
  ctx.font = "10px serif"
  ctx.textAlign = "center"
  ctx.fillText(coordinates, 0, config.hexRadius - 8)
}

export function drawHexOutline(ctx, x, y, displayCoordinates, callback) {
  ctx.translate(x, y)

  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    // calculate the rotation
    const rotation = (Math.PI / 3) * i - Math.PI / 6
    if (i === 0) {
      ctx.moveTo(
        config.hexRadius * Math.cos(rotation),
        config.hexRadius * Math.sin(rotation)
      )
    } else {
      ctx.lineTo(
        config.hexRadius * Math.cos(rotation),
        config.hexRadius * Math.sin(rotation)
      )
    }
  }

  ctx.closePath()
  ctx.stroke()

  const size = [config.hexRadius, config.hexRadius / 2]
  if (callback != null)
    onClick(x - size[0] / 2, y - size[1] / 2, size[0], size[1], callback)

  drawCoordinates(ctx, displayCoordinates)
  ctx.translate(-x, -y)
}

export function drawHexOutlineByOwnCoordinates(ctx, coordinates, callback) {
  //todo: get x and y
  let x =
    config.boardWidth / 2 +
    (24 - coordinates[0]) * config.canvasXDistance +
    0.5 * (24 - coordinates[1]) * config.canvasXDistance
  let y =
    config.boardHeight / 2 + (24 - coordinates[1]) * config.canvasYDistance
  drawHexOutline(ctx, x, y, coordinates, callback)
}

export function drawHexByOwnCoordinates(ctx, hex, callback, isGrey = false) {
  //todo: get x and y
  let x =
    config.boardWidth / 2 +
    (24 - hex.coordinates[0]) * config.canvasXDistance +
    0.5 * (24 - hex.coordinates[1]) * config.canvasXDistance
  let y =
    config.boardHeight / 2 + (24 - hex.coordinates[1]) * config.canvasYDistance
  drawHex(ctx, hex, x, y, callback, isGrey)
}

export function drawValidAnimals(ctx, validAnimals) {
  for (let i = 0; i < validAnimals.length; i++) {
    let y = i * 16 - validAnimals.length * 8
    let string = validAnimals[i].displayName
    ctx.fillStyle = "black"
    ctx.font = "16px serif"
    ctx.textAlign = "center"
    ctx.fillText(string, 0, y)
  }
}

export function drawOccupyingAnimal(ctx, occupiedBy) {
  ctx.fillStyle = occupiedBy.color
  ctx.beginPath()
  ctx.arc(0, 0, config.hexRadius * 0.5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = "black"
  ctx.stroke()

  ctx.fillStyle = "white"
  ctx.font = "12px serif"
  ctx.textAlign = "center"
  ctx.fillText(occupiedBy.displayName, 0, 0)
}
