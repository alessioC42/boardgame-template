import { config } from "./config"

export function renderVictoryCard(ctx, results) {
    ctx.translate(config.boardWidth / 2, config.boardHeight / 2)
    ctx.fillStyle = "rgba(200, 200, 200, 0.7)"
    ctx.strokeStyle = "black"
    ctx.beginPath()
    ctx.rect(-(config.boardWidth / 4), -(config.boardHeight / 4), config.boardWidth / 2, config.boardHeight / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.textAlign = 'center'

    ctx.translate(-(config.boardWidth / 2), -(config.boardHeight / 2))
}