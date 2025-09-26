function startGame(mode) {
  document.getElementById("hub").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = ""; // reset

  if (mode === "letters") {
    startPhonicsHunt(gameArea);
  } else if (mode === "spelling") {
    gameArea.innerHTML = `<p>✏️ Spelling Builder coming soon.</p>`;
  } else if (mode === "math") {
    gameArea.innerHTML = `<p>🔢 Math Battle coming soon.</p>`;
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
   PHONICS HUNT (teaching)
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
    A: { word: "Apple 🍎", sound: "a" },
    B: { word: "Ball 🏀", sound: "b" },
    C: { word: "Cat 🐱", sound: "c" },
    D: { word: "Dog 🐶", sound: "d" },
    M: { word: "Moon 🌙", sound: "m" },
    S: { word: "Sun ☀️", sound: "s" },
  };

  // Pick a random letter from our teaching set
  const keys = Object.keys(sounds);
  const target = keys[Math.floor(Math.random() * keys.length)];
  const clueType = Math.random() > 0.5 ? "word" : "sound";

  const clueEl = document.getElementById("phonics-clue");
  if (clueType === "word") {
    clueEl.innerHTML = `<strong>Clue:</strong> ${sounds[target].word}`;
  } else {
    clueEl.innerHTML = `<button id="play-sound">▶️ Play Sound</button>`;
    document.getElementById("play-sound").onclick = () => speakLetter(sounds[target].sound);
  }

  // Make buttons
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
      } else {
        document.getElementById("phonics-feedback").textContent = "😈 Venom got you!";
      }
    };
    buttonContainer.appendChild(btn);
  });
}

/* ===== Speech synthesis for phonics sounds ===== */
function speakLetter(sound) {
  const utter = new SpeechSynthesisUtterance(sound);
  utter.rate = 0.7; // slower for clarity
  speechSynthesis.speak(utter);
}
