function startGame(mode) {
  document.getElementById("hub").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = ""; // reset

  if (mode === "letters") {
    startPhonicsHunt(gameArea);
  } else if (mode === "spelling") {
    startSpellingBuilder(gameArea);
  } else if (mode === "math") {
    startMathBattle(gameArea);
  } else if (mode === "memory") {
    gameArea.innerHTML = `<p>🧩 Memory Puzzle coming soon.</p>`;
  } else if (mode === "boss") {
    gameArea.innerHTML = `<p>🎭 Boss Battle coming soon.</p>`;
  }
}

function returnToHub() {
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("hub").style.display = "flex";
}

/* ===========================
   SOUND EFFECTS
=========================== */
const VERSION = 4; // bump when you update assets
const soundCorrect = new Audio(`sounds/Correct.mp3?v=${VERSION}`);
const soundWrong = new Audio(`sounds/Incorrect.mp3?v=${VERSION}`);

function playCorrect() {
  soundCorrect.currentTime = 0;
  soundCorrect.play();
}

function playWrong() {
  soundWrong.currentTime = 0;
  soundWrong.play();
}

/* ===========================
   VENOM ATTACK
=========================== */
function venomAttack() {
  let venom = document.getElementById("venom-attack");
  if (!venom) {
    venom = document.createElement("img");
    venom.id = "venom-attack";
    venom.src = `images/venom.png?v=${VERSION}`;
    document.body.appendChild(venom);
  }
  venom.style.display = "block";
  venom.style.animation = "venom-attack 2s ease-in-out";
  venom.addEventListener("animationend", () => {
    venom.style.display = "none";
    venom.style.animation = "";
  }, { once: true });
}

/* ===========================
   SPIDER-MAN WEB SHOOT
=========================== */
function webShoot() {
  let web = document.getElementById("web-line");
  if (!web) {
    web = document.createElement("div");
    web.id = "web-line";
    document.body.appendChild(web);
  }
  web.style.display = "block";
  web.style.animation = "web-shoot 0.8s linear";
  web.addEventListener("animationend", () => {
    web.style.display = "none";
    web.style.animation = "";
  }, { once: true });

  let thwip = document.getElementById("thwip");
  if (!thwip) {
    thwip = document.createElement("div");
    thwip.id = "thwip";
    thwip.textContent = "THWIP!";
    document.body.appendChild(thwip);
  }
  thwip.style.display = "block";
  thwip.style.animation = "thwip-pop 1s ease-out";
  thwip.addEventListener("animationend", () => {
    thwip.style.display = "none";
    thwip.style.animation = "";
  }, { once: true });
}

/* ===========================
   PHONICS HUNT
=========================== */
function startPhonicsHunt(container) {
  container.innerHTML = `
    <h2>🎵 Phonics Hunt</h2>
    <p>Pick the correct letter!</p>
    <div id="phonics-buttons"></div>
    <p id="phonics-feedback"></p>
  `;

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const target = letters[Math.floor(Math.random() * letters.length)];
  document.getElementById("phonics-feedback").textContent = `Find: ${target}`;

  const pool = [target];
  while (pool.length < 6) {
    const r = letters[Math.floor(Math.random() * letters.length)];
    if (!pool.includes(r)) pool.push(r);
  }
  pool.sort(() => Math.random() - 0.5);

  const buttonContainer = document.getElementById("phonics-buttons");
  pool.forEach((letter) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.onclick = () => {
      if (letter === target) {
        document.getElementById("phonics-feedback").textContent =
          "🕸️ Thwip! Correct!";
        playCorrect();
        webShoot();
      } else {
        document.getElementById("phonics-feedback").textContent =
          "😈 Venom got you!";
        playWrong();
        venomAttack();
      }
    };
    buttonContainer.appendChild(btn);
  });
}

/* ===========================
   SPELLING BUILDER
=========================== */
function startSpellingBuilder(container) {
  container.innerHTML = `
    <h2>✏️ Spelling Builder</h2>
    <p>Fill in the missing letter!</p>
    <div id="spelling-word"></div>
    <div id="spelling-buttons"></div>
    <p id="spelling-feedback"></p>
  `;

  const words = ["SPIDER", "VENOM", "HERO", "POWER", "MASK", "CITY", "WEB"];
  const targetWord = words[Math.floor(Math.random() * words.length)];
  const missingIdx = Math.floor(Math.random() * targetWord.length);

  const display = targetWord.split("");
  display[missingIdx] = "_";
  document.getElementById("spelling-word").innerHTML = `<strong>${display.join("")}</strong>`;

  const correctLetter = targetWord[missingIdx];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const pool = [correctLetter];
  while (pool.length < 5) {
    const r = letters[Math.floor(Math.random() * letters.length)];
    if (!pool.includes(r)) pool.push(r);
  }
  pool.sort(() => Math.random() - 0.5);

  const buttonContainer = document.getElementById("spelling-buttons");
  pool.forEach((letter) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.onclick = () => {
      if (letter === correctLetter) {
        document.getElementById("spelling-feedback").textContent = `🕸️ Correct! ${targetWord}`;
        playCorrect();
        webShoot();
      } else {
        document.getElementById("spelling-feedback").textContent = "😈 Venom got you!";
        playWrong();
        venomAttack();
      }
    };
    buttonContainer.appendChild(btn);
  });
}

/* ===========================
   MATH BATTLE
=========================== */
function startMathBattle(container) {
  container.innerHTML = `
    <h2>🔢 Math Battle</h2>
    <p>Solve the problem before Venom eats Spider-Man!</p>
    <div id="math-problem"></div>
    <div id="math-buttons"></div>
    <p id="math-feedback"></p>
    <div id="math-characters">
      <img id="math-spidey" src="images/spiderman.png?v=${VERSION}" alt="Spider-Man" />
      <img id="math-monster" src="images/venom.png?v=${VERSION}" alt="Venom" />
    </div>
  `;

  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  const answer = a + b;

  document.getElementById("math-problem").innerHTML = `<strong>${a} + ${b} = ?</strong>`;

  const pool = [answer];
  while (pool.length < 4) {
    const wrong = Math.floor(Math.random() * 20);
    if (!pool.includes(wrong)) pool.push(wrong);
  }
  pool.sort(() => Math.random() - 0.5);

  const buttonContainer = document.getElementById("math-buttons");
  pool.forEach((num) => {
    const btn = document.createElement("button");
    btn.textContent = num;
    btn.onclick = () => {
      if (num === answer) {
        document.getElementById("math-feedback").textContent = "🕸️ Spider-Man wins!";
        playCorrect();
        webShoot();
      } else {
        document.getElementById("math-feedback").textContent = "😈 Venom got you!";
        playWrong();
        venomAttack();
      }
    };
    buttonContainer.appendChild(btn);
  });
}
