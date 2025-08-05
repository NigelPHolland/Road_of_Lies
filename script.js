const TOTAL_TILES = 32;
const truthsCount = 22;
const maxLies = 3;
let liesStepped = 0, crossPot = 0, teamBank = 0, panicUsed = false;

const bridge = document.getElementById('bridge');
const timerEl = document.getElementById('timer');
const messageEl = document.getElementById('message');
const crossPotEl = document.getElementById('crossPot');
const teamBankEl = document.getElementById('teamBank');
const panicBtn = document.getElementById('panic');

let tiles = [];
let remaining = 300;
let timer;

function setupBridge() {
  bridge.innerHTML = '';
  tiles = [];
  liesStepped = 0;
  crossPot = 0;
  remaining = 300;
  clearInterval(timer);
  startTimer();

  const rowPattern = [2, 3, 4, 5, 6, 5, 4, 3, 2]; // 9 rows, 34 tiles total
  const totalTiles = rowPattern.reduce((a, b) => a + b, 0);
  const truths = Math.floor(totalTiles * 0.7); // ~70% truths

  // Build and shuffle tile data
  for (let i = 0; i < totalTiles; i++) {
    tiles.push({ isTruth: i < truths });
  }
  tiles.sort(() => Math.random() - 0.5);

  let index = 0;
  rowPattern.forEach((count, rowIdx) => {
    const row = document.createElement('div');
    row.className = 'row diamond';
    row.style.justifyContent = 'center';

    for (let i = 0; i < count; i++) {
      const tileData = tiles[index++];
      const div = document.createElement('div');
      div.className = 'tile';
      div.textContent = '?';
      div.addEventListener('click', () => handleStep(index - 1, div));
      row.appendChild(div);
    }

    bridge.appendChild(row);
  });

  crossPotEl.textContent = crossPot;
  messageEl.textContent = '';
}



function handleStep(idx, div) {
  if (div.classList.contains('revealed')) return;
  div.classList.add('revealed');

  const t = tiles[idx];
  if (t.isTruth) {
    div.classList.add('truth');
    crossPot += 100;
    playSound('correct');
  } else {
    div.classList.add('lie');
    liesStepped++;
    crossPot = Math.floor(crossPot / 2);
    playSound('wrong');
  }

  div.textContent = t.isTruth ? '✔' : '✖';
  crossPotEl.textContent = crossPot;

  if (liesStepped >= maxLies) {
    messageEl.textContent = 'Stepped on 3 lies — eliminated!';
    playSound('lose');
    endCross(false);
  }

  if (checkCompleted()) {
    messageEl.textContent = 'Crossed safely!';
    playSound('win');
    endCross(true);
  }
}

function checkCompleted() {
  const revealed = document.querySelectorAll('.tile.revealed').length;
  return revealed >= 8;
}

function endCross(success) {
  clearInterval(timer);
  document.querySelectorAll('.tile').forEach(div => div.style.pointerEvents = 'none');
  if (success) {
    teamBank += crossPot;
  }
  teamBankEl.textContent = teamBank;
}

panicBtn.addEventListener('click', () => {
  if (!panicUsed) {
    panicUsed = true;
    messageEl.textContent = 'Panic used — finalist guaranteed!';
    endCross(false);
  }
});

function startTimer() {
  timer = setInterval(() => {
    remaining--;
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
    if (remaining <= 0) {
      clearInterval(timer);
      messageEl.textContent = 'Time up!';
      playSound('lose');
      endCross(false);
    }
  }, 1000);
}

function playSound(type) {
  const sounds = {
    correct: 'sounds/correct.mp3',
    wrong: 'sounds/wrong.mp3',
    win: 'sounds/win.mp3',
    lose: 'sounds/lose.mp3',
  };
  const audio = new Audio(sounds[type]);
  audio.play();
}

setupBridge();
