import { Client, LobbyClient } from "boardgame.io/client"
import { Local, SocketIO } from "boardgame.io/multiplayer"
import { onClick, resetOnClicks, ctx } from "./canvas"
import { Debug } from "boardgame.io/debug"
import { Cascadia } from "./cascadia"
import { render } from "./renderer/renderer"

const isMultiplayer = import.meta.env.VITE_REMOTE === "true"
const multiplayerServer =
  import.meta.env.VITE_MUTLIPLAYER_SERVER ?? "localhost:8000"

const lobbyClient = new LobbyClient({ server: "http://localhost:8000" })

const multiplayer = isMultiplayer
  ? SocketIO({ server: multiplayerServer })
  : Local()

class GameClient {
  constructor(rootElement, matchId) {
    this.rootElement = rootElement

    this.client = Client({
      game: Cascadia,
      multiplayer: isMultiplayer ? multiplayer : undefined,
      debug: {
        collapseOnLoad: false,
        hideToggleButton: false,
        impl: Debug,
      },
      matchID: matchId,
    })

    this.client.subscribe((state) => render(state, ctx, resetOnClicks, onClick))
    this.client.start()
  }
}

const appElement = document.getElementById("app")
const lobbyElement = document.getElementById("lobby")
const matchIdElement = document.getElementById("match-id")

if (!isMultiplayer) {
  document.getElementById("app").classList.remove("hidden")
  new GameClient(appElement)
} else {
  document.getElementById("lobby").classList.remove("hidden")

  document.getElementById("create-game").addEventListener("click", async () => {
    const result = await lobbyClient.createMatch("default", {
      numPlayers: 4,
    })

    new GameClient(appElement, result.matchID)
    matchIdElement.classList.remove("hidden")
    matchIdElement.innerText = result.matchID

    lobbyElement.classList.add("hidden")
    appElement.classList.remove("hidden")
  })

  document.getElementById("join-game").addEventListener("click", async () => {
    const gameID = document.getElementById("join-match-id").value
    if (!gameID) return
    console.log(`joining game ${gameID}`)
  })
}
