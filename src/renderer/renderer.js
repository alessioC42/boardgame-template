import { drawHex, drawHexByOwnCoordinates } from "./draw_hex";
import { config } from "./config";

// eslint-disable-next-line no-unused-vars
export function render(state, ctx, resetOnClicks, onClick) {
    resetOnClicks()
    for (let x = 0; x < state.G.boards["0"].length; x++) {
        for (let y = 0; y < state.G.boards["0"].length; y++) {
            if (state.G.boards["0"][x][y] !== null) {
                drawHexByOwnCoordinates(ctx, state.G.boards["0"][x][y])
            }
        }

    }

    
}