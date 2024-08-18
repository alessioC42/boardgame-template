import { Server } from "boardgame.io/server"
import serve from "koa-static"
import { Cascadia } from "./cascadia"

const server = Server({
  games: [Cascadia],
  origins: [/.*/],
})

server.app.use(serve("dist"))

server.run(process.env.PORT ?? 8000)
