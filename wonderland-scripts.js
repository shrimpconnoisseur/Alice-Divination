'use strict';

// Character Configs
const CHARACTERS = {
  alice: {
    folder: 'resources/alice',
    idle: ['alice_idle1.gif', 'alice_idle2.gif'],
    startup: ['alice_happy1.gif', 'alice_happy2.gif', 'alice_idle1.gif', 'alice_idle2.gif', 'alice_taunt1.gif', 'alice_taunt2.gif'],
    happy: ['alice_happy1.gif', 'alice_happy2.gif'],
    taunt: ['alice_taunt1.gif', 'alice_taunt2.gif', 'alice_taunt3.gif'],
    sad: ['alice_sad1.gif', 'alice_sad2.gif'],
    surprised: ['alice_surprised.gif'],
    ignore: ['alice_ignore.gif', 'alice_averteyes.gif'],
    smash: ['alice_smash.gif'],
    angry: ['alice_angry1.gif', 'alice_angry2.gif', 'alice_angry3.gif'],
    ouch: ['alice_ouch.gif'],

    startupLines: [
      "Another one falls into Wonderland!",
      "Ah, a new seeker of fate!",
      "Welcome! Please, try not to get lost.",
      "Want a peek at your future? I can't promise a bright one, though!",
    ],
    goodDrawLines: [
      "Oh? Seems like the stars have smiled upon you!",
      "Wow! Even I'm a little impressed.",
      "Seems like the cards favour you... for now.",
      "What luck! Don't waste it!",
    ],
    badDrawLines: [
      "Yikes. I almost feel sorry for you.",
      "I swear I didn't rig the cards... maybe.",
      "How unfortunate for you!",
      "You're still going to have to pay me, you know.",
      "Ouch. Try again tomorrow, maybe?",
    ],
    clickLines: [
      "Gonna draw some cards? Might as well, right? It's not like anyone is gonna come looking for you here!",
      "What? Do I have something on my face?",
      "You'll get my clothes dirty.",
      "Do you MIND?",
      "Are you lost? Sorry, that was a stupid question. Of course you are.",
    ],
    bonkLines: [
      "Is this my bad luck?!",
      "Hey! Watch it!",
      "I'll increase the payment for this!",
      "Can you NOT?!",
      "This won't change your results!",
    ],
    errorLines: [
      "Umm... I swear this doesn't happen often!",
      "Oops, I might have left my cards at home...",
    ],
    // used for dev mode password, will react if the user guesses it right or wrong
    correctGuessLines: [
      "Did the cards tell you the password?!",
      "There's no way you guessed it without peeking at the code!",
      "Are you that desperate to draw cards?",
    ],
    incorrectGuessLines: [
      "Keeping guessing, you almost had it!",
      "Wow, you got it right! Just kidding, try again!",
      "Maybe I should store all these guesses and make fun of you for them later...",
    ],
  },

  yomi: {
    folder: 'resources/yomi',
    idle: ['yomi_idle1.gif', 'yomi_idle2.gif'],
    startup: ['yomi_happy1.gif', 'yomi_happy2.gif', 'yomi_idle1.gif', 'yomi_idle2.gif', 'yomi_dance.gif'],
    happy: ['yomi_happy1.gif', 'yomi_happy2.gif'],
    taunt: ['yomi_dance.gif'],
    sad: ['yomi_sad1.gif', 'yomi_sad2.gif'],
    surprised: ['yomi_surprised.gif'],
    ignore: ['yomi_surprised.gif'],
    smash: ['yomi_smash.gif'],
    angry: ['yomi_angry1.gif', 'yomi_angry2.gif'],
    ouch: ['yomi_ouch.gif'],

    startupLines: [
      "Hello! I hope the cards are kind to you today.",
      "Welcome to Wonderland~ Let's see what fate has in store!",
      "Don't tell that phantom I'm here, okay?",
      "The cards are ready whenever you are!",
      "I'll do my best to guide you through this.",
    ],
    goodDrawLines: [
      "Oh wonderful! The cards are smiling at you!",
      "See? I had a good feeling about this!",
      "That's a beautiful draw~ you should be happy!",
      "The universe is on your side today!",
      "I'm so glad the cards were kind to you!",
    ],
    badDrawLines: [
      "Oh... oh no. I'm so sorry...",
      "Don't worry! It's just one reading, things will get better.",
      "The cards can be harsh sometimes... but you'll be okay.",
      "I wish I could make it better for you...",
      "Hmm... perhaps try again tomorrow? I'll be here for you.",
    ],
    clickLines: [
      "Yes? Can I help you?",
      "Oh! Hello~",
      "Is everything alright?",
      "I'm here if you need guidance.",
      "The cards are patient. So am I.",
      "Thinking about drawing?",
      "Take your time, there's no rush.",
    ],
    bonkLines: [
      "Ow... that hurts!",
      "Oh! W-what was that for?",
      "T-That's not very nice!",
      "Was there something wrong with the cards?",
      "I can get mad too, you know!",
    ],
    errorLines: [
      "Did something happen to the cards? That's not good...",
      "That phantom must have taken back her cards. Oh well...",
    ],
    correctGuessLines: [
      "Did the phantom tell you the password?",
      "I didn't even know we had that...",
    ],
    incorrectGuessLines: [
      "What are you even trying to guess?",
      "Huh? What's that box for?",
      "Umm... take your time, I guess?",
    ],
  },
};

// Character Placer
// REPLACED THE CLICK TO DRAG FEATURE DUE TO CONFLICTS WITH THE CHARACTER CONTROLLER CLASS
class CharacterPlacer {
  constructor() {
    this.el        = document.getElementById('character-float');
    this.resetBtn  = document.getElementById('bubble-reset-char');
    this.moveBtn   = document.getElementById('bubble-move-char');
    this.costumeBtn = document.getElementById('bubble-char-costume');
    this.preview   = null;
    this.placing   = false;

    if (this.el) this._loadPosition();

    this.resetBtn?.addEventListener('click', () => this.reset());
    this.moveBtn?.addEventListener('click', () => this._togglePlaceMode());
  }

  _togglePlaceMode() {
    this.placing ? this._exitPlaceMode() : this._enterPlaceMode();
  }

  _enterPlaceMode() {
    this.placing = true;
    this.moveBtn.classList.add('active');

    this.preview = document.createElement('div');
    this.preview.id = 'character-preview';
    this.preview.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 199;
      opacity: 0.45;
      filter: drop-shadow(0 0 16px rgba(77, 217, 232, 0.8));
      transition: left 0.05s, top 0.05s;
    `;

    const img = document.createElement('img');
    img.src = document.getElementById('character-gif').src;
    img.style.cssText = document.getElementById('character-gif').style.cssText;
    img.style.width   = getComputedStyle(document.getElementById('character-gif')).width;
    img.style.animation = 'none';
    this.preview.appendChild(img);
    document.body.appendChild(this.preview);

    document.body.style.cursor = 'crosshair';

    this._onMouseMove = (e) => this._trackPreview(e.clientX, e.clientY);
    this._onClick     = (e) => this._placeAt(e.clientX, e.clientY);

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('click',     this._onClick,     { once: false });

    this._onKeyDown = (e) => { if (e.key === 'Escape') this._exitPlaceMode(); };
    document.addEventListener('keydown', this._onKeyDown);
  }

  _exitPlaceMode() {
    this.placing = false;
    this.moveBtn?.classList.remove('active');
    document.body.style.cursor = '';

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('click',     this._onClick);
    document.removeEventListener('keydown',   this._onKeyDown);

    this.preview?.remove();
    this.preview = null;
  }

  _trackPreview(clientX, clientY) {
    if (!this.preview) return;

    const w = this.preview.offsetWidth;
    const h = this.preview.offsetHeight;

    const left = Math.max(0, Math.min(clientX - w / 2, window.innerWidth  - w));
    const top  = Math.max(0, Math.min(clientY - h / 2, window.innerHeight - h));
    this.preview.style.left = left + 'px';
    this.preview.style.top  = top  + 'px';
  }

  _placeAt(clientX, clientY) {
    const target = document.elementFromPoint(clientX, clientY);
    if (this.moveBtn?.contains(target) || this.resetBtn?.contains(target)) return;

    const w = this.el.offsetWidth;
    const h = this.el.offsetHeight;
    const left = Math.max(0, Math.min(clientX - w / 2, window.innerWidth  - w));
    const top  = Math.max(0, Math.min(clientY - h / 2, window.innerHeight - h));

    this.el.style.transition = 'left 0.25s ease, top 0.25s ease';
    this.el.style.bottom = 'auto';
    this.el.style.right  = 'auto';
    this.el.style.left   = left + 'px';
    this.el.style.top    = top  + 'px';
    setTimeout(() => { this.el.style.transition = ''; }, 250);

    this._savePosition();
    this._exitPlaceMode();
  }

  _savePosition() {
    localStorage.setItem('characterPos', JSON.stringify({
      left: this.el.style.left,
      top:  this.el.style.top,
    }));
  }

  _loadPosition() {
    const saved = localStorage.getItem('characterPos');
    if (!saved) return;
    try {
      const { left, top } = JSON.parse(saved);
      this.el.style.bottom = 'auto';
      this.el.style.right  = 'auto';
      this.el.style.left   = left;
      this.el.style.top    = top;
    } catch (e) {
      console.error('Could not load character position:', e);
    }
  }

  reset() {
    const title   = document.querySelector('.title');
    const floatEl = this.el;

    if (title) {
      const titleRect = title.getBoundingClientRect();
      const floatRect = floatEl.getBoundingClientRect();
      const newLeft   = titleRect.left + titleRect.width / 2 - floatRect.width / 2;
      const newTop    = titleRect.bottom + 16;

      localStorage.removeItem('characterPos');
      floatEl.style.transition = 'left 0.4s ease, top 0.4s ease';
      floatEl.style.bottom = 'auto';
      floatEl.style.right  = 'auto';
      floatEl.style.left   = newLeft + 'px';
      floatEl.style.top    = newTop  + 'px';
      setTimeout(() => { floatEl.style.transition = ''; }, 400);
    } else {
      localStorage.removeItem('characterPos');
      floatEl.style.transition = 'left 0.4s ease, top 0.4s ease';
      floatEl.style.left   = '2rem';
      floatEl.style.top    = 'auto';
      floatEl.style.bottom = '2rem';
      floatEl.style.right  = 'auto';
      setTimeout(() => { floatEl.style.transition = ''; }, 400);
    }
  }
}

// Card Classification
const POSITIVE_CARD_IDS = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 19, 20, 21]);
const REVERSED_POSITIVE_IDS = new Set([15]); // negative upright, positive reversed

function isPositiveReading(drawnCards) {
  const positiveCount = drawnCards.filter((d) => {
    const id = d.card.id;
    if (d.reversed) {
      return REVERSED_POSITIVE_IDS.has(id); // positive only when reversed
    } else {
      return POSITIVE_CARD_IDS.has(id);     // positive only when upright
    }
  }).length;

  return positiveCount > drawnCards.length / 2;
}

// helpers
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// tarot image path
function cardImagePath(card) {
  const name = card.title.replace(/\s+/g, '');
  return `resources/tarot/${pad(card.id)}-${name}.png`;
}

// Reading Mode Toggle
class ReadingModeToggle {
  constructor(onChange) {
    this.isThreeCard = false;
    this.onChange = onChange;
    this.track = document.getElementById('reading-toggle');
    this.labelSingle = document.getElementById('label-single');
    this.labelThree = document.getElementById('label-three');
    this.cardPast = document.querySelector('[data-position="past"]');
    this.cardFuture = document.querySelector('[data-position="future"]');
    this.presentLabel = document.querySelector('[data-position="present"] .position-label');

    if (this.track) {
      this.track.addEventListener('click', () => this.toggle());
    }

    this.apply(false); // default to single card mode
  }

  toggle() {
    this.apply(!this.isThreeCard);
  }

  apply(threeCard) {
    this.isThreeCard = threeCard;

    if (this.track) {
      this.track.classList.toggle('three-card', threeCard);
    }
    if (this.labelSingle) {
      this.labelSingle.classList.toggle('active', !threeCard);
    }
    if (this.labelThree) {
      this.labelThree.classList.toggle('active', threeCard);
    }

    const fade = threeCard ? '1' : '0';
    const scale = threeCard ? 'scale(1)' : 'scale(0.85)';
    const ptr = threeCard ? '' : 'none';

    for (const el of [this.cardPast, this.cardFuture]) {
      if (!el) continue;
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = fade;
      el.style.transform = scale;
      el.style.pointerEvents = ptr;
    }

    if (this.presentLabel) {
      this.presentLabel.textContent = threeCard ? 'Present' : 'Daily Fortune';
    }

    if (this.onChange) {
      this.onChange(threeCard);
    }
  }

  setLocked(locked) {
    if (this.track) {
      this.track.style.pointerEvents = locked ? 'none' : '';
      this.track.style.opacity = locked ? '0.5' : '';
    }
  }
}

// Character Controller
class CharacterController {
  constructor() {
    this.gif = document.getElementById('character-gif');
    this.bubble = document.getElementById('speech-bubble');
    this.speech = document.getElementById('character-speech');
    this.sprite = document.querySelector('.character-sprite');

    this.charKey = null;
    this.cfg = null;
    this.bubbleTimer = null;
    this.bonking = false;
    this.locked = false;

    this._setupClickZones();
  }

  // startup gif and lines
  init() {
    const isYomi = Math.random() < 0.10; // 10% chance for Yomi instead of Alice
    this.charKey = isYomi ? 'yomi' : 'alice';
    this.cfg = CHARACTERS[this.charKey];

    const startGif = pick(this.cfg.startup);
    this._setGif(startGif);
    this.speak(pick(this.cfg.startupLines));
  }

  // gif helper
  _setGif(filename) {
    if (this.gif) this.gif.src = `${this.cfg.folder}/${filename}`;
  }

  _setIdle() {
    this._setGif(pick(this.cfg.idle));
  }

  // speech bubble helper
  speak(text, durationMs = 4000) {
    if (!this.speech || !this.bubble) return;

    clearTimeout(this.bubbleTimer);
    this.speech.textContent = text;
    this.bubble.classList.add('active');

    if (durationMs > 0) {
      this.bubbleTimer = setTimeout(() => {
        this.bubble.classList.remove('active');
      }, durationMs);
    }
  }

  hideSpeech() {
    clearTimeout(this.bubbleTimer);
    if (this.bubble) this.bubble.classList.remove('active');
  }

  // click zone helper
  _setupClickZones() {
    if (!this.sprite) return;

    this.sprite.addEventListener('click', (e) => {
      if (this.bonking || this.locked) return;

      const rect = this.gif.getBoundingClientRect();
      const relY = (e.clientY - rect.top) / rect.height;

      if (relY < 0.35) {
        this._bonk();
      } else {
        this._poke();
      }
    });
  }

  _poke() {
    this.speak(pick(this.cfg.clickLines));
  }

  async _bonk() {
    if (this.bonking) return;

    this.bonking = true;
    new Audio('resources/bonk.ogg').play();
    this.speak(pick(this.cfg.bonkLines), 0);

    // play 'smash' animation
    this._setGif(pick(this.cfg.smash));
    await sleep(1000);

    this._setGif(pick(this.cfg.ouch));
    await sleep(2500);

    this._setIdle();
    this.hideSpeech();
    this.bonking = false;
  }

  // Reading Reactions
  reactToReading(drawnCards) {
    const positive = isPositiveReading(drawnCards);

    if (positive) {
      this._setGif(pick(this.cfg.happy));
      this.speak(pick(this.cfg.goodDrawLines), 6000);
    } else {
      if (this.charKey === 'alice') {
        this._setGif(pick(this.cfg.taunt));
        this.speak(pick(this.cfg.badDrawLines), 6000);
      } else {
        this._setGif(pick(this.cfg.sad));
        this.speak(pick(this.cfg.badDrawLines), 6000);
      }
    }
  }

  reactToSingleCard(drawn) {
    this.reactToReading([drawn]);
  }

  // Lock function during draw sequences
  setLocked(locked) {
    this.locked = locked;
  }

  returnToIdle() {
    this._setIdle();
  }
}

// character visibility toggle
const charToggle = document.getElementById('settings-show-character');
const characterFloat = document.getElementById('character-float');

if (localStorage.getItem('wonderland_hide_character') === 'true') {
  if (characterFloat) characterFloat.style.display = 'none';
  if (charToggle) charToggle.checked = false;
}

charToggle?.addEventListener('change', () => {
  const hidden = !charToggle.checked;
  if (characterFloat) characterFloat.style.display = hidden ? 'none' : '';
  localStorage.setItem('wonderland_hide_character', String(hidden));
});

// high contrast mode
const highContrastToggle = document.getElementById('settings-high-contrast');

if (localStorage.getItem('wonderland_high_contrast') === 'true') {
  document.body.classList.add('high-contrast');
  if (highContrastToggle) highContrastToggle.checked = true;
}

highContrastToggle?.addEventListener('change', () => {
  const enabled = highContrastToggle.checked;
  document.body.classList.toggle('high-contrast', enabled);
  localStorage.setItem('wonderland_high_contrast', String(enabled));
});


// Tarot Reading
class TarotReading {
  constructor() {
    this.cards = [];
    this.reading = null;
    
    this.character = new CharacterController();
    this.toggle = new ReadingModeToggle((isThree) => {
      if (this.reading) this._resetBoard();
    });

    this.init();
  }

  async init() {
    await this._loadCards();
    this.character.init();
    this._setupEventListeners();
    this._checkCooldown();
  }

  async _loadCards() {
    try {
      const res = await fetch('resources/tarot-cards.json');
      const data = await res.json();
      this.cards = data.cards;
    } catch (err) {
      console.error('Failed to load tarot cards:', err);
      this.character._setGif(pick(this.character.cfg.surprised));
      this.character.speak(pick(this.character.cfg.errorLines), 8000);
    }
  }

  _setupEventListeners() {
    const drawBtn = document.querySelector('.draw-button');
    const closeBtn = document.getElementById('close-modal');
    const modal = document.getElementById('card-modal');

    if (drawBtn) {
      drawBtn.addEventListener('click', () => this._performReading());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this._closeModal());
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this._closeModal();
      });
    }

    document.querySelectorAll('.card-wrapper').forEach((wrapper) => {
      wrapper.addEventListener('click', () => {
        const pos = wrapper.closest('.card-position')?.dataset.position;
        if (!pos || !this.reading) return;
        const drawn = this.reading.find((d) => d.position === pos);
        if (drawn && wrapper.classList.contains('flipped')) {
          this._openModal(drawn);
        }
      });
    });
  }

  _cooldownKey() {
    return 'wonderland_last_reading';
  }

  // Include a timer where the status text is.
  // The _setStatus call if the user has already drawn today should be appended underneath the timer.
  _checkCooldown() {
    const last = localStorage.getItem(this._cooldownKey());
    const drawBtn = document.querySelector('.draw-button');

    if (document.body.classList.contains('dev-mode')) {
      const drawBtn = document.querySelector('.draw-button');
      if (drawBtn) drawBtn.disabled = false;
      this._setStatus("Developer mode active!");
      return;
    }

    if (!drawBtn) return;

    if (last) {
      const lastDate = new Date(parseInt(last, 10));
      const today = new Date();
      const sameDay = 
        lastDate.getDate() === today.getDate() &&
        lastDate.getMonth() === today.getMonth() &&
        lastDate.getFullYear() === today.getFullYear();
      
      if (sameDay) {
        drawBtn.disabled = true;
        this._setStatus("You've already drawn your fortune today. Come back tomorrow!");
        this._restoreLastReading();
        return;
      }
    }

    drawBtn.disabled = false;
    this._setStatus("Let Alice perform a divination to see the reading status!");
  }

  _setStatus(text) {
    const el = document.getElementById('status-text');
    if (el) el.textContent = text;
  }

  _drawCards(count) {
    const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
    const positions = count === 1
      ? ['present']
      : ['past', 'present', 'future'];
    
    return shuffled.slice(0, count).map((card, i) => ({
      card,
      reversed: Math.random() < 0.33,
      position: positions[i],
    }));
  }

  async _performReading() {
    if (this.cards.length === 0) return;

    const count = this.toggle.isThreeCard ? 3 : 1;
    this.reading = this._drawCards(count);

    // Lock UI
    const drawBtn = document.querySelector('.draw-button');
    if (drawBtn) drawBtn.disabled = true;
    this.toggle.setLocked(true);
    this.character.setLocked(true);

    this._setStatus("The cards are being drawn...");

    // Flip
    for (const drawn of this.reading) {
      await sleep(400);
      this._flipCard(drawn);
    }

    await sleep(800);

    // React
    this.character.reactToReading(this.reading);

    // Status Summary
    const names = this.reading.map(
      (d) => `${d.card.title}${d.reversed ? ' (R)' : ''}`
    ).join(' . ');
    this._setStatus(`Reading: ${names} - click a card for details!`);

    // Persist
    const readingPayload = {
      mode: count === 1 ? 'single' : 'three',
      cards: this.reading.map((d) => ({
        cardId: d.card.id,
        position: d.position,
        reversed: d.reversed,
      })),
    };

    const { data: { session } } = await window._supabase.auth.getSession();

    if (session) {
      // if logged in then save to supabase
      await window._supabase.from('readings').insert({
        user_id: session.user.id,
        mode: readingPayload.mode,
        cards: readingPayload.cards,
        drawn_at: new Date().toISOString(),
      });
    } else {
      // if not, then save to local storage
      const history = JSON.parse(localStorage.getItem('wonderland_divination_history') ?? '[]');
      history.push({
        id: crypto.randomUUID(),
        mode: readingPayload.mode,
        cards: readingPayload.cards,
        drawn_at: new Date().toISOString(),
      });
      localStorage.setItem('wonderland_divination_history', JSON.stringify(history));
    }

    // cooldown is kept regardless, of course
    localStorage.setItem(this._cooldownKey(), Date.now().toString());
    localStorage.setItem('wonderland_last_reading_data', JSON.stringify(readingPayload.cards));

    // Swap Draw to Reset
    this._swapToReset(drawBtn);

    this.character.setLocked(false);
    this.toggle.setLocked(false);
  }

  _flipCard(drawn) {
    const wrapper = document.getElementById(`card-${drawn.position}`);
    if (!wrapper) return;

    wrapper.querySelector('.card-front')?.remove();

    // front face
    const front = document.createElement('div');
    front.className = 'card-front';
    if (drawn.reversed) front.classList.add('reversed');

    const img = document.createElement('img');
    img.src = cardImagePath(drawn.card);
    img.alt = drawn.card.title;
    front.appendChild(img);

    wrapper.appendChild(front);
    wrapper.classList.add('flipped', 'clickable');
  }

  _restoreLastReading() {
    const raw = localStorage.getItem('wonderland_last_reading_data');
    if (!raw || this.cards.length === 0) return;

    try {
      const saved = JSON.parse(raw);
      this.reading = saved.map(({ cardId, reversed, position }) => ({
        card: this.cards.find((c) => c.id === cardId),
        reversed,
        position,
      })).filter((d) => d.card);

      const isThree = this.reading.length === 3;
      this.toggle.apply(isThree);

      for (const drawn of this.reading) {
        this._flipCard(drawn);
      }

      const names = this.reading.map(
        (d) => `${d.card.title}${d.reversed ? ' (R)' : ''}`
      ).join(' . ');
      this._setStatus(`Last Reading: ${names} - click a card for details!`);

      const drawBtn = document.querySelector('.draw-button');
      this._swapToReset(drawBtn);
    } catch (err) {
      console.warn('Failed to restore last reading:', err);
    }
  }

  _resetBoard() {
    this.reading = null;
    ['past', 'present', 'future'].forEach((pos) => {
      const wrapper = document.getElementById(`card-${pos}`);
      if (!wrapper) return;
      wrapper.classList.remove('flipped', 'clickable');

      // remove injected front face
      const front = wrapper.querySelector('.card-front');
      if (front) front.remove();
    });

    this.character.returnToIdle();
    this.character.hideSpeech();
    this.toggle.setLocked(false);
    this._checkCooldown();
  }

  _swapToReset(drawBtn) {
    if (!drawBtn) return;
    drawBtn.textContent = 'Reset';
    drawBtn.disabled = false;

    // replace listener
    const fresh = drawBtn.cloneNode(true);
    drawBtn.parentNode.replaceChild(fresh, drawBtn);
    
    fresh.addEventListener('click', () => {
      fresh.textContent = 'Draw Cards';
      const next = fresh.cloneNode(true);
      fresh.parentNode.replaceChild(next, fresh);
      next.addEventListener('click', () => this._performReading());
      this._resetBoard();
    });
  }

  _openModal(drawn) {
    const { card, reversed, position } = drawn;
    const modal = document.getElementById('card-modal');
    if (!modal) return;

    // card img
    const imgEl = document.getElementById('modal-card-image');
    if (imgEl) {
      imgEl.src = cardImagePath(card);
      imgEl.alt = card.title;
      imgEl.style.transform = reversed ? 'rotate(180deg)' : '';
    }

    // reversed indicator
    const revInd = document.getElementById('reversed-indicator');
    if (revInd) revInd.style.display = reversed ? 'block' : 'none';

    // card name
    const nameEl = document.getElementById('modal-card-name');
    if (nameEl) nameEl.textContent = card.title;

    // overall meaning
    const overallEl = document.getElementById('modal-overall-meaning');
    if (overallEl) {
      overallEl.textContent = reversed
        ? card.reversed.overall
        : card.upright.overall;
    }

    // temporal interpretation
    const temporalTitle = document.getElementById('modal-temporal-title');
    const temporalEl = document.getElementById('modal-temporal-meaning');

    const posLabel = {
      past: 'Past',
      present: this.toggle.isThreeCard ? 'Present' : 'Daily Fortune',
      future: 'Future',
    }[position] ?? 'Interpretation';

    if (temporalTitle) temporalTitle.textContent = posLabel;
    if (temporalEl) {
      const temporal = reversed
        ? card.reversed[position] ?? card.reversed.overall
        : card.upright[position] ?? card.upright.overall;
      temporalEl.textContent = temporal;
    }

    // reversed
    const reversedSection = document.getElementById('reversed-meaning-section');
    const reversedEl = document.getElementById('modal-reversed-meaning');
    if (reversedSection) reversedSection.style.display = reversed ? 'block' : 'none';
    if (reversedEl) reversedEl.textContent = card.reversed.overall;

    modal.classList.add('active');
  }

  _closeModal() {
    const modal = document.getElementById('card-modal');
    if (modal) modal.classList.remove('active');
  }
}

const signupBubble      = document.getElementById('bubble-signup');
const signupDropdown    = document.getElementById('signup-dropdown');
const signupBubbleLabel = document.getElementById('signup-bubble-label');
const authPanel         = document.getElementById('auth-panel');
const profilePanel      = document.getElementById('profile-panel');
const profileUsername   = document.getElementById('profile-username');
const authError         = document.getElementById('auth-error');
const emailField        = document.getElementById('email-field');
const btnSignup         = document.getElementById('btn-signup');
const btnLogin          = document.getElementById('btn-login');
const btnLogout         = document.getElementById('btn-logout');

// Toggle dropdown
signupBubble?.addEventListener('click', (e) => {
  e.stopPropagation();
  signupDropdown.classList.toggle('open');
  signupBubble.classList.toggle('active');
});
signupDropdown?.addEventListener('click', (e) => e.stopPropagation());
document.addEventListener('click', () => {
  signupDropdown?.classList.remove('open');
  signupBubble?.classList.remove('active');
});

function setAuthError(msg) {
  if (authError) authError.textContent = msg;
}

function setLoggedIn(username) {
  authPanel.style.display     = 'none';
  profilePanel.style.display  = 'block';
  profileUsername.textContent = username;
  signupBubbleLabel.textContent = 'Profile';
  signupBubble.classList.add('logged-in');
}

function setLoggedOut() {
  authPanel.style.display    = 'block';
  profilePanel.style.display = 'none';
  signupBubbleLabel.textContent = 'Join us in Wonderland!';
  signupBubble.classList.remove('logged-in');
  document.getElementById('signup-username').value = '';
  document.getElementById('signup-email').value    = '';
  document.getElementById('signup-password').value = '';
  emailField.classList.remove('hidden');
  setAuthError('');
}

let authMode = 'signup';

function setAuthMode(mode) {
  authMode = mode;
  if (mode === 'login') {
    emailField.classList.add('hidden');
    btnSignup.classList.add('signup-submit--secondary');
    btnSignup.classList.remove('signup-submit');
    btnLogin.classList.add('signup-submit');
    btnLogin.classList.remove('signup-submit--secondary');
  } else {
    emailField.classList.remove('hidden');
    btnSignup.classList.remove('signup-submit--secondary');
    btnSignup.classList.add('signup-submit');
    btnLogin.classList.remove('signup-submit');
    btnLogin.classList.add('signup-submit--secondary');
  }
  setAuthError('');
}

btnSignup?.addEventListener('click', async () => {
  if (authMode === 'login') {
    setAuthMode('signup');
    return;
  }
  await handleSignup();
});

btnLogin?.addEventListener('click', async () => {
  if (authMode === 'signup') {
    setAuthMode('login');
    return;
  }
  await handleLogin();
});

async function handleSignup() {
  const username = document.getElementById('signup-username').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  setAuthError('');

  if (!username || !email || !password) {
    setAuthError('Please fill in all fields.');
    return;
  }
  if (username.length < 3) {
    setAuthError('Username must be at least 3 characters.');
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    setAuthError('Username can only contain letters, numbers, and underscores.');
    return;
  }
  if (password.length < 8) {
    setAuthError('Password must be at least 8 characters.');
    return;
  }

  // Check username availability
  const { data: existing } = await window._supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (existing) {
    setAuthError('That username is already taken.');
    return;
  }

  const { data, error } = await window._supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    setAuthError(error.message);
    return;
  }

  const { error: profileError } = await window._supabase
    .from('profiles')
    .insert({ id: data.user.id, username, email });

  if (profileError) {
    setAuthError('Account created but profile setup failed. Please contact support.');
    return;
  }

  signupDropdown.classList.remove('open');
}

async function handleLogin() {
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  setAuthError('');

  if (!username || !password) {
    setAuthError('Please fill in both fields.');
    return;
  }

  // Fetch the real email for this username
  const { data: profile } = await window._supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (!profile) {
    setAuthError("We couldn't find that username.");
    return;
  }

  const { data: profileWithEmail } = await window._supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .maybeSingle();

  if (!profileWithEmail?.email) {
    setAuthError("We couldn't find that username.");
    return;
  }

  const { error } = await window._supabase.auth.signInWithPassword({
    email: profileWithEmail.email,
    password,
  });

  if (error) {
    setAuthError('Incorrect password. Try again.');
    return;
  }

  signupDropdown.classList.remove('open');
}

btnLogout?.addEventListener('click', async () => {
  await window._supabase.auth.signOut();
  signupDropdown.classList.remove('open');
});

async function initAuth() {
  const { data: { session } } = await window._supabase.auth.getSession();
  if (session) {
    const username = session.user.user_metadata?.username ?? session.user.email;
    setLoggedIn(username);
  }

  window._supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      const username = session.user.user_metadata?.username ?? session.user.email;
      setLoggedIn(username);
    } else {
      setLoggedOut();
    }
  });
}

initAuth();

// settings panel toggle
const settingsBubble = document.getElementById('settings-bubble');
const settingsPanel  = document.getElementById('settings-panel');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsClose = document.getElementById('settings-close');

function openSettings() {
  settingsPanel.classList.add('open');
  settingsOverlay.classList.add('active');
}

function closeSettings() {
  settingsPanel.classList.remove('open');
  settingsOverlay.classList.remove('active');
}

settingsBubble?.addEventListener('click', openSettings);
settingsClose?.addEventListener('click', closeSettings);
settingsOverlay?.addEventListener('click', closeSettings);

// settings large ui toggle
const largeUIToggle = document.getElementById('settings-large-ui');

if (localStorage.getItem('wonderland_large_ui') === 'true') {
  document.body.classList.add('large-ui');
  if (largeUIToggle) largeUIToggle.checked = true;
}

largeUIToggle?.addEventListener('change', () => {
  const enabled = largeUIToggle.checked;
  document.body.classList.toggle('large-ui', enabled);
  localStorage.setItem('wonderland_large_ui', enabled);
})

// supabase modal
const supabaseBubble = document.getElementById('supabase-bubble');
const supabaseModal = document.getElementById('supabase-modal');
const supabaseCloseBtn = document.getElementById('supabase-close-modal');

function openSupaModal() {
  supabaseModal.classList.add('active');
}

function closeSupaModal() {
  supabaseModal.classList.remove('active');
}

supabaseBubble?.addEventListener('click', openSupaModal);
supabaseCloseBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  closeSupaModal();
});
supabaseModal?.addEventListener('click', (e) => {
  if (e.target === supabaseModal) closeSupaModal();
});

// disclaimer modal
const disclaimerBubble = document.getElementById('disclaimer-bubble');
const disclaimerModal = document.getElementById('disclaimer-modal');
const disclaimerCloseBtn = document.getElementById('disclaimer-close-modal');

function openDisclaimerModal() {
  disclaimerModal.classList.add('active');
}

function closeDisclaimerModal() {
  disclaimerModal.classList.remove('active');
}

disclaimerBubble?.addEventListener('click', openDisclaimerModal);

disclaimerCloseBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  closeDisclaimerModal();
});

disclaimerModal?.addEventListener('click', (e) => {
  if (e.target === disclaimerModal) closeDisclaimerModal();
});

/* dev mode: no 24hr cooldown */
/* password is going to be exposed here but honestly i dont care */
const dev_password = 'aliceiscute';

const devToggle = document.getElementById('settings-dev-mode');
const devPasswordField = document.getElementById('dev-password-field');
const devPasswordInput = document.getElementById('dev-password-input');
const devSettingsItem = devToggle?.closest('.settings-item');

function _getCharacter() {
  return window._tarotReading?.character ?? null;
}

function enableDevMode() {
  document.body.classList.add('dev-mode');
  localStorage.setItem('wonderland_dev_mode', 'true');

  const drawBtn = document.querySelector('.draw-button');
  if (drawBtn) drawBtn.disabled = false;

  devSettingsItem?.classList.add('dev-active');
  devPasswordField.classList.remove('visible');
  devPasswordInput.value = '';

  const character = _getCharacter();
  if (character) {
    character._setGif(pick(character.cfg.surprised));
    character.speak(pick(character.cfg.correctGuessLines), 6000);
  }
}

function disableDevMode(reactWithTaunt = false) {
  document.body.classList.remove('dev-mode');
  localStorage.removeItem('wonderland_dev_mode');

  devToggle.checked = false;
  devSettingsItem?.classList.remove('dev-active');
  devPasswordField.classList.remove('visible');
  devPasswordInput.value = '';

  window._tarotReading?._checkCooldown();

  if (reactWithTaunt) {
    const character = _getCharacter();
    if (character) {
      character._setGif(pick(character.cfg.taunt));
      character.speak(pick(character.cfg.incorrectGuessLines), 6000);
    }
  }
}

if (localStorage.getItem('wonderland_dev_mode') === 'true') {
  document.body.classList.add('dev-mode');
  if (devToggle) devToggle.checked = true;
  devSettingsItem?.classList.add('dev-active');
}

devToggle?.addEventListener('change', () => {
  if (devToggle.checked) {
    devPasswordField.classList.add('visible');
    devPasswordInput.focus();
  } else {
    disableDevMode();
  }
});

devPasswordInput?.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const guess = devPasswordInput.value.trim();

  if (guess === dev_password) {
    enableDevMode();
  } else {
    disableDevMode(true);
  }
});

devPasswordInput?.addEventListener('blur', () => {
  setTimeout(() => {
    if (devPasswordField.classList.contains('visible')) {
      devToggle.checked = false;
      devPasswordField.classList.remove('visible');
      devPasswordInput.value = '';
    }
  }, 150);
});

const reduceMotionToggle = document.getElementById('settings-reduce-motion');

// also check the browser's native preference on first visit
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const savedReduceMotion = localStorage.getItem('wonderland_reduce_motion');

if (savedReduceMotion === 'true' || (savedReduceMotion === null && prefersReduced)) {
  document.body.classList.add('reduce-motion');
  if (reduceMotionToggle) reduceMotionToggle.checked = true;
}

reduceMotionToggle?.addEventListener('change', () => {
  const enabled = reduceMotionToggle.checked;
  document.body.classList.toggle('reduce-motion', enabled);
  localStorage.setItem('wonderland_reduce-motion', String(enabled));
});

// disclaimer first-visit
const DISCLAIMER_KEY = 'wonderland_disclaimer_seen';

function showDisclaimerIfFirstVisit() {
  if (!localStorage.getItem(DISCLAIMER_KEY)) {
    openDisclaimerModal();
  }
}

function dismissDisclaimer() {
  localStorage.setItem(DISCLAIMER_KEY, 'true');
  closeDisclaimerModal();
}

disclaimerCloseBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  dismissDisclaimer(); // changed
});

disclaimerModal?.addEventListener('click', (e) => {
  if (e.target === disclaimerModal) dismissDisclaimer(); // changed
});

// boot
document.addEventListener('DOMContentLoaded', () => {
  new CharacterPlacer();
  window._tarotReading = new TarotReading(); // exposed
  showDisclaimerIfFirstVisit();
});
