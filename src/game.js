"use strict";
import "./assets/img/bg.jpg";
import "./assets/img/back-card.jpeg";
import "./sass/base.scss";

import { StartScene, PlayScene } from "./scenes/scenes.js";
import { Modal } from "./components/components.js";
import { getScore } from "./utils/helper.js";
class Game {
  #currentScene;
  constructor(scenes) {
    this.scenes = scenes;
    const [firstScene, secondScene] = scenes;
    this.#currentScene = firstScene;
    const self = this;
    secondScene.attachEvent({
      onExitScene: function () {
        self.#currentScene = firstScene;
        self.#run();
      },
    });
    firstScene.attachEvent({
      btnStartHandle: function () {
        self.#currentScene.remove();
        self.#currentScene = self.scenes.at(-1);
        self.#run();
      },
      btnScoreHanle: function () {
        const score = getScore();
        const title = "HIGHT SCORE";
        const message = `Your highest score:${score}`;
        const modal = new Modal(title, message);
        modal.show();
        const { animationDuration: animationTime } = getComputedStyle(modal);
        return Number.parseFloat(animationTime);
      },
    });
    this.#run();
  }
  #run() {
    this.#currentScene.load();
    document.body.appendChild(this.#currentScene);
  }
}
const startScene = new StartScene();

const playScene = new PlayScene();

const scenes = [startScene, playScene];
const game = new Game(scenes);
