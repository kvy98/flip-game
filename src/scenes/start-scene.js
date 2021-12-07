import { Scene } from "./scene.js";
// import * as Helper from "./../utils/helper.js";
// import { Modal } from "../components/components.js";
const rawHTML = `
<button class="btn btn--start">New Game</button>
<button class="btn btn--score">Hight Score</button>
`;
export class StartScene extends Scene {
  #btnStart;
  #btnScore;
  constructor(rawHtml = rawHTML) {
    super(rawHtml);
    this.classList.add("scene--start");
    this.#btnStart = this.querySelector(".btn--start");
    this.#btnScore = this.querySelector(".btn--score");
    this.attachEvent = function ({ btnStartHandle, btnScoreHanle }) {
      this.#btnStart.addEventListener("click", btnStartHandle);
      this.#btnScore.addEventListener("click", btnScoreHanle);
      delete this.attachEvent;
    };
  }
}
window.customElements.define("start-scene", StartScene);

// if (!window.customElements.get("start-scene")) {
//   window.customElements.define("start-scene", StartScene);
// }
