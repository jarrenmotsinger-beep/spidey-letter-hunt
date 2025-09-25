// ====== Elements ======
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const targetEl = document.getElementById("target");
const lettersEl = document.getElementById("letters");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const nextBtn = document.getElementById("new-round");
const enableBtn = document.getElementById("enable-audio");

// ====== Game State ======
let score = 0;
let target = null;
let level = 1;      // 1 = letters, 2 = easy words, 3 = hero words
let roundWins = 0;

// Word lists
const easyWords = ["CAT", "DOG", "BAT", "WEB", "SUN", "CAR"];
const heroWords = ["WEB", "HERO", "VENOM", "SPIDER", "MASK", "POWER"];

// ====== Web Audio (no external files) ======
let audioCtx = null;
let masterGain = null;
let noiseBuffer = null;

function initAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(audioCtx.destination);

    // Create a 1-second white noise buffer
    noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  } else if (audioCtx.state !== "running") {
    audioCtx.resume();
  }
}

enableBtn.addEventListener("click", () => {
  initAudio();
  enableBtn.style.display = "none";
});

function ensureAudio() {
  if (!audioCtx || audioCtx.state !== "running") {
    initAudio();
    if (audioCtx && audioCtx.state === "running") {
      enableBtn.style.display = "none";
    }
  }
}

function playThwip() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuffer;

  const hp = audioCtx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.setValueAtTime(600, t);
  hp.frequency.exponentialRampToValueAtTime(4000, t + 0.15);

  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(1.0, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

  src.connect(hp).connect(g).connect(masterGain);
  src.start(t);
  src.stop(t + 0.3);
}

function playGrowl() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;

  // Low oscillator growl
  const osc = audioCtx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(90, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.4);

  const g1 = audioCtx.createGain();
  g1.gain.setValueAtTime(0.0001, t);
  g1.gain.linearRampToValueAtTime(0.8, t + 0.05);
  g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

  osc.connect(g1).connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.65);

  // Add noise layer
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;

  const lp = audioCtx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(500, t);

  const g2 = audioCtx.createGain();
  g2.gain.setValueAtTime(0.0001, t);
  g2.gain.linearRampToValueAtTime(0.4, t + 0.05);
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

  noise.connect(lp).connect(g2).connect(masterGain);
  noise.start(t);
  noise.stop(t + 0.65);
}

function playSoundCorrect() { ensureAudio(); playThwip(); }
function playSoundWrong()   { ensureAudio(); playGrowl(); }

// ====== UI Helpers ======
function setFeedback(msg, isWin) {
  feedbackEl.textContent = msg;
  feedbackEl.className = isWin ? "win" : "lose";
  lettersEl.classList.remove("flash-win", "flash-lose");
  void lettersEl.offsetWidth; // restart CSS animation
  lettersEl.classList.add(isWin ? "flash-win" : "flash-lose");
}

function updateScore(delta) {
  score += delta;
  scoreEl.textContent = `Score: ${score}`;
}

function disableAll() {
  Array.from(lettersEl.children).forEach(b => b.disabled = true);
}

// ====== Level Logic ======
function checkLevelUp() {
  if (roundWins >= 3 && level === 1) {
    level = 2;
    roundWins = 0;
    setFeedback("🚀 Level Up! Now spell small words!", true);
  } else if (roundWins >= 3 && level === 2) {
    level = 3;
    roundWins = 0;
    setFeedback("🔥 Hero Level! Spell Spider-Man words!", true);
  }
  levelEl.textContent = level;
}

function getTarget() {
  if (level === 1) {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  } else if (level === 2) {
    return easyWords[Math.floor(Math.random() * easyWords.length)];
  } else {
    return heroWords[Math.floor(Math.random() * heroWords.length)];
  }
}

// ====== Rendering ======
function renderLettersLevel1(target) {
  lettersEl.innerHTML = "";
  let choices = new Set([target]);
  while (choices.size < 6) {
    choices.add(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  [...choices].sort(() => Math.random() - 0.5).forEach(letter => {
    const btn = document.createElement("button");
    btn.className = "letter";
    btn.type = "button";
    btn.textContent = letter;

    btn.addEventListener("click", () => {
      if (letter === target) {
        playSoundCorrect();
        btn.classList.add("correct");
        setFeedback("🕸️ Thwip! Correct!", true);
        updateScore(+1);
        roundWins++;
        checkLevelUp();
        disableAll();
      } else {
        playSoundWrong();
        btn.classList.add("wrong");
        setFeedback("😈 Venom got you!", false);
        updateScore(-1);
      }
    });

    lettersEl.appendChild(btn);
  });
}

function renderLettersWord(target) {
  lettersEl.innerHTML = "";
  const needed = target.split("");
  let index = 0;

  const pool = [...new Set(needed)];
  while (pool.length < needed.length + 3) {
    pool.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  pool.sort(() => Math.random() - 0.5);

  pool.forEach(letter => {
    const btn = document.createElement("button");
    btn.className = "letter";
    btn.type = "button";
    btn.textContent = letter;

    btn.addEventListener("click", () => {
      if (letter === needed[index]) {
        playSoundCorrect();
        btn.classList.add("correct");
        index++;
        setFeedback(`🕸️ Good! Keep going... (${index}/${needed.length})`, true);
        if (index === needed.length) {
          setFeedback(`✅ You spelled ${target}!`, true);
          updateScore(+3);
          roundWins++;
          checkLevelUp();
          disableAll();
        }
      } else {
        playSoundWrong();
        btn.classList.add("wrong");
        setFeedback("😈 Venom tricked you!", false);
        updateScore(-1);
      }
    });

    lettersEl.appendChild(btn);
  });
}

function newRound() {
  feedbackEl.textContent = "";
  target = getTarget();
  targetEl.textContent = target;
  if (level === 1) {
    renderLettersLevel1(target);
  } else {
    renderLettersWord(target);
  }
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

// ====== Start ======
newRound();
