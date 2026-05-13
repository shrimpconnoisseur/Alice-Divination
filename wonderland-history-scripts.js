'use strict';

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

// storage
const HISTORY_KEY = 'wonderland_divination_history';

async function getSession() {
  const { data: { session } } = await window._supabase.auth.getSession();
  return session;
}

async function loadHistory() {
  const session = await getSession();

  if (session) {
    const { data, error } = await window._supabase
      .from('readings')
      .select('*')
      .eq('user_id', session.user.id)
      .order('drawn_at', { ascending: false });

    if (error) {
      console.error('Failed to load readings from Supabase:', error);
      return [];
    }
    return data;
  }

  // Guest fallback
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
      .slice()
      .reverse(); // newest first, matching Supabase order
  } catch {
    return [];
  }
}

async function deleteEntry(id) {
  const session = await getSession();

  if (session) {
    await window._supabase
      .from('readings')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id); // safety: can only delete own rows
  } else {
    const entries = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
      .filter((e) => e.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  }
}

async function clearHistory() {
  const session = await getSession();

  if (session) {
    await window._supabase
      .from('readings')
      .delete()
      .eq('user_id', session.user.id);
  } else {
    localStorage.removeItem(HISTORY_KEY);
  }
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
document.getElementById('confirm-yes')?.addEventListener('click', async () => {
  await clearHistory();
  document.getElementById('confirm-overlay').classList.remove('active');
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

// render
async function renderHistory() {
  const list     = document.getElementById('history-list');
  const empty    = document.getElementById('history-empty');
  const subtitle = document.getElementById('history-subtitle');

  // Show a loading state while we fetch
  list.innerHTML = '';
  subtitle.textContent = 'Loading your divinations...';
  empty.style.display = 'none';

  const entries = await loadHistory();

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
    deleteBtn.addEventListener('click', async () => {
      await deleteEntry(entry.id);
      renderHistory();
    });

    meta.appendChild(dateEl);
    meta.appendChild(modeEl);
    header.appendChild(meta);
    header.appendChild(deleteBtn);

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