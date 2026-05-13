'use strict';

function pad(n) {
  return String(n).padStart(2, '0');
}

function cardImagePath(card) {
  const name = card.title.replace(/\s+/g, '');
  return `resources/tarot/${pad(card.id)}-${name}.png`;
}

// Settings panel (shared behaviour)
const settingsBubble  = document.getElementById('settings-bubble');
const settingsPanel   = document.getElementById('settings-panel');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsClose   = document.getElementById('settings-close');

settingsBubble?.addEventListener('click', () => {
  settingsPanel.classList.add('open');
  settingsOverlay.classList.add('active');
});
settingsClose?.addEventListener('click', () => {
  settingsPanel.classList.remove('open');
  settingsOverlay.classList.remove('active');
});
settingsOverlay?.addEventListener('click', () => {
  settingsPanel.classList.remove('open');
  settingsOverlay.classList.remove('active');
});

// Large UI toggle
const largeUIToggle = document.getElementById('settings-large-ui');
if (localStorage.getItem('wonderland_large_ui') === 'true') {
  document.body.classList.add('large-ui');
  if (largeUIToggle) largeUIToggle.checked = true;
}
largeUIToggle?.addEventListener('change', () => {
  const enabled = largeUIToggle.checked;
  document.body.classList.toggle('large-ui', enabled);
  localStorage.setItem('wonderland_large_ui', enabled);
});

// Modal
function openModal(card) {
  const modal = document.getElementById('card-modal');
  if (!modal) return;

  const imgEl = document.getElementById('modal-card-image');
  if (imgEl) {
    imgEl.src = cardImagePath(card);
    imgEl.alt = card.title;
    imgEl.style.transform = '';
  }

  document.getElementById('reversed-indicator').style.display = 'none';
  document.getElementById('modal-card-name').textContent = card.title;
  document.getElementById('modal-overall-meaning').textContent = card.upright.overall;
  document.getElementById('modal-temporal-title').textContent = 'Upright';
  document.getElementById('modal-temporal-meaning').textContent = card.upright.present ?? card.upright.overall;
  document.getElementById('reversed-meaning-section').style.display = 'block';
  document.getElementById('modal-reversed-meaning').textContent = card.reversed.overall;

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('card-modal')?.classList.remove('active');
}

document.getElementById('close-modal')?.addEventListener('click', closeModal);
document.getElementById('card-modal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('card-modal')) closeModal();
});

// Build the grid
async function init() {
  let cards = [];
  try {
    const res = await fetch('resources/tarot-cards-expanded.json');
    const data = await res.json();
    cards = data.cards.slice().sort((a, b) => a.id - b.id);
  } catch (err) {
    console.error('Failed to load tarot cards:', err);
    return;
  }

  const grid = document.getElementById('deck-grid');
  if (!grid) return;

  for (const card of cards) {
    const item = document.createElement('div');
    item.className = 'deck-card';
    item.setAttribute('title', card.title);

    const wrapper = document.createElement('div');
    wrapper.className = 'deck-card-wrapper';

    const img = document.createElement('img');
    img.src = cardImagePath(card);
    img.alt = card.title;
    img.loading = 'lazy';

    const label = document.createElement('p');
    label.className = 'deck-card-label';
    label.textContent = `${pad(card.id)} · ${card.title}`;

    wrapper.appendChild(img);
    item.appendChild(wrapper);
    item.appendChild(label);
    item.addEventListener('click', () => openModal(card));

    grid.appendChild(item);
  }
}

init();