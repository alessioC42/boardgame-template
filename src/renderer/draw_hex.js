import {config} from './config'

export function drawHex(ctx, hex, x, y) {
    ctx.translate(x, y);

    const tralsateRotation = (Math.PI / 3) * hex.rotation;

    const grad=ctx.createLinearGradient(-config.hexRadius, 0, config.hexRadius, 0 );
    grad.addColorStop(0, hex.biomeA.color);
    grad.addColorStop(1, hex.biomeB.color);

    ctx.rotate(tralsateRotation)


    for (let i = 0; i < 6; i++) {
        // calculate the rotation
        const rotation = (Math.PI / 3) * i - Math.PI/6;
      
        // for the first point move to
        if (i === 0) {
            ctx.moveTo(config.hexRadius * Math.cos(rotation), config.hexRadius * Math.sin(rotation));
        } else {
            // for the rest draw a line
            ctx.lineTo(config.hexRadius * Math.cos(rotation), config.hexRadius * Math.sin(rotation));
        }
    }
    // Create linear gradient

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.closePath();
    ctx.stroke();
    ctx.translate(0, 0);
}

export function drawHexByOwnCoordinates(ctx, hex) {

    //todo: get x and y

    drawHex(ctx, hex)
}