import { Scene } from "./scene.js";
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
      this.#btnScore.addEventListener("click", function () {
        this.disabled = true;
        const animationTime = btnScoreHanle();
        console.log(animationTime);
        setTimeout(() => {
          this.disabled = false;
        }, animationTime * 1000);
      });
      delete this.attachEvent;
    };
  }
}
window.customElements.define("start-scene", StartScene);
