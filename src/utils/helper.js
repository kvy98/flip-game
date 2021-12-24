const makeRandom = (max) => Math.trunc(Math.random() * max);

function getScore() {
  const localStorage = window.localStorage;
  return localStorage.getItem("hight-score") || 0;
}
function writeScore(score = 0) {
  const localStorage = window.localStorage;
  const oldScore = getScore();
  if (!oldScore || oldScore < score) {
    localStorage.setItem("hight-score", score);
  }
}

export { makeRandom, getScore, writeScore };
