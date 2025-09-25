// ====== Foundations ======
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const targetEl = document.getElementById("target");
const lettersEl = document.getElementById("letters");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("new-round");

let score = 0;
let target = null;

// Utility: pick N unique items including a required one
function sampleChoices(required, pool, n = 6) {
  const set = new Set([required]);
  while (set.size < n) set.add(pool[Math.floor(Math.random() * pool.length)]);
  return Array.from(set).sort(() => Math.random() - 0.5);
}

function setFeedback(msg, isWin) {
  feedbackEl.textContent = msg;
  feedbackEl.className = isWin ? "win" : "lose";
  lettersEl.classList.remove("flash-win", "flash-lose");
  // retrigger animation
  void lettersEl.offsetWidth;
  lettersEl.classList.add(isWin ? "flash-win" : "flash-lose");
}

function updateScore(delta) {
  score += delta;
  scoreEl.textContent = `Score: ${score}`;
}

function renderChoices(choices) {
  lettersEl.innerHTML = "";
  choices.forEach(letter => {
    const btn = document.createElement("button");
    btn.className = "letter";
    btn.type = "button";
    btn.textContent = letter;
    btn.setAttribute("aria-label", `Choose letter ${letter}`);

    btn.addEventListener("click", () => {
      if (letter === target) {
        btn.classList.add("correct");
        setFeedback("🕸️ Thwip! Spider-Man webbed the right letter!", true);
        updateScore(+1);
        // lock current round after a correct pick
        Array.from(lettersEl.children).forEach(b => b.disabled = true);
      } else {
        btn.classList.add("wrong");
        setFeedback("😈 Venom strikes! Try again!", false);
        updateScore(-1);
      }
    });

    lettersEl.appendChild(btn);
  });
}

function newRound() {
  feedbackEl.textContent = "";
  target = alphabet[Math.floor(Math.random() * alphabet.length)];
  targetEl.textContent = target;
  renderChoices(sampleChoices(target, alphabet, 6));
  // enable all buttons (in case previous round was finished)
  Array.from(lettersEl.children).forEach(b => b.disabled = false);
}

nextBtn.addEventListener("click", newRound);
document.addEventListener("keydown", (e) => {
  const k = e.key?.toUpperCase();
  if (alphabet.includes(k)) {
    const btn = Array.from(lettersEl.children).find(b => b.textContent === k);
    if (btn) btn.click();
  } else if (e.key === "Enter") {
    newRound();
  }
});

// Start!
newRound();
