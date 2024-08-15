import { drawHex } from "./draw_hex";

// eslint-disable-next-line no-unused-vars
export function render(state, ctx, resetOnClicks, onClick) {
    resetOnClicks()
    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);

    console.log(state)

    drawHex(ctx, state.G.offering[0].cell, 800, 800)
}