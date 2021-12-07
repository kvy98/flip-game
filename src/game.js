"use strict";
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
// btnStart.addEventListener("click", () => {
//   document.querySelector(".scene").classList.add("start");
//   const startScene = document.querySelector(".start-scene");
//   const animationDuration =
//     Number(getComputedStyle(startScene).animationDuration.replace("s", "")) *
//     1000;
//   console.log(animationDuration);
//   const playScene = document.querySelector(".play-scene");
//   playScene.style.pointerEvents = "none";
//   setTimeout(() => {
//     levelElement.style.visibility = "visible";
//     TimeElement.style.visibility = "visible";
//     scoreElement.style.visibility = "visible";
//     scoreElement.textContent = `Score:${score}`;
//     playScene.style.pointerEvents = "auto";
//     initGame();
//   }, animationDuration);
// });
// btnScore.addEventListener("click", () => {
//   const _score = getScore() ?? 0;
//   showModal("HIGH SCORE", _score, popModal);
// });
