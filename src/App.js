import { Client, LobbyClient } from "boardgame.io/client"
import { Local, SocketIO } from "boardgame.io/multiplayer"
import { resetOnClicks, ctx } from "./canvas"
import { Debug } from "boardgame.io/debug"
import { Cascadia } from "./cascadia"
import { render } from "./renderer/renderer"

const isMultiplayer = import.meta.env.VITE_REMOTE === "true"
const multiplayerServer =
  import.meta.env.VITE_MUTLIPLAYER_SERVER ?? "localhost:8000"

const lobbyClient = new LobbyClient({ server: "http://localhost:8000" })

function resetElement(el) {
  const newElement = el.cloneNode(true)
  el.parentNode.replaceChild(newElement, el)
  return newElement
}

const multiplayer = isMultiplayer
  ? SocketIO({ server: multiplayerServer })
  : Local()

class GameClient {
  constructor(rootElement, gameParams) {
    this.rootElement = rootElement

    this.client = Client({
      game: Cascadia,
      multiplayer: isMultiplayer ? multiplayer : undefined,
      debug: {
        collapseOnLoad: false,
        hideToggleButton: false,
        impl: Debug,
      },
      matchID: gameParams?.matchId,
      playerID: gameParams?.playerId,
      credentials: gameParams?.playerCredentials,
    })

    this.client.subscribe((state) => {
      if (state == null) return
      render(state, ctx, resetOnClicks, this.client)
    })
    this.client.start()
  }
}

const appElement = document.getElementById("app")
const createGameElement = document.getElementById("create-game")
const joinGameElement = document.getElementById("join-game")
const lobbyElement = document.getElementById("lobby")
const matchIdElement = document.getElementById("match-id")
const joinIdElement = document.getElementById("join-match-id")
const overlayElement = document.getElementById("overlay")
let quitButton = document.getElementById("quit")
let client

function startGame(game) {
  client = new GameClient(appElement, game)
  matchIdElement.classList.remove("hidden")
  matchIdElement.innerText = game?.matchId

  lobbyElement.classList.add("hidden")
  appElement.classList.remove("hidden")

  if (game?.matchId) overlayElement.classList.remove("hidden")
  else overlayElement.classList.add("hidden")

  quitButton = resetElement(quitButton)
  quitButton.addEventListener("click", async () => {
    await lobbyClient.leaveMatch("default", game?.matchId, {
      playerID: game?.playerId,
      credentials: game?.playerCredentials,
    })

    client.client.stop()
    appElement.classList.add("hidden")
    lobbyElement.classList.remove("hidden")
    overlayElement.classList.add("hidden")
    joinIdElement.value = ""
    localStorage.removeItem("active-game")
  })
}

function getActiveGame() {
  const str = localStorage.getItem("active-game")
  if (!str) return null

  try {
    return JSON.parse(str)
  } catch (e) {
    console.log(e)
    return null
  }
}

if (!isMultiplayer) {
  appElement.classList.remove("hidden")
  startGame()
} else {
  const activeGame = getActiveGame()
  if (activeGame) {
    startGame(activeGame)
  } else {
    lobbyElement.classList.remove("hidden")

    createGameElement.addEventListener("click", async () => {
      const createMatchResult = await lobbyClient.createMatch("default", {
        numPlayers: 4,
      })
      if (!createMatchResult?.matchID) return

      const joinResult = await lobbyClient.joinMatch(
        "default",
        createMatchResult.matchID,
        { playerName: "Player" },
      )
      if (!joinResult?.playerID) return

      const createdGame = {
        matchId: createMatchResult.matchID,
        playerId: joinResult.playerID,
        playerCredentials: joinResult.playerCredentials,
      }

      localStorage.setItem("active-game", JSON.stringify(createdGame))
      startGame(createdGame)
    })

    joinGameElement.addEventListener("click", async () => {
      if (!joinIdElement.value) return

      const foundGame = await lobbyClient.getMatch(
        "default",
        joinIdElement.value,
      )
      if (!foundGame?.matchID) return

      const joinResult = await lobbyClient.joinMatch(
        "default",
        foundGame.matchID,
        { playerName: "Player" },
      )
      if (!joinResult?.playerID) return

      const joinedGame = {
        matchId: foundGame.matchID,
        playerId: joinResult.playerID,
        playerCredentials: joinResult.playerCredentials,
      }

      localStorage.setItem("active-game", JSON.stringify(joinedGame))
      startGame(joinedGame)
    })
  }
}
