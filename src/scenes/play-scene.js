import { Scene } from "./scene.js";
import { makeRandom, writeScore, getScore } from "./../utils/helper.js";
import { Card, Modal } from "../components/components.js";
import card1 from "./../assets/img/card-1.jpeg";
import card2 from "./../assets/img/card-2.jpeg";
import card3 from "./../assets/img/card-3.jpeg";
import card4 from "./../assets/img/card-4.jpeg";
import card5 from "./../assets/img/card-5.jpeg";
import card6 from "./../assets/img/card-6.jpeg";
import card7 from "./../assets/img/card-7.jpeg";
import card8 from "./../assets/img/card-8.jpeg";
import card9 from "./../assets/img/card-9.jpeg";
import card10 from "./../assets/img/card-10.jpeg";
import audioFlip from "./../assets/audio/flip.mp3";
import audioPoint from "./../assets/audio/point.mp3";

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
  FLIP: audioFlip,
  POINT: audioPoint,
};
const IMG_DATA = [
  card1,
  card2,
  card3,
  card4,
  card5,
  card6,
  card7,
  card8,
  card9,
  card10,
];

export class PlayScene extends Scene {
  #countImgLoaded = 0;
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
      this.play();
    });
    this.cardContainer.addEventListener("click", (e) => {
      const card = e.target;
      if (!e.target) return;
      if (!card.classList.contains("card")) return;
      if (card.classList.contains("flip") || this.#disableClick) return;
      if (this.#cardPick.length >= 2) {
        this.#cardPick.forEach((card) => card.flipDown());
        this.#cardPick = [];
      }
      this.#cardPick.push(card);
      card.flipUp();
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
        //make timer event wait when 2 card matching and handle logic for add point
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
            if (this.#LEVELS.length - 1 === this.#currentLevel) {
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
      const card = new Card(`${imgArrClone[index]}`);
      this.#cards.push(card);
      this.cardContainer.appendChild(card);
      imgCountAppear[key] = imgCountAppear[key] + 1 || 1;
      // add load event to card if image in all card is loaded the game is start
      card.imgElement.addEventListener("load", () => {
        this.#countImgLoaded++;
        if (this.#countImgLoaded == numCard) {
          this.#initTimeEvent(time);
        }
      });
    }
  }
  #initTimeEvent(time) {
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
