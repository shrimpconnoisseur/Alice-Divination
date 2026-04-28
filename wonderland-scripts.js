/* TODO:
 * - On page startup, show a disclaimer about character assets used for Alice and Yomi are NOT owned by me. They are owned by EPID Games from their mobile game Trickcal. Unless they click the "Disclaimer" button on the footer of the page, this notice will only show up once and never again after the user clicks the "close" button.
 * - Have a chance for another character, Yomi, to take Alice's place with a 10% chance on page startup or refresh. While Alice is more mischievous and taunting, Yomi is much more kind and sympathetic, which is to be reflected in their reactions to card pulls or random speeches.
 * - Track who is present so that appropriate GIFs are loaded/played.
 * - Clicking on their body triggers a random speech bubble. This cannot be performed after clicking the Draw Cards button until the Reset button is clicked.
 * - Add a Reset button.
 * - Clicking on their heads "bonks" them, playing their "smash" GIF variant. With the way the GIF works, play the GIF and then again for only a second. After the second GIF replay, change to one of their "angry" GIF variants for a couple seconds. Then return to a random "idle" GIF.
 * - Bonking them will trigger a random upset speech bubble.
 * 
 * Inlcuded is a list of the character GIFs:
 * Alice:
 * > alice_angry1.gif
 * > alice_angry2.gif
 * > alice_angry3.gif
 * > alice_averteyes.gif
 * > alice_happy1.gif
 * > alice_happy2.gif
 * > alice_idle1.gif
 * > alice_idle2.gif
 * > alice_ignore.gif
 * > alice_laugh.gif
 * > alice_pout.gif
 * > alice_sad1.gif
 * > alice_sad2.gif
 * > alice_smash.gif
 * > alice_surprised.gif
 * > alice_taunt1.gif
 * > alice_taunt2.gif
 * > alice_taunt3.gif
 * 
 * Yomi:
 * > yomi_angry1.gif
 * > yomi_angry2.gif
 * > yomi_dance.gif
 * > yomi_happy1.gif
 * > yomi_happy2.gif
 * > yomi_idle1.gif
 * > yomi_idle2.gif
 * > yomi_sad1.gif
 * > yomi_sad2.gif
 * > yomi_smash.gif
 * > yomi_surprised.gif
 * 
 * !!!!!!!!!!!!MOST IMPORTANT!!!!!!!!!!!!!
 * - Finish building the actual script.
 */

// Sign-up bubble toggle
const signupBubble   = document.getElementById('bubble-signup');
const signupDropdown = document.getElementById('signup-dropdown');

signupBubble?.addEventListener('click', (e) => {
  e.stopPropagation();
  signupDropdown.classList.toggle('open');
  signupBubble.classList.toggle('active');
});

signupDropdown?.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Close when clicking anywhere else
document.addEventListener('click', () => {
  signupDropdown?.classList.remove('open');
  signupBubble?.classList.remove('active');
});

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
  },

  yomi: {
    folder: 'resources/yomi',
    idle: ['yomi_idle1.gif', 'yomi_idle2.gif'],
    startup: ['yomi_happy1.gif', 'yomi_happy2.gif', 'yomi_idle1.gif', 'yomi_idle2.gif', 'yomi_dance.gif'],
    happy: ['yomi_happy1.gif', 'yomi_happy2.gif'],
    taunt: ['yomi_dance.gif'], // Yomi is too kind to taunt! Instead, default to dance?
    sad: ['yomi_sad1.gif', 'yomi_sad2.gif'],
    surprised: ['yomi_surprised.gif'],
    ignore: ['yomi_surprised.gif'], // Yomi is too kind to ignore! Instead, just default to surprised?
    smash: ['yomi_smash.gif'],
    angry: ['yomi_angry1.gif', 'yomi_angry2.gif'],

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
      "Ow... that hurt a little...",
      "Oh! W-what was that for...?",
      "Please don't do that... it's not very nice...",
      "Ouch... I didn't do anything wrong, did I?",
      "...I'll forgive you. But please be gentle.",
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
// everything else would be considered negative or cautionary
const POSITIVE_CARD_IDS = new Set([1, 2, 3, 6, 8, 10, 14, 17, 19, 20, 21]);

function isPositiveReading(drawnCards) {
  // a reading is "good" if at least 2 of the drawn cards are in the POSITIVE_CARD_IDS set and are upright
  const positiveCount = drawnCards.filter(
    (d) => !d.reversed && POSITIVE_CARD_IDS.has(d.card.id)
  ).length;
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
  const name = card.filename.replace('.png', '').replace(/ /g, '_');
  return `resources/tarot/${pad(card.id)}-${name}.png`;
}

// TODO: Reading Mode Toggle

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

    this._setupClickZones();  // for interaction
                              // might collide with movement script
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

    this._setGif(pick(this.cfg.angry));
    await sleep(2500);

    this._setIdle();
    this.hideSpeech();
    this.bonking = false;
  }
}

// boot
document.addEventListener('DOMContentLoaded', () => {
  new CharacterPlacer();
  const controller = new CharacterController();
  controller.init();
});