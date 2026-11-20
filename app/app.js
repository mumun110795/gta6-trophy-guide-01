// Leonida Legend — entry point: loads the trophy data, holds the tracker
// state, wires the toolbar, tabs and hash routes, and re-renders on change.

import { ROADMAP, MISSABLE_INTRO, KIND_LABELS } from './guide-data.js';
import {
  loadEarned, saveEarned, loadShield, saveShield,
  progressOf, progressByGrade, parseImport, downloadProgress,
} from './tracker.js';
import { el, renderCard, renderDetail, renderRoadmap, renderMissables } from './render.js';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const byName = new Map(trophies.map((t) => [t.name, t]));

const state = {
  earned: loadEarned(),
  shield: loadShield(),
  revealed: new Set(),
  selectedId: null,
  view: 'checklist',
  search: '',
  grade: 'all',
  kind: 'all',
  status: 'all',
  hideEarned: false,
};

const $ = (id) => document.getElementById(id);
const listEl = $('card-list');
const detailEl = $('detail-panel');

// Kind filter chips are built from the kinds the data actually uses, plus
// a Missable chip fed by the missable flag rather than the kind field.
const KIND_ORDER = ['story', 'side', 'collectibles', 'activities', 'world', 'completion'];
function buildKindChips() {
  const wrap = $('kind-chips');
  const kinds = ['all', ...KIND_ORDER.filter((k) => trophies.some((t) => t.kind === k)), 'missable'];
  for (const kind of kinds) {
    const btn = el('button', 'kind-chip' + (state.kind === kind ? ' is-active' : ''),
      kind === 'all' ? 'All kinds' : kind === 'missable' ? 'Missable' : (KIND_LABELS[kind] ?? kind));
    btn.type = 'button';
    btn.addEventListener('click', () => {
      state.kind = kind;
      for (const b of wrap.children) b.classList.toggle('is-active', b === btn);
      renderChecklist();
    });
    wrap.append(btn);
  }
}

function visibleTrophies() {
  const needle = state.search.trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.kind === 'missable' && !t.missable) return false;
    if (state.kind !== 'all' && state.kind !== 'missable' && t.kind !== state.kind) return false;
    if (state.status === 'earned' && !state.earned.has(t.id)) return false;
    if (state.status === 'unearned' && state.earned.has(t.id)) return false;
    if (state.hideEarned && state.earned.has(t.id)) return false;
    if (needle && !`${t.name} ${t.description} ${t.guide}`.toLowerCase().includes(needle)) return false;
    return true;
  });
}

function renderProgress() {
  const p = progressOf(trophies, state.earned);
  $('progress-text').textContent = `${p.done} of ${p.total} earned`;
  $('progress-percent').textContent = `${p.percent}%`;
  $('progress-fill').style.width = `${p.percent}%`;
  $('progress-bar').setAttribute('aria-valuenow', String(p.done));
  const byGrade = progressByGrade(trophies, state.earned);
  $('progress-grades').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${g}: ${byGrade[g]?.done ?? 0}/${byGrade[g]?.total ?? 0}`)
    .join(' · ');
}

function renderChecklist() {
  const visible = visibleTrophies();
  listEl.replaceChildren();
  for (const t of visible) listEl.append(renderCard(t, state, handlers));
  if (visible.length === 0) listEl.append(el('p', 'no-results', 'No trophies match those filters. Loosen a filter or clear the search.'));
  $('result-line').textContent = `Showing ${visible.length} of ${trophies.length} trophies` +
    (state.shield ? ' · spoiler shield on: hidden trophies stay blurred until earned or revealed' : '');
  renderDetail(detailEl, byId.get(state.selectedId) ?? null, state, handlers);
  renderProgress();
}

function renderRoadmapView() {
  renderRoadmap($('roadmap-body'), ROADMAP, byName, handlers);
}

function renderMissableView() {
  renderMissables($('missables-body'), MISSABLE_INTRO, trophies.filter((t) => t.missable), handlers);
}

function showView(view) {
  state.view = view;
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== `view-${view}`;
  }
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('is-active', tab.dataset.view === view);
  }
  if (view === 'roadmap') renderRoadmapView();
  if (view === 'missables') renderMissableView();
}

function openTrophy(id) {
  state.selectedId = id;
  showView('checklist');
  renderChecklist();
  // Bring the card into view inside the list only — the page itself (and
  // the sticky detail panel beside it) stays exactly where it was.
  const card = listEl.querySelector(`[data-trophy-id="${id}"]`);
  if (card) {
    const listBox = listEl.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    listEl.scrollTop += cardBox.top - listBox.top - 8;
  }
}

const handlers = {
  onToggleEarned(id, on) {
    if (on) state.earned.add(id);
    else state.earned.delete(id);
    saveEarned(state.earned);
    renderChecklist();
    if (state.view === 'missables') renderMissableView();
  },
  onOpen: openTrophy,
  onReveal(id) {
    state.revealed.add(id);
    renderChecklist();
  },
};

function wireControls() {
  $('search').addEventListener('input', (e) => { state.search = e.target.value; renderChecklist(); });
  $('grade-filter').addEventListener('change', (e) => { state.grade = e.target.value; renderChecklist(); });
  $('status-filter').addEventListener('change', (e) => { state.status = e.target.value; renderChecklist(); });
  $('hide-earned').addEventListener('change', (e) => { state.hideEarned = e.target.checked; renderChecklist(); });
  const shield = $('shield-toggle');
  shield.checked = state.shield;
  shield.addEventListener('change', (e) => {
    state.shield = e.target.checked;
    saveShield(state.shield);
    renderChecklist();
  });
  $('export-btn').addEventListener('click', () => downloadProgress(trophies, state.earned));
  $('import-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state.earned = parseImport(await file.text(), trophies);
      saveEarned(state.earned);
      renderChecklist();
    } catch {
      $('result-line').textContent = 'That progress file could not be read — nothing was changed.';
    }
    e.target.value = '';
  });
  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  }
}

// Hash routes give every view (and every trophy) a shareable, screenshot-
// friendly address: #/checklist, #/roadmap, #/missables, #/trophy/<id>.
function applyRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [head, arg] = hash.split('/');
  if (head === 'roadmap') showView('roadmap');
  else if (head === 'missables') showView('missables');
  else if (head === 'trophy' && byId.has(Number(arg))) openTrophy(Number(arg));
  else showView('checklist');
}

buildKindChips();
wireControls();
renderChecklist();
window.addEventListener('hashchange', applyRoute);
applyRoute();
