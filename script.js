function startGame(mode) {
  document.getElementById("hub").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = ""; // reset

  if (mode === "letters") {
    startLetterHunt(gameArea);
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
   LETTER HUNT GAME MODE
=========================== */

function startLetterHunt(container) {
  container.innerHTML = `
    <h2>🔤 Letter Hunt</h2>
    <p>Find the matching letter before Venom does!</p>
    <div id="letter-target"></div>
    <div id="letter-buttons"></div>
    <p id="letter-feedback"></p>
    <button onclick="startLetterHunt(document.getElementById('game-area'))">🔄 New Round</button>
  `;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const target = alphabet[Math.floor(Math.random() * alphabet.length)];
  document.getElementById("letter-target").innerHTML = `<strong>Target: ${target}</strong>`;

  const buttonContainer = document.getElementById("letter-buttons");
  let pool = [target];
  while (pool.length < 6) {
    const r = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!pool.includes(r)) pool.push(r);
  }
  pool.sort(() => Math.random() - 0.5);

  pool.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.style.margin = "8px";
    btn.style.padding = "16px";
    btn.style.fontSize = "24px";
    btn.onclick = () => {
      if (letter === target) {
        document.getElementById("letter-feedback").textContent = "🕸️ Thwip! Correct!";
      } else {
        document.getElementById("letter-feedback").textContent = "😈 Venom got you!";
      }
    };
    buttonContainer.appendChild(btn);
  });
}
