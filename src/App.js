import { Client } from "boardgame.io/client";
import { Local, SocketIO } from "boardgame.io/multiplayer";
import { resetOnClicks } from "./canvas";
import { Debug } from "boardgame.io/debug";
import { Cascadia } from "./cascadia";

const isMultiplayer = import.meta.env.VITE_REMOTE === "true";
const multiplayerServer =
  import.meta.env.VITE_MUTLIPLAYER_SERVER ?? "localhost:8000";

const multiplayer = isMultiplayer
  ? SocketIO({ server: multiplayerServer })
  : Local();

class GameClient {
  constructor(rootElement) {
    this.rootElement = rootElement;

    this.client = Client({
      game: Cascadia,
      multiplayer: isMultiplayer ? multiplayer : undefined,
      debug: {
        collapseOnLoad: false,
        hideToggleButton: false,
        impl: Debug,
      },
    });

    this.client.subscribe((state) => this.update(state));
    this.client.start();
  }

  update() {}
}

const appElement = document.getElementById("app");
new GameClient(appElement);
