'use strict';

// Storage key — swap this out for an authenticated API call when backend exists
const HISTORY_KEY = 'wonderland_divination_history';

function pad(n) {
  return String(n).padStart(2, '0');
}

function cardImagePath(card) {
  const name = card.title.replace(/\s+/g, '');
  return `resources/tarot/${pad(card.id)}-${name}.png`;
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) + ' · ' + d.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  });
}

// History storage helpers
// NOTE: replace loadHistory/saveHistory/deleteEntry/clearHistory with
// authenticated fetch() calls once the backend and login system exist.
// The shape of each entry should match the DB schema (mode, drawn_at, cards[]).

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

function deleteEntry(id) {
  const entries = loadHistory().filter((e) => e.id !== id);
  saveHistory(entries);
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// Settings panel
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

// Large UI
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

// Delete all confirmation
const confirmOverlay = document.getElementById('confirm-overlay');
document.getElementById('bubble-delete-all')?.addEventListener('click', () => {
  confirmOverlay.classList.add('active');
});
document.getElementById('confirm-no')?.addEventListener('click', () => {
  confirmOverlay.classList.remove('active');
});
document.getElementById('confirm-yes')?.addEventListener('click', () => {
  clearHistory();
  confirmOverlay.classList.remove('active');
  renderHistory();
});

// Modal
let allCards = [];

function openModal(card, reversed, position) {
  const modal = document.getElementById('card-modal');
  if (!modal) return;

  const imgEl = document.getElementById('modal-card-image');
  if (imgEl) {
    imgEl.src = cardImagePath(card);
    imgEl.alt = card.title;
    imgEl.style.transform = reversed ? 'rotate(180deg)' : '';
  }

  const revInd = document.getElementById('reversed-indicator');
  if (revInd) revInd.style.display = reversed ? 'block' : 'none';

  document.getElementById('modal-card-name').textContent = card.title;

  document.getElementById('modal-overall-meaning').textContent =
    reversed ? card.reversed.overall : card.upright.overall;

  const posLabel = {
    past: 'Past', present: 'Present', future: 'Future',
  }[position] ?? 'Interpretation';

  document.getElementById('modal-temporal-title').textContent = posLabel;
  document.getElementById('modal-temporal-meaning').textContent =
    reversed
      ? card.reversed[position] ?? card.reversed.overall
      : card.upright[position]  ?? card.upright.overall;

  const reversedSection = document.getElementById('reversed-meaning-section');
  if (reversedSection) reversedSection.style.display = reversed ? 'block' : 'none';
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

// Render
function renderHistory() {
  const list    = document.getElementById('history-list');
  const empty   = document.getElementById('history-empty');
  const subtitle = document.getElementById('history-subtitle');
  const entries = loadHistory().slice().reverse(); // newest first

  list.innerHTML = '';

  if (entries.length === 0) {
    empty.style.display = 'block';
    subtitle.textContent = 'Your past readings are recorded here.';
    return;
  }

  empty.style.display = 'none';
  subtitle.textContent = `${entries.length} divination${entries.length !== 1 ? 's' : ''} recorded.`;

  for (const entry of entries) {
    const el = document.createElement('div');
    el.className = 'history-entry';

    // Header
    const header = document.createElement('div');
    header.className = 'history-entry-header';

    const meta = document.createElement('div');
    meta.className = 'history-entry-meta';

    const dateEl = document.createElement('p');
    dateEl.className = 'history-entry-date';
    dateEl.textContent = formatDate(entry.drawn_at);

    const modeEl = document.createElement('p');
    modeEl.className = 'history-entry-mode';
    modeEl.textContent = entry.mode === 'three' ? 'Past · Present · Future' : 'Daily Fortune';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'history-delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteEntry(entry.id);
      renderHistory();
    });

    meta.appendChild(dateEl);
    meta.appendChild(modeEl);
    header.appendChild(meta);
    header.appendChild(deleteBtn);

    // Card strip
    const cardsEl = document.createElement('div');
    cardsEl.className = 'history-cards';

    for (const drawn of entry.cards) {
      const cardData = allCards.find((c) => c.id === drawn.cardId);
      if (!cardData) continue;

      const cardEl = document.createElement('div');
      cardEl.className = 'history-card';
      cardEl.addEventListener('click', () => openModal(cardData, drawn.reversed, drawn.position));

      const wrapperEl = document.createElement('div');
      wrapperEl.className = 'history-card-wrapper';

      const imgEl = document.createElement('img');
      imgEl.src = cardImagePath(cardData);
      imgEl.alt = cardData.title;
      imgEl.loading = 'lazy';
      if (drawn.reversed) imgEl.classList.add('reversed');

      const infoEl = document.createElement('div');
      infoEl.className = 'history-card-info';

      const titleEl = document.createElement('p');
      titleEl.className = 'history-card-title';
      titleEl.textContent = cardData.title;

      const posEl = document.createElement('p');
      posEl.className = 'history-card-position';
      posEl.textContent = drawn.position;

      infoEl.appendChild(titleEl);
      infoEl.appendChild(posEl);

      if (drawn.reversed) {
        const revTag = document.createElement('p');
        revTag.className = 'history-card-reversed-tag';
        revTag.textContent = 'Reversed';
        infoEl.appendChild(revTag);
      }

      wrapperEl.appendChild(imgEl);
      cardEl.appendChild(wrapperEl);
      cardEl.appendChild(infoEl);
      cardsEl.appendChild(cardEl);
    }

    el.appendChild(header);
    el.appendChild(cardsEl);
    list.appendChild(el);
  }
}

// Boot
async function init() {
  try {
    const res = await fetch('resources/tarot-cards.json');
    const data = await res.json();
    allCards = data.cards;
  } catch (err) {
    console.error('Failed to load tarot cards:', err);
  }
  renderHistory();
}

init();