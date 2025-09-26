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
   SOUND EFFECTS (with versioning)
=========================== */
const VERSION = 2; // 🔹 bump this number whenever you replace mp3 files
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
   PHONICS HUNT
=========================== */
function startPhonicsHunt(container) {
  container.innerHTML = `
    <h2>🎵 Phonics Hunt</h2>
    <p>Listen or look at the clue and pick the correct letter!</p>
    <div id="phonics-clue"></div>
    <div id="phonics-buttons"></div>
    <p id="phonics-feedback"></p>
    <button onclick="startPhonicsHunt(document.getElementById('game-area'))">🔄 New Round</button>
  `;

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const sounds = {
    A: { clue: "🍎", sound: "a" },
    B: { clue: "🏀", sound: "b" },
    C: { clue: "🐱", sound: "c" },
    D: { clue: "🐶", sound: "d" },
    M: { clue: "🌙", sound: "m" },
    S: { clue: "☀️", sound: "s" }
  };

  const keys = Object.keys(sounds);
  const target = keys[Math.floor(Math.random() * keys.length)];
  const clueType = Math.random() > 0.5 ? "emoji" : "sound";

  const clueEl = document.getElementById("phonics-clue");
  if (clueType === "emoji") {
    clueEl.innerHTML = `<strong>Clue:</strong> ${sounds[target].clue}`;
  } else {
    clueEl.innerHTML = `<button id="play-sound">▶️ Play Sound</button>`;
    document.getElementById("play-sound").onclick = () => speakLetter(sounds[target].sound);
  }

  const pool = [target];
  while (pool.length < 6) {
    const r = letters[Math.floor(Math.random() * letters.length)];
    if (!pool.includes(r)) pool.push(r);
  }
  pool.sort(() => Math.random() - 0.5);

  const buttonContainer = document.getElementById("phonics-buttons");
  pool.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.style.margin = "8px";
    btn.style.padding = "16px";
    btn.style.fontSize = "24px";
    btn.onclick = () => {
      if (letter === target) {
        document.getElementById("phonics-feedback").textContent = "🕸️ Thwip! Correct!";
        playCorrect();
      } else {
        document.getElementById("phonics-feedback").textContent = "😈 Venom got you!";
        playWrong();
      }
    };
    buttonContainer.appendChild(btn);
  });
}

function speakLetter(sound) {
  const utter = new SpeechSynthesisUtterance(sound);
  utter.rate = 0.7;
  speechSynthesis.speak(utter);
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
    <button onclick="startSpellingBuilder(document.getElementById('game-area'))">🔄 New Word</button>
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
  pool.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.style.margin = "8px";
    btn.style.padding = "16px";
    btn.style.fontSize = "24px";
    btn.onclick = () => {
      if (letter === correctLetter) {
        document.getElementById("spelling-feedback").textContent = `🕸️ Correct! ${targetWord}`;
        playCorrect();
      } else {
        document.getElementById("spelling-feedback").textContent = "😈 Venom got you!";
        playWrong();
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
    <p>Solve the problem before the monster eats Spider-Man!</p>
    <div id="math-problem"></div>
    <div id="math-buttons"></div>
    <p id="math-feedback"></p>
    <div id="math-characters">
      <img id="math-spidey" src="https://i.ibb.co/2jK8k1B/spiderman.png" alt="Spider-Man" />
      <img id="math-monster" src="https://i.ibb.co/4PX8qrb/venom.png" alt="Monster" />
    </div>
    <button onclick="startMathBattle(document.getElementById('game-area'))">🔄 New Problem</button>
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
  pool.forEach(num => {
    const btn = document.createElement("button");
    btn.textContent = num;
    btn.style.margin = "8px";
    btn.style.padding = "16px";
    btn.style.fontSize = "24px";
    btn.onclick = () => {
      if (num === answer) {
        document.getElementById("math-feedback").textContent = "🕸️ Spider-Man wins!";
        document.getElementById("math-spidey").style.filter = "none";
        document.getElementById("math-monster").style.display = "none";
        playCorrect();
      } else {
        document.getElementById("math-feedback").textContent = "😈 The monster ate Spider-Man!";
        document.getElementById("math-spidey").style.filter = "grayscale(100%)";
        playWrong();
      }
    };
    buttonContainer.appendChild(btn);
  });
}
