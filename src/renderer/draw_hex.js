import { animals } from '../models/animals';
import {config} from './config'

export function drawHex(ctx, hex, x, y) {
    ctx.translate(x, y);

    let translateRotation = (Math.PI / 3) * hex.rotation;

    let grad=ctx.createLinearGradient(-config.hexRadius, 0, config.hexRadius, 0 );
    grad.addColorStop(0, hex.biomeA.color);
    grad.addColorStop(1, hex.biomeB.color);

    ctx.rotate(translateRotation)


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
    
    ctx.rotate(-translateRotation)
    
    if (hex.occupiedBy == null) {
        drawValidAnimals(ctx, hex.validAnimals)
    } else {
        drawOccupyingAnimal(ctx, hex.occupiedBy)
    }
    ctx.translate(-x, -y);
}


export function drawHexByOwnCoordinates(ctx, hex) {
    
    //todo: get x and y
    let x = 800 + (24 - hex.coordinates[0]) * config.canvasXDistance + 0.5 * (24 - hex.coordinates[1]) * config.canvasXDistance
    let y = 800 + (24 - hex.coordinates[1]) * config.canvasYDistance 
    console.log(x, y)
    drawHex(ctx, hex, x, y)
}

export function drawValidAnimals(ctx, validAnimals) {
    for (let i = 0; i < validAnimals.length; i++) {
        let y = i*16-  validAnimals.length*8
        let string = validAnimals[i].displayName
        ctx.fillStyle = "black"
        ctx.font = "16px serif"
        ctx.textAlign = "center"
        ctx.fillText(string, 0, y)
        console.log("drawAnimal", string)
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
    
    console.log("occupiedAnimal")
}
