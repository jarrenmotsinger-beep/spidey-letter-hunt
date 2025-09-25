function startGame(mode) {
  document.getElementById("hub").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = `<h2>Loading ${mode}...</h2>`;

  // Plug in each game mode later:
  if (mode === "letters") {
    gameArea.innerHTML = `<p>🔤 Letter Hunt game will run here.</p>`;
  } else if (mode === "spelling") {
    gameArea.innerHTML = `<p>✏️ Spelling Builder here.</p>`;
  } else if (mode === "math") {
    gameArea.innerHTML = `<p>🔢 Math Battle here.</p>`;
  } else if (mode === "memory") {
    gameArea.innerHTML = `<p>🧩 Memory Puzzle here.</p>`;
  } else if (mode === "boss") {
    gameArea.innerHTML = `<p>🎭 Boss Battle here.</p>`;
  }
}

function returnToHub() {
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("hub").style.display = "flex";
}
