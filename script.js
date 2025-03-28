let cl = console.log;

// ===== DOM Elements =====
const app = document.getElementById("app");
const ball = document.getElementById("ball");
const reflector = document.getElementById("reflector");
const scoreWrapper = document.getElementById("score-container");

// ===== Variables =====
const appWidth = app.clientWidth;
const appHeight = app.clientHeight;
const ballRadius = ball.clientHeight / 2;
const speed = 7;
let x = 0;
let y = 0;
let yInc = 5;
let xInc = 5;

let score = 0;

const reflectorWidth = reflector.clientWidth;
const reflectorHalf = reflectorWidth / 2;
const reflectorY = reflector.offsetTop;

function moveBall() {
  let reflectorX = reflector.offsetLeft;
  // reflector.style.left = `${x}px`;
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  if (y > reflectorY + reflector.clientHeight + ballRadius) {
    clearInterval(intervalId);
  } else if (y <= ballRadius) {
    yInc = speed;
    ball.classList.add("bounce-y");
    setTimeout(() => {
      ball.classList.remove("bounce-y");
    }, 200);
  } else if (x >= appWidth - ballRadius) {
    xInc = -speed;
    ball.classList.add("bounce-x");
    setTimeout(() => {
      ball.classList.remove("bounce-x");
    }, 200);
  } else if (x <= ballRadius) {
    xInc = speed;
    ball.classList.add("bounce-x");
    setTimeout(() => {
      ball.classList.remove("bounce-x");
    }, 200);
  } else if (
    y >= reflectorY - ballRadius &&
    x >= reflectorX - reflectorHalf &&
    x <= reflectorX + reflectorHalf
  ) {
    yInc = -speed;
    ball.classList.add("bounce-y");
    setTimeout(() => {
      ball.classList.remove("bounce-y");
    }, 200);
    updateScore();
  }

  x += xInc;
  y += yInc;
}
moveBall();

let intervalId = setInterval(moveBall, 10);

let isDragging = false;

reflector.addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let newLeft = e.clientX;
    if (newLeft < reflectorHalf) {
      newLeft = reflectorHalf;
    } else if (newLeft > appWidth - reflectorHalf) {
      newLeft = appWidth - reflectorHalf;
    }
    reflector.style.left = `${newLeft}px`;
  }
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
  }
});

function updateScore() {
  score += 5;
  scoreWrapper.innerHTML = score;
}
