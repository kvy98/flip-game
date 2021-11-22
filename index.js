"use strict";
const levelElement = document.getElementById("level");
const TimeElement = document.getElementById("time");
const btnStart = document.querySelector(".btn--start");
const btnScore = document.querySelector(".btn--score");
const scoreElement = document.querySelector("#your-score");
const audio = document.querySelector("audio");
const gameLevels = [
  {
    level: 1,
    numCard: 20,
  },
  {
    level: 2,
    numCard: 40,
  },
  {
    level: 3,
    numCard: 60,
  },
  {
    level: 4,
    numCard: 80,
  },
  {
    level: 5,
    numCard: 100,
  },
];
let currentIndex = 0;
let cards = [];
let cardPick = [];
let pauseGame = false;
let delayTime = 800;
let score = 0;
let eTimeOut;
let tickTime = 0;
const imgArr = [
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

const makeRandom = (max) => Math.trunc(Math.random() * max);

const cardInit = (img) => {
  const card = document.createElement("li");
  card.classList.add("card");
  card.innerHTML = `<img src="img/${img}" alt="" class="card__img" /> `;
  return card;
};
function resetGame() {
  tickTime = 0;
  cardPick = [];
  cards = [];
}
function getScore() {
  const localStorage = window.localStorage;
  return localStorage.getItem("hight-score");
}
function writeScore() {
  const localStorage = window.localStorage;
  const oldScore = getScore();
  if (oldScore < score || oldScore == undefined) {
    localStorage.setItem("hight-score", score);
  }
}
function exitGame() {
  resetGame();
  writeScore();
  currentIndex = 0;
  score = 0;
  document.querySelector(".cards").innerHTML = "";
  levelElement.style.visibility = "hidden";
  TimeElement.style.visibility = "hidden";
  scoreElement.style.visibility = "hidden";
  popModal();
}
function popModal() {
  document.body.removeChild(document.querySelector(".modal-game-over"));
  document.querySelector(".scene").classList.remove("start");
}
function showModal(title, _score, exitHandle) {
  const modal = document.createElement("div");
  const buttonExit = document.createElement("button");
  const titleElement = document.createElement("p");
  const scoreElement = document.createElement("p");
  scoreElement.innerText = `Your score:${_score}`;
  scoreElement.classList.add("score");
  titleElement.classList.add("title");
  titleElement.textContent = title;
  modal.classList.add("modal-game-over");
  modal.appendChild(titleElement);
  modal.appendChild(scoreElement);
  modal.appendChild(buttonExit);
  buttonExit.innerText = "Exit";
  buttonExit.addEventListener("click", () => exitHandle());
  document.body.appendChild(modal);
}
function stopGame() {
  showModal("GAME OVER", score, exitGame);
}
function initGame() {
  resetGame();
  const numCard = gameLevels[currentIndex].numCard;
  const time = numCard * 4;
  eTimeOut = setInterval(() => {
    tickTime++;
    TimeElement.innerText = time - tickTime;

    if (tickTime == time) {
      clearInterval(eTimeOut);
      stopGame();
    }
  }, 1000);
  TimeElement.innerText = time;
  levelElement.innerText = currentIndex + 1;
  let imgCountAppear = {};
  const cardContainer = document.querySelector(".cards");
  let imgArrClone = [...imgArr];
  const numberAppear = numCard / imgArr.length;
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
    const card = cardInit(imgArrClone[index]);
    card.addEventListener("click", () => {
      if (card.classList.contains("flip") || pauseGame) return;
      if (cardPick.length >= 2) {
        cardPick.forEach((item) => item.classList.remove("flip"));
        cardPick = [];
      }
      cardPick.push(card);
      card.classList.add("flip");
      playFlipSound();
      if (
        cardPick.length == 2 &&
        cardPick[0].querySelector("img").src ===
          cardPick[1].querySelector("img").src
      ) {
        playPointSound();
        pauseGame = true;
        setTimeout(() => {
          cardContainer.removeChild(cardPick[0]);
          cardContainer.removeChild(cardPick[1]);
          cards.pop();
          cards.pop();
          cardPick = [];
          score += 10;
          scoreElement.textContent = `Score:${score}`;
          pauseGame = false;
          if (cards.length == 0) {
            currentIndex++;
            clearInterval(eTimeOut);
            if (gameLevels.length == currentIndex) {
              stopGame();
              return;
            }
            initGame();
          }
        }, delayTime);
      }
    });
    cards.push(card);
    cardContainer.appendChild(card);
    imgCountAppear[key] = imgCountAppear[key] ? imgCountAppear[key] + 1 : 1;
  }
}
btnStart.addEventListener("click", () => {
  document.querySelector(".scene").classList.add("start");
  const startScene = document.querySelector(".start-scene");
  const animationDuration =
    Number(getComputedStyle(startScene).animationDuration.replace("s", "")) *
    1000;
  const playScene = document.querySelector(".play-scene");
  playScene.style.pointerEvents = "none";
  setTimeout(() => {
    levelElement.style.visibility = "visible";
    TimeElement.style.visibility = "visible";
    scoreElement.style.visibility = "visible";
    scoreElement.textContent = `Score:0`;
    playScene.style.pointerEvents = "auto";
    initGame();
  }, animationDuration);
});
btnScore.addEventListener("click", () => {
  const _score = getScore() ?? 0;
  showModal("HIGH SCORE", _score, popModal);
});
function playFlipSound() {
  audio.src = "audio/flip.mp3";
  audio.play();
}
function playPointSound() {
  audio.src = "audio/point.mp3";
  audio.play();
}
