import { Scene } from "./scene.js";
import { makeRandom, writeScore, getScore } from "./../utils/helper.js";
import { Card, Modal } from "../components/components.js";
const rawHTML = `
    <audio id="audio"></audio>
    <div class="game-status">
      <p id="your-score"></p>
      <p id="time"></p>
      <p id="level">0</p>
    </div>
    <ul class="cards"></ul>
`;
const AUDIO_TYPE = {
  FLIP: "/assets/audio/flip.mp3",
  POINT: "/assets/audio/point.mp3",
};
const IMG_ASSETS_PATH = "/assets/img/";
const IMG_DATA = [
  "card-1.jpeg",
  "card-2.jpeg",
  "card-3.jpeg",
  "card-4.jpeg",
  "card-5.jpeg",
  "card-6.jpeg",
  "card-7.jpeg",
  "card-8.jpeg",
  "card-9.jpeg",
  "card-10.jpeg",
];
export class PlayScene extends Scene {
  #currentLevel = 0;
  #cards = [];
  #cardPick = [];
  #disableClick = false;
  #delayTime = 800;
  #score = 0;
  #eTimeOut;
  #tickTime = 0;
  #LEVELS = [
    {
      LEVEL: 1,
      NUM_CARD: 20,
    },
    {
      LEVEL: 2,
      NUM_CARD: 40,
    },
    {
      LEVEL: 3,
      NUM_CARD: 60,
    },
    {
      LEVEL: 4,
      NUM_CARD: 80,
    },
    {
      LEVEL: 5,
      NUM_CARD: 100,
    },
  ];
  #onExitHandle;
  constructor(rawHtml = rawHTML) {
    super(rawHtml);
    this.classList.add("scene--play");
    this.levelLabel = this.querySelector("#level");
    this.timeLabel = this.querySelector("#time");
    this.scoreLabel = this.querySelector("#your-score");
    this.audio = this.querySelector("#audio");
    this.cardContainer = this.querySelector(".cards");
    this.attachEvent = function ({ onExitScene }) {
      this.#onExitHandle = onExitScene;
      delete this.attachEvent;
    };
    ///---- addEventListenter------------
    this.audio.addEventListener("canplaythrough", function () {
      console.log("play-audio");
      this.play();
    });
    this.cardContainer.addEventListener("click", (e) => {
      const card = e.target;
      if (!e.target) return;
      if (!card.classList.contains("card")) return;
      if (card.classList.contains("flip") || this.#disableClick) return;
      if (this.#cardPick.length >= 2) {
        this.#cardPick.forEach((item) => item.classList.remove("flip"));
        this.#cardPick = [];
      }
      this.#cardPick.push(card);
      card.classList.add("flip");
      this.#playSound();
      if (this.#cardPick.length == 2) {
        const [firstCardPick, secondCardPick] = this.#cardPick;
        if (
          firstCardPick.querySelector("img").src !=
          secondCardPick.querySelector("img").src
        )
          return;
        this.#playSound(AUDIO_TYPE.POINT);
        this.#disableClick = true;
        setTimeout(() => {
          firstCardPick.remove();
          secondCardPick.remove();
          this.#cards.pop();
          this.#cards.pop();
          this.#cardPick = [];
          this.#score += 10;
          this.scoreLabel.textContent = `Score:${this.#score}`;
          this.#disableClick = false;
          if (!this.#cards.length) {
            clearInterval(this.#eTimeOut);
            if (this.#LEVELS.length == currentIndex) {
              this.#stopGame();
              return;
            }
            this.#nextLevel();
          }
        }, this.#delayTime);
      }
    });
  }
  load() {
    super.load();
    const { NUM_CARD: numCard, LEVEL: level } =
      this.#LEVELS[this.#currentLevel];
    const time = numCard * 4;
    this.timeLabel.innerText = time;
    this.levelLabel.innerText = level;
    this.scoreLabel.innerText = `Score:${this.#score}`;
    let imgCountAppear = {};
    let imgArrClone = [...IMG_DATA];
    const numberAppear = numCard / IMG_DATA.length;
    for (let i = 0; i < numCard; i++) {
      let index = makeRandom(imgArrClone.length);
      let key = imgArrClone[index];
      if (imgCountAppear[key] === numberAppear) {
        do {
          imgArrClone = imgArrClone.filter((e) => e != imgArrClone[index]);
          index = makeRandom(imgArrClone.length);
          key = imgArrClone[index];
        } while (imgCountAppear[key] === numberAppear);
      }
      const card = new Card(`${IMG_ASSETS_PATH}${imgArrClone[index]}`);
      this.#cards.push(card);
      this.cardContainer.appendChild(card);
      imgCountAppear[key] = imgCountAppear[key] + 1 || 1;
    }
    this.#eTimeOut = setInterval(() => {
      this.#tickTime++;
      this.timeLabel.innerText = time - this.#tickTime;
      if (this.#tickTime == time) {
        clearInterval(this.#eTimeOut);
        this.#stopGame();
      }
    }, 1000);
  }
  #resetState() {
    this.#tickTime = 0;
    this.#cardPick = [];
    this.#cards = [];
    this.#currentLevel = 0;
    this.#score = 0;
    this.cardContainer.innerHTML = "";
  }
  #nextLevel() {
    this.#tickTime = 0;
    this.#cardPick = [];
    this.#cards = [];
    this.#currentLevel++;
    this.cardContainer.innerHTML = "";
    this.load();
  }
  #playSound(audioType = AUDIO_TYPE.FLIP) {
    this.audio.src = audioType;
  }
  #stopGame() {
    const title = "GAME OVER";
    const message = `YOUR SCORE:${this.#score}`;
    const modal = new Modal(title, message, this.#onExitHandle.bind(this));
    writeScore(this.#score);
    modal.show();
    this.#resetState();
    this.remove();
  }
}
window.customElements.define("play-scene", PlayScene);
