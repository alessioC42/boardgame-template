import { config } from "./config"
import { drawPicture } from "../canvas"
import { animals } from "../models/animals"

export const cards = [{
    name: "Grizzlybär",
    img: "bear.png",
    text: "Punkte für die Anzahl BÄREN - Paare (keine weiteren BÄREN neben sich)",
    table: [0, 4, 11, 19, 27],
    animal: animals.bear
},
    {
        name: "Rotschwanz Bussard",
        img: "bird.png",
        text: "Punkt für die Anzahl BUSSARDE ohne andere BUSSARDE neben sich.",
        table: [0, 2, 5, 8, 11, 14, 18, 22, 26],
        animal: animals.bird
    },
    {
        name: "Wapiti-Hirsch",
        img: "deer.png",
        text: "Punkte pro HIRSCH Gruppe (Jeder HIRSCH kann nur zu einer Gruppe gehören.)",
        table: [0, 2, 4, 7, 10, 14, 18, 23, 28],
        animal: animals.deer
    },
    {
        name: "Rot Fuchs",
        img: "fox.png",
        text: "Punkte pro FUCHS gemäß der Anzahl der häufigsten benachbarten Tierart (keine FÜCHSE). # Stellt euch vor bei dem Bild links in der Mitte ist ein Fuchs.",
        table: [0, 1, 2, 3, 4, 5, 6],
        animal: animals.fox
    },
    {
        name: "Königs Lachs",
        img: "fish.png",
        text: "Punkte pro LACHS Kette ( max. zwei benachbarte LACHSE pro LACHS).",
        table: [0, 2, 5, 8, 12, 16, 20, 25],
        animal: animals.fish
    }

]

export function renderVictoryConditionCard(ctx, card) {
    ctx.translate(config.boardWidth / 2, config.boardHeight / 2)
    ctx.fillStyle = "rgba(200, 200, 200, 0.7)"
    ctx.strokeStyle = "black"
    ctx.beginPath()
    ctx.rect(-(config.boardWidth / 4), -(config.boardHeight / 4), config.boardWidth / 2, config.boardHeight / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    drawPicture(ctx, card.img, config.boardWidth / 2 - (config.boardWidth / 4) + 20, config.boardHeight / 2 - (config.boardHeight / 4) + 20, config.boardWidth / 4 - 40, config.boardHeight / 2 - 40)
    
    ctx.textAlign = 'center'
    ctx.fillStyle = "black"
    ctx.font = "30px serif";

    ctx.fillText(card.name, config.boardWidth / 8, -130, 300)

    ctx.font = "20px serif";
    printAt(ctx, card.text, config.boardWidth / 8, - 90, 20, (config.boardWidth / 4) - 30)

    ctx.textAlign = 'left'

    ctx.fillText("Count: ", 0, 0)
    ctx.fillText("Points: ", 0, 40)

    ctx.textAlign = 'center'


    for (let i = 0; i < card.table.length; i++) {
        ctx.fillText(i, 70 + i * 30, 0)
        ctx.fillText(card.table[i], 70 + i * 30, 40)

    }

    ctx.translate(-(config.boardWidth / 2), -(config.boardHeight / 2))
}

function printAt( context , text, x, y, lineHeight, fitWidth)
{
    fitWidth = fitWidth || 0;
    
    if (fitWidth <= 0)
    {
         context.fillText( text, x, y );
        return;
    }
    
    for (var idx = 1; idx <= text.length; idx++)
    {
        var str = text.substr(0, idx);
        console.log(str, context.measureText(str).width, fitWidth);
        if (context.measureText(str).width > fitWidth)
        {
            context.fillText( text.substr(0, idx-1), x, y );
            printAt(context, text.substr(idx-1), x, y + lineHeight, lineHeight,  fitWidth);
            return;
        }
    }
    context.fillText( text, x, y );
}