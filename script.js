// ===== Elements =====
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const targetEl = document.getElementById("target");
const lettersEl = document.getElementById("letters");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const nextBtn = document.getElementById("new-round");
const enableBtn = document.getElementById("enable-audio");
const spideyImg = document.getElementById("spidey-img");
const venomImg = document.getElementById("venom-img");

// ===== State =====
let score = 0, target = "", level = 1, roundWins = 0;

// Word lists
const easyWords = ["CAT","DOG","BAT","WEB","SUN"];
const heroWords = ["WEB","HERO","VENOM","SPIDER","MASK","POWER"];
const missingWords = ["CAR","MOON","TREE","BOOK","GAME"];

// ===== Web Audio =====
let audioCtx, masterGain, noiseBuffer;
function initAudio(){
  const Ctx = window.AudioContext||window.webkitAudioContext;
  audioCtx = new Ctx();
  masterGain = audioCtx.createGain();
  masterGain.gain.value=0.6;
  masterGain.connect(audioCtx.destination);
  noiseBuffer=audioCtx.createBuffer(1,audioCtx.sampleRate,audioCtx.sampleRate);
  const data=noiseBuffer.getChannelData(0);
  for(let i=0;i<data.length;i++) data[i]=Math.random()*2-1;
}
enableBtn.onclick=()=>{initAudio();enableBtn.style.display="none";};
function ensureAudio(){ if(!audioCtx) initAudio(); }

// Sounds
function playThwip(){
  ensureAudio(); const t=audioCtx.currentTime;
  const src=audioCtx.createBufferSource(); src.buffer=noiseBuffer;
  const hp=audioCtx.createBiquadFilter(); hp.type="highpass"; hp.frequency.setValueAtTime(600,t);
  const g=audioCtx.createGain(); g.gain.setValueAtTime(.8,t); g.gain.exponentialRampToValueAtTime(.001,t+.3);
  src.connect(hp).connect(g).connect(masterGain); src.start(t); src.stop(t+.3);
}
function playGrowl(){
  ensureAudio(); const t=audioCtx.currentTime;
  const osc=audioCtx.createOscillator(); osc.type="sawtooth"; osc.frequency.setValueAtTime(100,t);
  const g=audioCtx.createGain(); g.gain.setValueAtTime(.8,t); g.gain.exponentialRampToValueAtTime(.001,t+.5);
  osc.connect(g).connect(masterGain); osc.start(t); osc.stop(t+.5);
}

// ===== Helpers =====
function setFeedback(msg, win){
  feedbackEl.textContent=msg;
  feedbackEl.className=win?"win":"lose";
}
function updateScore(d){ score+=d; scoreEl.textContent="Score: "+score; }
function disableAll(){ Array.from(lettersEl.children).forEach(b=>b.disabled=true); }
function showSpidey(){ spideyImg.style.display="block"; spideyImg.classList.add("flash"); venomImg.style.display="none"; }
function showVenom(){ venomImg.style.display="block"; venomImg.classList.add("flash"); spideyImg.style.display="none"; }

// ===== Level Logic =====
function checkLevelUp(){
  if(roundWins>=3 && level<4){ level++; roundWins=0; }
  levelEl.textContent=level;
}
function getTarget(){
  if(level===1) return alphabet[Math.floor(Math.random()*alphabet.length)];
  if(level===2) return easyWords[Math.floor(Math.random()*easyWords.length)];
  if(level===3) return missingWords[Math.floor(Math.random()*missingWords.length)];
  return heroWords[Math.floor(Math.random()*heroWords.length)];
}

// ===== Renders =====
function renderLettersLevel1(target){
  lettersEl.innerHTML="";
  const pool=[target]; while(pool.length<6){const r=alphabet[Math.floor(Math.random()*alphabet.length)];if(!pool.includes(r)) pool.push(r);}
  pool.sort(()=>Math.random()-.5).forEach(l=>{
    const btn=document.createElement("button"); btn.className="letter"; btn.textContent=l;
    btn.onclick=()=>{
      if(l===target){ playThwip(); setFeedback("🕸️ Thwip! Correct!",true); updateScore(1); showSpidey(); roundWins++; checkLevelUp(); disableAll();}
      else{ playGrowl(); setFeedback("😈 Venom got you!",false); updateScore(-1); showVenom();}
    };
    lettersEl.appendChild(btn);
  });
}

function renderLettersWord(word){
  lettersEl.innerHTML=""; let idx=0; const pool=[...new Set(word.split(""))];
  while(pool.length<word.length+3){pool.push(alphabet[Math.floor(Math.random()*alphabet.length)]);}
  pool.sort(()=>Math.random()-.5).forEach(l=>{
    const btn=document.createElement("button"); btn.className="letter"; btn.textContent=l;
    btn.onclick=()=>{
      if(l===word[idx]){ playThwip(); btn.classList.add("correct"); idx++; showSpidey(); setFeedback(`Keep going (${idx}/${word.length})`,true);
        if(idx===word.length){ setFeedback("✅ You spelled "+word,true); updateScore(3); roundWins++; checkLevelUp(); disableAll();}
      } else { playGrowl(); btn.classList.add("wrong"); showVenom(); setFeedback("😈 Wrong letter!",false); updateScore(-1); }
    };
    lettersEl.appendChild(btn);
  });
}

function renderMissingLetter(word){
  lettersEl.innerHTML="";
  const missingIdx=Math.floor(Math.random()*word.length);
  const display=word.split(""); display[missingIdx]="_";
  targetEl.textContent=display.join("");
  const correctLetter=word[missingIdx];
  const pool=[correctLetter]; while(pool.length<5){const r=alphabet[Math.floor(Math.random()*alphabet.length)]; if(!pool.includes(r)) pool.push(r);}
  pool.sort(()=>Math.random()-.5).forEach(l=>{
    const btn=document.createElement("button"); btn.className="letter"; btn.textContent=l;
    btn.onclick=()=>{
      if(l===correctLetter){ playThwip(); setFeedback(`🕸️ Correct! It was ${l}`,true); updateScore(2); showSpidey(); roundWins++; checkLevelUp(); disableAll();}
      else{ playGrowl(); setFeedback("😈 Nope, try again!",false); showVenom(); updateScore(-1);}
    };
    lettersEl.appendChild(btn);
  });
}

// ===== New Round =====
function newRound(){
  feedbackEl.textContent=""; spideyImg.style.display="none"; venomImg.style.display="none";
  target=getTarget();
  if(level===1){ targetEl.textContent=target; renderLettersLevel1(target);}
  else if(level===2){ targetEl.textContent=target; renderLettersWord(target);}
  else if(level===3){ renderMissingLetter(target);}
  else{ targetEl.textContent=target; renderLettersWord(target);}
}
nextBtn.onclick=newRound;

// Start
newRound();
