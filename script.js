// Happy Birthday Website for Ha-Mim Tasnim
// Birds Flying Sky, Music ('Ki Naame Deke Bolbo Tomake'), 5s Countdown & Typewriter Erase Story

// --- 1. Procedural Web Audio: Bird Chirp & Melodic Song Fallback ---
class RomanticAudioManager {
  constructor() {
    this.audioCtx = null;
    this.isChirping = true;
    this.chirpTimer = null;
    this.isMelodyPlaying = false;
    this.bgSong = document.getElementById('bgSong');
    this.musicDisc = document.getElementById('musicDisc');
    this.songSourceStatus = document.getElementById('songSourceStatus');
    this.songPlayBtn = document.getElementById('songPlayBtn');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.musicFileInput = document.getElementById('musicFileInput');
    this.hasLocalAudioFile = false;
    this.hasUserInteracted = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Realistic bird chirp using FM synthesis and bandpass filtering
  playSingleChirp(pitchMultiplier = 1.0, delay = 0) {
    if (!this.isChirping || !this.audioCtx || this.audioCtx.state !== 'running') return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime + delay;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const baseFreq = (2900 + Math.random() * 800) * pitchMultiplier;

    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.88, now + 0.12);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, now);
    filter.Q.setValueAtTime(3.5, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Schedule nature bird chirping patterns periodically
  startChirpingLoop() {
    if (!this.isChirping) return;
    this.initContext();

    const pattern = Math.floor(Math.random() * 3);
    const pitch = 0.95 + Math.random() * 0.25;

    if (pattern === 0) {
      this.playSingleChirp(pitch, 0);
      this.playSingleChirp(pitch * 1.08, 0.11);
    } else if (pattern === 1) {
      this.playSingleChirp(pitch * 0.96, 0);
      this.playSingleChirp(pitch * 1.15, 0.09);
      this.playSingleChirp(pitch * 1.04, 0.18);
    } else {
      this.playSingleChirp(pitch, 0);
    }

    const next = 1800 + Math.random() * 2600;
    this.chirpTimer = setTimeout(() => this.startChirpingLoop(), next);
  }

  stopChirping() {
    if (this.chirpTimer) {
      clearTimeout(this.chirpTimer);
      this.chirpTimer = null;
    }
  }

  // Procedural music box / soft piano notes for "Ki Naame Deke Bolbo Tomake"
  playNote(freq, startTime, duration = 0.6) {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle'; // Warm acoustic tone
    osc2.type = 'sine';

    osc.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 2, startTime); // Subtle octave shimmer

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.09, startTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Melodic line: "Ki naame deke bolbo tomake, mondo koreche amake oi duti chokhe"
  playKiNaameDekeMelody() {
    if (!this.isMelodyPlaying || this.hasLocalAudioFile) return;
    this.initContext();

    const notes = [
      { f: 392.00, d: 0.5 }, // G4: Ki
      { f: 440.00, d: 0.5 }, // A4: naa-
      { f: 493.88, d: 0.8 }, // B4: me
      { f: 587.33, d: 0.6 }, // D5: de-
      { f: 523.25, d: 0.5 }, // C5: ke
      { f: 493.88, d: 0.7 }, // B4: bol-
      { f: 440.00, d: 0.9 }, // A4: bo
      { f: 392.00, d: 1.2 }, // G4: to-ma-ke
      // pause
      { f: 440.00, d: 0.5 }, // A4: mon-
      { f: 493.88, d: 0.5 }, // B4: do
      { f: 523.25, d: 0.7 }, // C5: ko-
      { f: 493.88, d: 0.5 }, // B4: re-
      { f: 440.00, d: 0.7 }, // A4: che
      { f: 392.00, d: 0.6 }, // G4: a-
      { f: 369.99, d: 0.6 }, // F#4: ma-
      { f: 392.00, d: 1.4 }  // G4: ke...
    ];

    let t = this.audioCtx.currentTime + 0.1;
    for (let i = 0; i < notes.length; i++) {
      this.playNote(notes[i].f, t, notes[i].d * 0.95);
      t += notes[i].d * 0.75;
    }

    // Loop the melody gently every ~14 seconds
    setTimeout(() => {
      if (this.isMelodyPlaying && !this.hasLocalAudioFile) {
        this.playKiNaameDekeMelody();
      }
    }, 14500);
  }

  // Start background track or graceful synthesized melody
  startMusic() {
    this.initContext();
    this.startChirpingLoop();

    // Check if music.mp3 is loaded and playable
    const playPromise = this.bgSong.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.hasLocalAudioFile = true;
          this.isMelodyPlaying = false;
          this.musicDisc.classList.add('spinning');
          this.songSourceStatus.textContent = 'Playing music.mp3 🎵';
        })
        .catch(() => {
          // If no local music.mp3 found or blocked, use procedural acoustic melody
          this.hasLocalAudioFile = false;
          this.isMelodyPlaying = true;
          this.musicDisc.classList.add('spinning');
          this.songSourceStatus.textContent = 'Acoustic Melody • Drop music.mp3';
          this.playKiNaameDekeMelody();
        });
    }
  }

  toggleSong() {
    this.initContext();
    if (this.hasLocalAudioFile) {
      if (this.bgSong.paused) {
        this.bgSong.play();
        this.musicDisc.classList.add('spinning');
      } else {
        this.bgSong.pause();
        this.musicDisc.classList.remove('spinning');
      }
    } else {
      this.isMelodyPlaying = !this.isMelodyPlaying;
      if (this.isMelodyPlaying) {
        this.musicDisc.classList.add('spinning');
        this.playKiNaameDekeMelody();
      } else {
        this.musicDisc.classList.remove('spinning');
      }
    }
  }

  toggleBirds() {
    this.isChirping = !this.isChirping;
    if (this.isChirping) {
      this.soundIcon.textContent = '🕊️';
      this.startChirpingLoop();
    } else {
      this.soundIcon.textContent = '🔇';
      this.stopChirping();
    }
  }

  loadCustomAudioFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.bgSong.src = url;
    this.hasLocalAudioFile = true;
    this.isMelodyPlaying = false;
    this.bgSong.play().then(() => {
      this.musicDisc.classList.add('spinning');
      this.songSourceStatus.textContent = `Playing: ${file.name.slice(0, 24)}`;
    });
  }
}

// --- 2. Flying Birds Visual System ---
function createBirdSVG(scale = 1, color = '#684550') {
  const width = 46 * scale;
  const height = 30 * scale;

  return `
    <svg class="bird-svg" width="${width}" height="${height}" viewBox="0 0 50 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="bird-wing-left" d="M 22 18 C 16 10, 8 6, 2 8 C 8 15, 14 18, 22 18 Z" fill="${color}" opacity="0.95"/>
      <path class="bird-wing-right" d="M 22 18 C 28 9, 38 6, 46 8 C 40 15, 32 18, 22 18 Z" fill="${color}" opacity="0.88"/>
      <path d="M 20 26 C 22 23, 22 17, 24 16 C 26 15, 27 13, 26 11 C 25 10, 23 11, 22 12 C 21 14, 20 18, 18 25 Z" fill="${color}"/>
    </svg>
  `;
}

function initBirdsSky() {
  const sky = document.getElementById('birdsSky');
  sky.innerHTML = '';
  const birdCount = 10;

  for (let i = 0; i < birdCount; i++) {
    const bird = document.createElement('div');
    bird.className = 'bird-entity';

    const depthScale = 0.5 + Math.random() * 0.75;
    const topPercent = 6 + Math.random() * 60;
    const duration = 13 + Math.random() * 16;
    const delay = -(Math.random() * duration);
    const opacity = 0.45 + (depthScale * 0.45);

    const color = depthScale > 0.9 ? '#4b2a36' : (depthScale > 0.7 ? '#6f4453' : '#9a6b7b');

    bird.style.top = `${topPercent}%`;
    bird.style.opacity = opacity;
    bird.style.animationDuration = `${duration}s`;
    bird.style.animationDelay = `${delay}s`;
    bird.innerHTML = createBirdSVG(depthScale, color);

    sky.appendChild(bird);
  }
}

// --- 3. Ambient Floating Bokeh ---
function initBokeh() {
  const container = document.getElementById('bokehContainer');
  container.innerHTML = '';
  const count = 18;

  for (let i = 0; i < count; i++) {
    const orb = document.createElement('div');
    orb.className = 'bokeh-orb';
    const size = 20 + Math.random() * 70;
    const left = Math.random() * 100;
    const duration = 14 + Math.random() * 18;
    const delay = -(Math.random() * duration);

    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    orb.style.left = `${left}%`;
    orb.style.animationDuration = `${duration}s`;
    orb.style.animationDelay = `${delay}s`;

    container.appendChild(orb);
  }
}

// --- 4. Interactive Floating Hearts ---
function createFloatingHeart(x, y) {
  const container = document.getElementById('heartsContainer');
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  
  const hearts = ['💖', '💕', '🌸', '✨', '💗', '🕊️'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  const dx = (Math.random() - 0.5) * 120;
  const dx2 = dx + (Math.random() - 0.5) * 80;
  const rot = (Math.random() - 0.5) * 60;
  const rot2 = (Math.random() - 0.5) * 100;

  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty('--dx', `${dx}px`);
  heart.style.setProperty('--dx2', `${dx2}px`);
  heart.style.setProperty('--rot', `${rot}deg`);
  heart.style.setProperty('--rot2', `${rot2}deg`);

  container.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2200);
}

function createHeartBurst(centerX, centerY, count = 12) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const offsetX = centerX + (Math.random() - 0.5) * 200;
      const offsetY = centerY + (Math.random() - 0.5) * 140;
      createFloatingHeart(offsetX, offsetY);
    }, i * 35);
  }
}

// --- 5. Typewriter & Erase Engine ---
// Types text character-by-character into element
function typeText(element, text, speed = 80) {
  return new Promise((resolve) => {
    element.innerHTML = '<span class="text-span"></span><span class="caret-cursor"></span>';
    const textSpan = element.querySelector('.text-span');
    const cursor = element.querySelector('.caret-cursor');
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < text.length) {
        textSpan.textContent += text[idx];
        idx++;
      } else {
        clearInterval(interval);
        if (cursor) cursor.remove();
        resolve();
      }
    }, speed);
  });
}

// Erases text character-by-character backwards (fast snappy backspace animation)
function eraseText(element, speed = 14) {
  return new Promise((resolve) => {
    let current = element.textContent.trim();
    if (!current) {
      element.innerHTML = '';
      resolve();
      return;
    }
    element.innerHTML = `<span class="text-span">${current}</span><span class="caret-cursor"></span>`;
    const textSpan = element.querySelector('.text-span');

    const interval = setInterval(() => {
      if (current.length > 0) {
        current = current.slice(0, -1);
        textSpan.textContent = current;
      } else {
        clearInterval(interval);
        element.innerHTML = '';
        resolve();
      }
    }, speed);
  });
}

// Sleep utility for delay lines
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- 6. Story Progression Controller (Pure Floating Text, No Box) ---
const audioMgr = new RomanticAudioManager();

const countdownOverlay = document.getElementById('countdownOverlay');
const countdownDigit = document.getElementById('countdownDigit');
const progressFill = document.getElementById('progressFill');
const storyStage = document.getElementById('storyStage');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
const line4 = document.getElementById('line4');
const tapHint = document.getElementById('tapHint');
const replayBtn = document.getElementById('replayBtn');
const confettiBtn = document.getElementById('confettiBtn');

function clearAllLines() {
  [line1, line2, line3, line4].forEach(l => {
    if (l) {
      l.className = 'story-line';
      l.innerHTML = '';
    }
  });
}

let isStoryRunning = false;

async function runStorySequence() {
  if (isStoryRunning) return;
  isStoryRunning = true;

  storyStage.classList.add('active');
  clearAllLines();

  // ==========================================
  // SCENE 1: Big "ON" -> "22 April, 2026"
  // ==========================================
  line1.className = 'story-line typo-on';
  await typeText(line1, 'ON', 90);
  createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.4, 6);

  await wait(900);

  line2.className = 'story-line typo-date';
  await typeText(line2, '22 April, 2026', 65);
  createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.55, 8);

  // Increased page duration
  await wait(4200);

  // Fast Erase
  await eraseText(line2, 14);
  line2.className = 'story-line';
  await eraseText(line1, 14);
  line1.className = 'story-line';

  await wait(350);

  // ==========================================
  // SCENE 2: "Two souls on earth" -> "Got to know each other"
  // ==========================================
  line1.className = 'story-line typo-souls';
  await typeText(line1, 'Two souls on earth', 65);
  createHeartBurst(window.innerWidth * 0.45, window.innerHeight * 0.42, 6);

  await wait(1000);

  line2.className = 'story-line typo-know';
  await typeText(line2, 'Got to know each other', 65);
  createHeartBurst(window.innerWidth * 0.55, window.innerHeight * 0.55, 10);

  // Increased page duration
  await wait(4800);

  // Fast Erase
  await eraseText(line2, 14);
  line2.className = 'story-line';
  await eraseText(line1, 14);
  line1.className = 'story-line';

  await wait(400);

  // ==========================================
  // SCENE 3: Dark Golden Glittering Names & Royal Blue Ampersand
  // "Ha-mim Tasnim" -> "&" (blue) -> "Najmus Sakib Thoha"
  // Active for 5 more seconds (total ~7.8s)
  // ==========================================
  line1.className = 'story-line typo-hamim gold-glitter-text';
  await typeText(line1, 'Ha-mim Tasnim', 70);
  createHeartBurst(window.innerWidth * 0.5, window.innerHeight * 0.35, 10);

  await wait(600);

  line2.className = 'story-line typo-ampersand';
  await typeText(line2, '&', 50);

  await wait(600);

  line3.className = 'story-line typo-sakib gold-glitter-text';
  await typeText(line3, 'Najmus Sakib Thoha', 70);
  createHeartBurst(window.innerWidth * 0.5, window.innerHeight * 0.65, 16);

  // Active for 5 more seconds as requested (7800ms)
  await wait(7800);

  // Fast Erase of all 3 lines
  await eraseText(line3, 14);
  line3.className = 'story-line';
  await eraseText(line2, 14);
  line2.className = 'story-line';
  await eraseText(line1, 14);
  line1.className = 'story-line';

  await wait(400);

  // ==========================================
  // SCENE 4: First Split Page
  // "with the greatfulness," -> "love"
  // ==========================================
  line1.className = 'story-line typo-gratefulness';
  await typeText(line1, 'with the greatfulness,', 65);

  await wait(800);

  line2.className = 'story-line typo-love';
  await typeText(line2, 'love', 80);
  createHeartBurst(window.innerWidth * 0.5, window.innerHeight * 0.52, 10);

  // Increased duration for this page
  await wait(4500);

  // Fast Erase before next page
  await eraseText(line2, 14);
  line2.className = 'story-line';
  await eraseText(line1, 14);
  line1.className = 'story-line';

  await wait(400);

  // ==========================================
  // SCENE 5: Second Split Page
  // "and a dream" -> "together"
  // ==========================================
  line1.className = 'story-line typo-dream';
  await typeText(line1, 'and a dream', 70);

  await wait(900);

  line2.className = 'story-line typo-together';
  await typeText(line2, 'together', 85);
  createHeartBurst(window.innerWidth * 0.5, window.innerHeight * 0.55, 24);

  // Hold final celebratory page
  await wait(6000);

  isStoryRunning = false;
}

// --- 7. 5-Second Countdown Controller ---
let countdownTimer = null;
let progressInterval = null;

function startCountdown() {
  if (countdownTimer) clearTimeout(countdownTimer);
  if (progressInterval) clearInterval(progressInterval);

  countdownOverlay.classList.remove('hidden');
  storyStage.classList.remove('active');
  clearAllLines();
  isStoryRunning = false;

  countdownDigit.className = 'counter-number pulse';
  countdownDigit.textContent = '3';
  progressFill.style.width = '0%';

  const totalDuration = 5000; // Exact 5 seconds
  const startTime = Date.now();

  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min(100, (elapsed / totalDuration) * 100);
    progressFill.style.width = `${percent}%`;

    if (percent >= 100) {
      clearInterval(progressInterval);
    }
  }, 25);

  audioMgr.playSingleChirp(1.0);

  // At 1.35s: '2'
  setTimeout(() => {
    countdownDigit.className = 'counter-number';
    void countdownDigit.offsetWidth;
    countdownDigit.className = 'counter-number pulse';
    countdownDigit.textContent = '2';
    audioMgr.playSingleChirp(1.1);
  }, 1350);

  // At 2.7s: '1'
  setTimeout(() => {
    countdownDigit.className = 'counter-number';
    void countdownDigit.offsetWidth;
    countdownDigit.className = 'counter-number pulse';
    countdownDigit.textContent = '1';
    audioMgr.playSingleChirp(1.2);
  }, 2700);

  // At 4.0s: 'Go! ✨'
  setTimeout(() => {
    countdownDigit.className = 'counter-number go pulse';
    countdownDigit.textContent = 'Go! ✨';
    audioMgr.playSingleChirp(1.35);
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 14);
  }, 4000);

  // At 5.0s: Finish countdown and launch story sequence
  countdownTimer = setTimeout(() => {
    countdownOverlay.classList.add('hidden');
    runStorySequence();
  }, totalDuration);
}

// --- 8. User Interaction & Handlers ---
function handleFirstInteraction() {
  audioMgr.startMusic();
  if (tapHint) {
    tapHint.style.opacity = '0';
  }
  window.removeEventListener('click', handleFirstInteraction);
  window.removeEventListener('touchstart', handleFirstInteraction);
}

window.addEventListener('click', handleFirstInteraction, { once: true });
window.addEventListener('touchstart', handleFirstInteraction, { once: true });

// Song Play/Pause button
audioMgr.songPlayBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  audioMgr.toggleSong();
});

// Chirping Birds toggle
audioMgr.soundToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  audioMgr.toggleBirds();
});

// Custom local music file loader
audioMgr.musicFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    audioMgr.loadCustomAudioFile(file);
  }
});

// Replay button
replayBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startCountdown();
});

// Love button
confettiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const rect = confettiBtn.getBoundingClientRect();
  createHeartBurst(rect.left + rect.width / 2, rect.top, 18);
  audioMgr.playSingleChirp(1.25);
});

// Click anywhere on sky for floating hearts
window.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('label')) return;
  createFloatingHeart(e.clientX, e.clientY);
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initBirdsSky();
  initBokeh();
  startCountdown();

  // Try auto-starting sound if browser permits
  setTimeout(() => {
    audioMgr.startMusic();
  }, 300);
});
