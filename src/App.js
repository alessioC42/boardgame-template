import { Client } from "boardgame.io/client";
import { Local, SocketIO } from "boardgame.io/multiplayer";
import { resetOnClicks, ctx, onClick} from "./canvas";
import { Cascadia } from "./cascadia";
import { render } from "./renderer/renderer";

const isMultiplayer = import.meta.env.VITE_REMOTE === "true";

// eslint-disable-next-line no-unused-vars
const multiplayer = isMultiplayer
  ? SocketIO({ server: "localhost:8000" })
  : Local();

class GameClient {
  constructor(rootElement) {
    this.rootElement = rootElement;

    this.client = Client({
      game: Cascadia,
    });

    this.client.subscribe((state) => render(state, ctx, resetOnClicks, onClick));
    this.client.start();
  }
}

const appElement = document.getElementById("app");
new GameClient(appElement);
