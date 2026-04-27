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

document.addEventListener('DOMContentLoaded', () => {
  // new TarotReading();
  new CharacterDrag();
});

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
      "Yikes. I almost feel sorry for you!",
      "I swear I didn't rig the cards... maybe.",
      "How unfortunate for you!",
      "You're still going to have to pay me, you know.",
      "Ouch. Try again tomorrow, maybe?",
    ],
    clickLines: [
      "Gonna draw some cards? Might as well, right? It's not like anyone is gonna come looking for you here!",
      "What? Do I have something on my face?",
      "That's going to cost you a little extra.",
      "Do you MIND?",
      "Are you lost? Sorry, that was a stupid question. Of course you are.",
    ],
    bonkLines: [
      "Is this my bad luck?!",
      "Hey! Watch it!",
      "I'll increase the payment for this!",
      "Can you NOT?!",
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
      "Oh, a visitor! Don't worry, I'll be gentle with the reading.",
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

// Character Drag
class CharacterDrag {
  constructor() {
    this.el = document.getElementById('character-float');
    this.resetBtn = document.getElementById('bubble-reset-char');
    this.DEFAULT = { bottom: '2rem', left: '2rem' };

    this.dragging = false;
    this.startX = 0;
    this.startY = 0;
    this.origLeft = 0;
    this.origTop = 0;

    if (this.el) {
      this._initDrag();
      this._loadPosition();
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.reset());
    }
  }

  _initDrag() {
    // mouse events
    this.el.addEventListener('mousedown', (e) => this._onStart(e.clientX, e.clientY, e));
    document.addEventListener('mousemove', (e) => this._onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => this._onEnd());

    // touch events
    this.el.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this._onStart(touch.clientX, touch.clientY, e);
    }, { passive: false });
    document.addEventListener('touchmove', (e) => {
      if (!this.dragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      this._onMove(touch.clientX, touch.clientY);
    }, { passive: false });
    document.addEventListener('touchend', () => this._onEnd());
  }

  _onStart(clientX, clientY, e) {
    this.dragging = true;

    const rect = this.el.getBoundingClientRect();
    this.startX = clientX;
    this.startY = clientY;
    this.origLeft = rect.left;
    this.origTop = rect.top;

    this.el.style.bottom = 'auto';
    this.el.style.right = 'auto';
    this.el.style.left = this.origLeft + 'px';
    this.el.style.top = this.origTop + 'px';
    this.el.style.transition = 'none';
  }

  _onMove(clientX, clientY) {
    if (!this.dragging) return;

    const deltaX = clientX - this.startX;
    const deltaY = clientY - this.startY;

    let newLeft = this.origLeft + deltaX;
    let newTop = this.origTop + deltaY;

    // clamp to viewport
    const rect = this.el.getBoundingClientRect();
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

    this.el.style.left = newLeft + 'px';
    this.el.style.top = newTop + 'px';
  }

  _onEnd() {
    if (!this.dragging) return;
    this.dragging = false;
    this._savePosition();
  }

  _savePosition() {
    localStorage.setItem('characterPos', JSON.stringify({
      left: this.el.style.left,
      top: this.el.style.top,
    }));
  }

  _loadPosition() {
    const saved_pos = localStorage.getItem('characterPos');
    if (!saved) return;
    try {
      const { left, top } = JSON.parse(saved_pos);
      this.el.style.bottom = 'auto';
      this.el.style.right = 'auto';
      this.el.style.left = left;
      this.el.style.top = top;
    } catch (e) {
      console.error('Error loading character position:', e);
    }
  }

  reset() {
    localStorage.removeItem('characterPos');
    this.el.style.transition = 'left 0.4s ease, top 0.4s ease';
    this.el.style.left = '2rem';
    this.el.style.top = 'auto';
    this.el.style.bottom = '2rem';
    this.el.style.right = 'auto';
    setTimeout(() => { this.el.style.transition = ''; }, 400);
  }
}

// Card Classification
const POSITIVE_CARD_IDS = new Set([1, 2, 3, 6, 8, 10, 14, 17, 19, 20, 21]);