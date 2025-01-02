let cl = console.log;
// ===== DOM Elements =====
const screen = document.getElementById("app");
const ball = document.getElementById("ball");
const reflector = document.getElementById("reflector");
let isDragging = false;
let offsetX = 0;
let constrainedLeft = "";
// Helper to constrain position within viewport
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// Mobile version
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
