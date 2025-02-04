let cl = console.log;
// ===== DOM Elements =====
const screen = document.getElementById("app");
const ball = document.getElementById("ball");
const reflector = document.getElementById("reflector");

// ===== Variables =====
let isDragging = false;
let offsetX = 0;
let constrainedLeft = "";
let viewWidth = "";
let reflectPosY = reflector.offsetTop;
let reflectPosX = window.innerWidth - reflector.offsetLeft;
let angle = Math.PI / 4;
let speed = 5;
let posX = 0;
let posY = 0;
let animationFrameId = "";
let xDistance = "";
let yDistance = "";
let score = 0;

document.getElementById("score-container").innerHTML = score;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

reflector.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - reflector.offsetLeft;
});

document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (isDragging) {
    const touch = e.touches[0];
    const newLeft = touch.clientX - offsetX;
    const maxLeft = window.innerWidth - reflector.offsetWidth * 0.5;
    const constrainedLeft = clamp(newLeft, 50, maxLeft);

    reflector.style.left = `${constrainedLeft}px`;
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

reflector.addEventListener("mousedown", (e) => {
  let viewWidth = e.clientX;
  isDragging = true;
  offsetX = viewWidth - reflector.offsetLeft;
});

document.addEventListener("mousemove", (e) => {
  let viewWidth = e.clientX;
  if (isDragging) {
    const newLeft = viewWidth - offsetX;
    const maxLeft = window.innerWidth - reflector.offsetWidth * 0.5;
    constrainedLeft = clamp(newLeft, 50, maxLeft);

    reflector.style.left = `${constrainedLeft}px`;

    reflectPosX = constrainedLeft;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// ball

function getyDistance(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();

  const yDistance = rect2.top - rect1.top;
  return yDistance;
}

function getxDistance(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();

  const xDistance = rect2.left - rect1.left;
  return xDistance;
}

function ballMove() {
  const nextX = posX + speed * Math.cos(angle);
  const nextY = posY + speed * Math.sin(angle);

  const widthRange = window.innerWidth - ball.offsetWidth;
  if (nextX <= 0 || nextX >= widthRange) {
    angle = Math.PI - angle;
    posX = Math.max(0, Math.min(nextX, widthRange));
    borderEffect();
  } else {
    posX = nextX;
  }

  const reflectorRect = reflector.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();
  if (ballRect.top > reflectorRect.bottom) {
    lose();
    return;
  }

  if (nextY <= 0) {
    angle = -angle;
    posY = Math.max(0, nextY);
    borderEffect();
  } else {
    posY = nextY;
  }

  ball.style.left = `${posX}px`;
  ball.style.top = `${posY}px`;

  const xDistance = getxDistance(ball, reflector);
  const yDistance = getyDistance(ball, reflector);

  if (yDistance < 30 && xDistance < 30 && xDistance > -100) {
    ballReflect();
  }

  animationFrameId = requestAnimationFrame(ballMove);
}

animationFrameId = requestAnimationFrame(ballMove);

// screen edge collision effect

function borderEffect() {
  document.getElementById("border-effect").style.border = "10px solid white";
  setTimeout(function () {
    document.getElementById("border-effect").style.border = "0px solid white";
  }, 200);
}

// ===== Reflector function thing =====

function ballReflect() {
  const ballRect = ball.getBoundingClientRect();
  const reflectorRect = reflector.getBoundingClientRect();
  const isAboveReflector = ballRect.bottom >= reflectorRect.top;
  const withinReflectorWidth =
    ballRect.right >= reflectorRect.left &&
    ballRect.left <= reflectorRect.right;

  if (isAboveReflector && withinReflectorWidth) {
    const reflectorCenter = reflectorRect.left + reflectorRect.width / 2;
    const ballCenter = ballRect.left + ballRect.width / 2;

    const offset = ballCenter - reflectorCenter;
    const normalizedOffset = offset / (reflectorRect.width / 2);
    const maxDeflection = Math.PI / 4;

    const deflection = normalizedOffset * maxDeflection;
    angle = -angle + deflection;
    updateScore();
    ballReflectEffect();
    increaseSpeed();
  }
}

function lose() {
  document.getElementById("restart-game").style.display = "block";

  ball.style.display = "none";
  cancelAnimationFrame(animationFrameId);
}

function updateScore() {
  score++;
  document.getElementById("score-container").innerHTML = score;
  document.getElementById("score-container").style.transform = "scale(1.5)";
  setTimeout(function () {
    document.getElementById("score-container").style.transform = "scale(1)";
  }, 200);
}

function ballReflectEffect() {
  reflector.style.outline = "10px solid rgba(255, 255, 255, 0.3)";
  setTimeout(function () {
    reflector.style.outline = "0px solid rgba(255, 255, 255, 0.3)";
  }, 200);
}

function increaseSpeed() {
  if (score > 50) {
    speed = 7;
    screen.style.backgroundColor = "white";
    reflector.style.backgroundColor = "rgb(27, 27, 34)";
    document.getElementById("score-container").style.color = "rgb(27, 27, 34)";
    ball.style.backgroundColor = "rgb(27, 27, 34)";
  } else if (score >= 20) {
    speed = 6;
    screen.style.backgroundColor = "#607d8b";
  }
}

document.getElementById("restart-game").addEventListener("click", () => {
  location.reload();
});
