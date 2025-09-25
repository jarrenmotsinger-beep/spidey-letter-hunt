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
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.6;
      masterGain.connect(audioCtx.destination);

      // Create a 1-second white noise buffer we can reuse
      noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 1.0, audioCtx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    } else if (audioCtx.state !== "running") {
      audioCtx.resume();
    }
  } catch (e) {
    console.warn("Audio init failed:", e);
  }
}

enableBtn.addEventListener("click", () => {
  initAudio();
  // Hide the button after enabling
  enableBtn.style.display = "none";
});

// If user didn't press Enable yet, try to init on first interaction
function ensureAudio() {
  if (!audioCtx || audioCtx.state !== "running") {
    initAudio();
    if (audioCtx && audioCtx.state === "running") {
      enableBtn.style.display = "none";
    }
  }
}

// Play a short "thwip" (web swoosh) using filtered noise + quick envelope
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

// Play a "growl" by layering a low oscillator + lowpassed noise with a decay
function playGrowl() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;

  // Low oscillator with a bit of wobble (LFO)
  const osc = audioCtx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(90, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.4);

  const lfo = audioCtx.createOscillator();
  lfo.type = "triangle";
  lfo.frequency.value = 15;

  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 10; // depth of wobble
  lfo.connect(lfoGain).connect(osc.frequency);

  const g1 = audioCtx.createGain();
  g1.gain.setValueAtTime(0.0001, t);
  g1.gain.linearRampToValueAtTime(0.8, t + 0.05);
  g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

  osc.connect(g1).connect(masterGain);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + 0.65);
  lfo.stop(t + 0.65);

  // Add a short burst of lowpassed noise
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

// ====== UI Helpers ======
function playSoundCorrect() { ensureAudio(); playThwip(); }
function playSoundWrong()   { ensureAudio(); playGrowl(); }

function setFeedback(msg, isWin) {
  feedbackEl.textContent = msg;
  feedbackEl.className = isWin ? "win" : "lose";
  lettersEl.classList.remove("flash-win", "flash-lose");
  // restart CSS animation
  void lettersEl.offsetWidth;
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
    btn.setAttribute("aria-label", `Choose letter ${letter}`);

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
        se
