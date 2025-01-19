// Create starry background
for (let i = 0; i < 200; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  document.body.appendChild(star);
}

// Undertale heart movement
const heart = document.getElementById('undertale-heart');
let heartX = window.innerWidth / 2;
let heartY = window.innerHeight / 2;
const speed = 5;
const keys = {};

document.addEventListener('keydown', (e) => (keys[e.key] = true));
document.addEventListener('keyup', (e) => (keys[e.key] = false));

function moveHeart() {
  if (keys['ArrowUp']) heartY -= speed;
  if (keys['ArrowDown']) heartY += speed;
  if (keys['ArrowLeft']) heartX -= speed;
  if (keys['ArrowRight']) heartX += speed;

  heartX = Math.max(0, Math.min(window.innerWidth - 20, heartX));
  heartY = Math.max(0, Math.min(window.innerHeight - 20, heartY));

  heart.style.left = `${heartX}px`;
  heart.style.top = `${heartY}px`;

  requestAnimationFrame(moveHeart);
}
moveHeart();

// Heart click interaction
const heartbeat = new Audio('heartbeat.mp3');
heart.addEventListener('click', () => {
  heart.style.textShadow = '0 0 10px red, 0 0 20px red';
  heartbeat.play();
  heartbeat.playbackRate = 1.5; // Speed up the heartbeat
  setTimeout(() => (heart.style.textShadow = ''), 200);

  showDialogue("You feel your sins crawling on your back...", () => {
    setTimeout(() => {
      showDialogue("How are you?", () => {
        showChoices([
          { text: "Good", callback: () => showDialogue("Really?, YAY", () => {}) },
          { text: "Insane", callback: () => showDialogue("We're all a little insane...", () => {}) },
          { text: "Confused", callback: () => showDialogue("It's okay to feel confused. Take your time.", () => {}) },
          { text: "Kill me", callback: () => showDialogue("Really want to die?. Well same here", () => {}) },
        ]);
      });
    }, 1000);
  });
});

// Function to show dialogue with typing animation
function showDialogue(text, callback) {
  const dialogue = document.createElement('div');
  dialogue.className = 'dialogue-box';
  const dialogueText = document.createElement('p');
  dialogueText.className = 'dialogue-text';
  dialogueText.innerText = '';
  dialogue.appendChild(dialogueText);
  document.body.appendChild(dialogue);

  let i = 0;
  const typingInterval = setInterval(() => {
    if (i < text.length) {
      dialogueText.innerText += text[i];
      i++;
    } else {
      clearInterval(typingInterval);
      if (callback) callback(); // Callback after typing finishes
    }
  }, 50); // Adjust typing speed here

  // Remove dialogue after 3 seconds
  setTimeout(() => dialogue.remove(), 3000);
}

// Function to show choices
function showChoices(choices) {
  const dialogue = document.createElement('div');
  dialogue.className = 'dialogue-box';
  dialogue.innerHTML = `
    <p>How are you?</p>
    ${choices.map((choice, index) => `<button id="choice-${index}">${choice.text}</button>`).join('')}
  `;
  document.body.appendChild(dialogue);

  choices.forEach((choice, index) => {
    document.getElementById(`choice-${index}`).addEventListener('click', () => {
      dialogue.remove();
      choice.callback();
    });
  });
}

// Constellation system
const constellationContainer = document.querySelector('.constellation-container');
const stars = [];
const lines = [];
let lastStar = null;
let starCount = 0;

// Function to check if a position is within the card's area
function isPositionInCard(x, y) {
  const card = document.querySelector('.card');
  const cardRect = card.getBoundingClientRect();
  return (
    x >= cardRect.left &&
    x <= cardRect.right &&
    y >= cardRect.top &&
    y <= cardRect.bottom
  );
}

// Function to ensure stars are within the visible area
function getRandomPosition() {
  const padding = 100; // Padding around the card
  const card = document.querySelector('.card');
  const cardRect = card.getBoundingClientRect();

  let x, y;
  do {
    x = Math.random() * (window.innerWidth - 40) + 20; // Ensure stars are within the screen
    y = Math.random() * (window.innerHeight - 40) + 20; // Ensure stars are within the screen
  } while (
    x >= cardRect.left - padding &&
    x <= cardRect.right + padding &&
    y >= cardRect.top - padding &&
    y <= cardRect.bottom + padding
  );

  return { x, y };
}

function createInteractiveStar() {
  if (starCount >= 8) return; // Reduced to 8 stars

  const { x, y } = getRandomPosition();

  const star = document.createElement('div');
  star.className = 'interactive-star';
  star.innerHTML = ['⭐', '✨', '🌟'][Math.floor(Math.random() * 3)];
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  star.addEventListener('click', () => collectStar(star));
  constellationContainer.appendChild(star);
  stars.push(star);
  starCount++;
}

function collectStar(star) {
  star.classList.add('collected');

  if (lastStar) {
    const line = document.createElement('div');
    line.className = 'constellation-line';
    const rect1 = lastStar.getBoundingClientRect();
    const rect2 = star.getBoundingClientRect();

    const length = Math.hypot(rect2.left - rect1.left, rect2.top - rect1.top);
    const angle = Math.atan2(rect2.top - rect1.top, rect2.left - rect1.left);

    line.style.width = `${length}px`;
    line.style.height = '2px';
    line.style.left = `${rect1.left + rect1.width / 2}px`;
    line.style.top = `${rect1.top + rect1.height / 2}px`;
    line.style.transform = `rotate(${angle}rad)`;

    constellationContainer.appendChild(line);
    lines.push(line);

    updateMadness(10);
    spawnRose();
    if (Math.random() < 0.5) spawnDoll();
  }

  lastStar = star;
}

// Madness system
let madness = 0;
const madnessFill = document.getElementById('madness-fill');

function updateMadness(amount) {
  madness = Math.min(100, madness + amount);
  madnessFill.style.width = `${madness}%`;

  if (madness >= 100) {
    document.body.classList.add('madness-full');
    setTimeout(() => {
      madness = 0;
      madnessFill.style.width = '0%';
      document.body.classList.remove('madness-full');
    }, 2000);
  }
}

// Yume Nikki-style random text appearances
document.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.02) {
    const text = document.createElement('div');
    text.className = 'yume-nikki';
    text.style.left = e.clientX + 'px';
    text.style.top = e.clientY + 'px';
    text.innerText = ['★', '☆', '✧', '✦'][Math.floor(Math.random() * 4)];
    document.body.appendChild(text);

    setTimeout(() => {
      text.style.opacity = '1';
      setTimeout(() => text.remove(), 1000);
    }, 0);
  }
});

// Initialize interactive stars
for (let i = 0; i < 8; i++) {
  createInteractiveStar();
}

// Make stars interactive
const pixelStars = document.querySelectorAll('.pixel-star');
pixelStars.forEach((star) => {
  star.addEventListener('click', () => {
    star.style.transform = 'scale(2)';
    setTimeout(() => star.style.transform = 'scale(1)', 200);
  });
});

// Ib/Mad Father references
function spawnRose() {
  const rose = document.createElement('div');
  rose.className = 'rose';
  rose.innerHTML = '🥀';
  rose.style.left = `${Math.random() * 90 + 5}%`;
  rose.style.top = `${Math.random() * 90 + 5}%`;
  document.body.appendChild(rose);

  setTimeout(() => rose.remove(), 3000);
}

function spawnDoll() {
  const doll = document.createElement('div');
  doll.className = 'doll';
  doll.innerHTML = '👻';
  doll.style.left = `${Math.random() * 90 + 5}%`;
  doll.style.top = `${Math.random() * 90 + 5}%`;
  document.body.appendChild(doll);

  setTimeout(() => {
    doll.style.opacity = '1';
    setTimeout(() => doll.remove(), 1000);
  }, 100);
}

// Memory Fragment system
const memoryFragments = [
  'Why...?',
  'Remember...',
  'Lost...',
  'Help...',
  'SKIBIDI',
  'Where am I?',
  'Who are you?',
  'What is this?',
  'I’m scared...',
  'Don’t leave...',
];

document.addEventListener('dblclick', (e) => {
  const fragment = document.createElement('div');
  fragment.className = 'memory-fragment';
  fragment.style.left = `${e.clientX}px`;
  fragment.style.top = `${e.clientY}px`;
  fragment.innerText = memoryFragments[Math.floor(Math.random() * memoryFragments.length)];
  document.body.appendChild(fragment);

  setTimeout(() => fragment.remove(), 2000);
});

// Red stars on hover
document.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.02) {
    const redStar = document.createElement('div');
    redStar.className = 'yume-nikki';
    redStar.style.left = `${e.clientX}px`;
    redStar.style.top = `${e.clientY}px`;
    redStar.innerText = '★';
    redStar.style.color = '#ff0000';
    document.body.appendChild(redStar);

    setTimeout(() => {
      redStar.style.opacity = '1';
      setTimeout(() => redStar.remove(), 1000);
    }, 0);
  }
});

// Journal system
const journalIcon = document.querySelector('.journal-icon');
const journalModal = document.querySelector('.journal-modal');
const journalEntry = document.getElementById('journal-entry');
const closeJournal = document.querySelector('.close-journal');

const journalEntries = [
  'Now I have neither happiness nor unhappiness.',
  'Mine has been a life of much shame.',
  'As long as I can make them laugh, it doesn’t matter how, I’ll be alright.',
  'Living itself is the source of sin.',
  'Sigma Sigma boy',
];

journalIcon.addEventListener('click', () => {
  journalModal.style.display = 'block';
  journalEntry.innerText = journalEntries[Math.floor(Math.random() * journalEntries.length)];
});

closeJournal.addEventListener('click', () => {
  journalModal.style.display = 'none';
});

// Soundtrack
const soundtrack = document.getElementById('soundtrack');
const soundtrackIcon = document.querySelector('.soundtrack-icon');

soundtrackIcon.addEventListener('click', () => {
  if (soundtrack.paused) {
    soundtrack.play();
    soundtrackIcon.innerText = '🔊';
  } else {
    soundtrack.pause();
    soundtrackIcon.innerText = '🔇';
  }
});

// Cute Ghosts
function spawnCuteGhost() {
  const ghost = document.createElement('div');
  ghost.className = 'cute-ghost';
  ghost.style.left = `${Math.random() * 90 + 5}%`;
  ghost.style.top = `${Math.random() * 90 + 5}%`;
  ghost.innerText = '👻';
  document.body.appendChild(ghost);

  setTimeout(() => ghost.remove(), 5000);
}

// Glowing Skulls
function spawnGlowingSkull() {
  const skull = document.createElement('div');
  skull.className = 'glowing-skull';
  skull.style.left = `${Math.random() * 90 + 5}%`;
  skull.style.top = `${Math.random() * 90 + 5}%`;
  skull.innerText = '💀';
  document.body.appendChild(skull);

  setTimeout(() => skull.remove(), 2000);
}

// Initialize new features
setInterval(() => {
  if (Math.random() < 0.1) spawnCuteGhost();
  if (Math.random() < 0.1) spawnGlowingSkull();
}, 5000);