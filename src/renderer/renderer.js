import { drawHex, drawHexByOwnCoordinates, drawOccupyingAnimal, drawHexOutlineByOwnCoordinates } from "./draw_hex";
import { config } from "./config";
import { isAdjacentToBoard } from "../cascadia";

// eslint-disable-next-line no-unused-vars
export function render(state, ctx, resetOnClicks, onClick) {
    resetOnClicks()
    //renders board on canvas
    for (let x = 0; x < state.G.boards["0"].length; x++) {
        for (let y = 0; y < state.G.boards["0"].length; y++) {
            if (state.G.boards["0"][x][y] !== null) {
                drawHexByOwnCoordinates(ctx, state.G.boards["0"][x][y])
            } else if (isAdjacentToBoard(state.G.boards["0"], [x, y])) {
                drawHexOutlineByOwnCoordinates(ctx, [x, y])
            }
        }

    }

    //renders Offering on canvas
    let dimension = 100

    for (let i = 0; i < 4; i++) {
        console.log(state.G.offering.length)
        try {
            drawHex(ctx, state.G.offering[i].cell, 100 + i * dimension, 100) 
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