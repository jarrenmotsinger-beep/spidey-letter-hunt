/* ===========================
   SOUNDS
=========================== */
const correctSound = new Audio("sounds/Correct.mp3");
const incorrectSound = new Audio("sounds/Incorrect.mp3");

function handleCorrectAnswer() {
  correctSound.currentTime = 0;
  correctSound.play();
  showWebEffect();
}

function handleIncorrectAnswer() {
  incorrectSound.currentTime = 0;
  incorrectSound.play();
}

/* ===========================
   SPIDER-MAN WEB SHOOT
=========================== */
function showWebEffect() {
  const web = document.createElement("div");
  web.className = "web-effect";
  document.body.appendChild(web);

  // Remove it after animation ends
  setTimeout(() => {
    web.remove();
  }, 500);

  // Also show "THWIP!" bubble
  const thwip = document.createElement("div");
  thwip.textContent = "THWIP!";
  thwip.className = "thwip";
  document.body.appendChild(thwip);

  setTimeout(() => {
    thwip.remove();
  }, 800);
}

/* ===========================
   VENOM ATTACK
=========================== */
function showVenom(container) {
  container.innerHTML = `<img src="images/venom.png" class="character-img venom-attack">`;

  const venomImg = container.querySelector(".venom-attack");
  venomImg.style.position = "relative";
  venomImg.style.animation = "venomJump 1s forwards";
}

/* ===========================
   GLOBAL STYLES INJECT
   (for animations like web + venom)
=========================== */
const style = document.createElement("style");
style.innerHTML = `
  .character-img {
    width: 150px;
    margin-top: 15px;
  }

  .web-effect {
    position: absolute;
    top: 50%;
    left: 20%;
    width: 120px;
    height: 5px;
    background: white;
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left center;
    animation: shoot 0.5s forwards;
    z-index: 999;
  }

  @keyframes shoot {
    0% { transform: scaleX(0); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }

  .thwip {
    position: fixed;
    top: 30%;
    left: 40%;
    font-size: 50px;
    font-weight: bold;
    color: white;
    text-shadow: 3px 3px #000;
    animation: thwip-pop 0.8s ease-out forwards;
    z-index: 1000;
  }

  @keyframes thwip-pop {
    0% { transform: scale(0.5); opacity: 0; }
    30% { transform: scale(1.2); opacity: 1; }
    70% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }

  @keyframes venomJump {
    0% { left: -200px; opacity: 0; }
    50% { left: 50px; opacity: 1; }
    100% { left: 0; opacity: 1; }
  }
`;
document.head.appendChild(style);
