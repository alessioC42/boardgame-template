import { config } from "./config"

export function renderVictoryCard(ctx, results, ownPlayer) {
    let winner = getWinner(results)

    ctx.translate(config.boardWidth / 2, config.boardHeight / 2)
    ctx.fillStyle = "rgba(200, 200, 200, 0.7)"
    ctx.strokeStyle = "black"
    ctx.beginPath()
    ctx.rect(-(config.boardWidth / 4), -(config.boardHeight / 4), config.boardWidth / 2, config.boardHeight / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.fillStyle = "black"
    ctx.font = "50px serif";
    ctx.fillText(`Winner: ${winner}`, 0, -(config.boardHeight / 4) + 50);

    let players = Object.keys(results)
    let playerCount = players.length


    for (let i = 0; i < players.length; i++) {
        let x = (config.boardWidth / 2) / (playerCount + 1) * (i + 1) - (config.boardWidth / 4)
        ctx.fillText(i, x, 0)
        ctx.fillText(results[i], x, 70)
    }
    ctx.translate(-(config.boardWidth / 2), -(config.boardHeight / 2))
}

function getWinner(results) {
    let keys = Object.keys(results)
    let winner = "0"
    let currentMax = 0
    for (let key in keys) {
        if (results[key] > currentMax) {
            winner = key
            currentMax = results[key]
        }
    }
    return winner
}