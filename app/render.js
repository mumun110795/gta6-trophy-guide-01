// Leonida Legend — rendering: trophy cards, the guide detail panel, the
// roadmap view and the missable watch. Pure DOM building; every string that
// comes from the data files is inserted as text, never as markup.

import { KIND_LABELS } from './guide-data.js';

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

export function gradeGem(grade) {
  const gem = el('span', `gem gem-${grade}`, GRADE_LETTER[grade] ?? '?');
  gem.title = `${grade} trophy`;
  gem.setAttribute('aria-label', `${grade} trophy`);
  return gem;
}

export function isSpoiled(trophy, state) {
  return state.shield && trophy.hidden && !state.earned.has(trophy.id) && !state.revealed.has(trophy.id);
}

function chipRow(trophy) {
  const row = el('div', 'chips');
  row.append(el('span', 'chip chip-kind', KIND_LABELS[trophy.kind] ?? trophy.kind));
  if (trophy.hidden) row.append(el('span', 'chip chip-hidden', 'Hidden on PSN'));
  if (trophy.missable) row.append(el('span', 'chip chip-missable', 'Missable — watch out'));
  if (trophy.count) row.append(el('span', 'chip chip-count', `${trophy.count.toLocaleString('en-US')} ${trophy.countLabel ?? ''}`.trim()));
  return row;
}

export function renderCard(trophy, state, handlers) {
  const card = el('article', 'card');
  if (state.earned.has(trophy.id)) card.classList.add('is-earned');
  if (state.selectedId === trophy.id) card.classList.add('is-selected');
  card.dataset.trophyId = String(trophy.id);

  const spoiled = isSpoiled(trophy, state);

  const top = el('div', 'card-top');
  top.append(gradeGem(trophy.grade));
  const titles = el('div', 'card-titles');
  const name = el('h3', 'card-name', spoiled ? 'Hidden trophy' : trophy.name);
  const desc = el('p', 'card-desc', spoiled ? 'Name and description hidden by the spoiler shield.' : trophy.description);
  if (spoiled) {
    name.classList.add('blurred');
    desc.classList.add('blurred');
  }
  titles.append(name, desc);
  top.append(titles);

  const checkLabel = el('label', 'earned-toggle');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = state.earned.has(trophy.id);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => handlers.onToggleEarned(trophy.id, box.checked));
  checkLabel.append(box, el('span', '', 'Earned'));
  top.append(checkLabel);
  card.append(top);

  card.append(chipRow(trophy));

  const actions = el('div', 'card-actions');
  const guideBtn = el('button', 'btn btn-small', spoiled ? 'Reveal & read guide' : 'Read the guide');
  guideBtn.type = 'button';
  guideBtn.addEventListener('click', () => handlers.onOpen(trophy.id));
  actions.append(guideBtn);
  if (spoiled) {
    const revealBtn = el('button', 'btn btn-small btn-ghost', 'Reveal name');
    revealBtn.type = 'button';
    revealBtn.addEventListener('click', () => handlers.onReveal(trophy.id));
    actions.append(revealBtn);
  }
  card.append(actions);
  return card;
}

export function renderDetail(panel, trophy, state, handlers) {
  panel.replaceChildren();
  if (!trophy) {
    panel.append(el('p', 'detail-empty', 'Pick a trophy from the checklist and its full guide — what to do, where, and what to watch for — opens here.'));
    return;
  }
  const spoiled = isSpoiled(trophy, state);

  const head = el('div', 'detail-head');
  head.append(gradeGem(trophy.grade));
  const headText = el('div', 'detail-head-text');
  headText.append(el('h2', 'detail-name', spoiled ? 'Hidden trophy' : trophy.name));
  headText.append(el('p', 'detail-grade', `${trophy.grade[0].toUpperCase()}${trophy.grade.slice(1)} · ${KIND_LABELS[trophy.kind] ?? trophy.kind}`));
  head.append(headText);
  panel.append(head);

  const official = el('blockquote', 'detail-official', spoiled ? 'Hidden by the spoiler shield until earned or revealed.' : `“${trophy.description}”`);
  panel.append(official);
  panel.append(el('p', 'detail-official-note', 'Official PlayStation description, shown as published.'));

  panel.append(chipRow(trophy));

  if (trophy.missable) {
    panel.append(el('p', 'detail-missable', 'Missable watch: this one can be left behind. Read the guide before you play past its moment.'));
  }

  panel.append(el('h3', 'detail-subhead', 'How to earn it'));
  panel.append(el('p', 'detail-guide', trophy.guide));

  if (trophy.count) {
    panel.append(el('h3', 'detail-subhead', 'The counter'));
    panel.append(el('p', 'detail-count', `PlayStation tracks this one: ${trophy.count.toLocaleString('en-US')} ${trophy.countLabel ?? ''}`.trim()));
  }

  panel.append(el('h3', 'detail-subhead', 'Sources'));
  const list = el('ul', 'detail-sources');
  for (const name of trophy.sources ?? []) list.append(el('li', '', name));
  panel.append(list);
  panel.append(el('p', 'detail-sources-note', 'The guide above is written for this page; these are the references it draws on.'));

  const toggle = el('button', 'btn detail-toggle', state.earned.has(trophy.id) ? 'Earned ✓ — tap to undo' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => handlers.onToggleEarned(trophy.id, !state.earned.has(trophy.id)));
  panel.append(toggle);
}

export function renderRoadmap(container, roadmap, byName, handlers) {
  container.replaceChildren();
  container.append(el('p', 'view-intro',
    'Five stages from the opening mission to the platinum, in the order the game hands the trophies out. ' +
    'Story first, strands alongside, counters last — and the missable habits start in stage 1, not stage 5.'));
  for (const stage of roadmap) {
    const card = el('section', 'stage-card');
    const head = el('div', 'stage-head');
    head.append(el('span', 'stage-number', `Stage ${stage.stage}`));
    head.append(el('h3', 'stage-title', stage.title));
    card.append(head);
    card.append(el('p', 'stage-summary', stage.summary));
    const list = el('div', 'stage-trophies');
    for (const name of stage.trophies) {
      const t = byName.get(name);
      if (!t) continue;
      const btn = el('button', 'stage-trophy', name);
      btn.type = 'button';
      btn.addEventListener('click', () => handlers.onOpen(t.id));
      list.append(btn);
    }
    card.append(list);
    if (stage.habits?.length) {
      const habits = el('ul', 'stage-habits');
      for (const h of stage.habits) habits.append(el('li', '', h));
      card.append(habits);
    }
    container.append(card);
  }
}

export function renderMissables(container, intro, trophies, handlers) {
  container.replaceChildren();
  container.append(el('p', 'view-intro', intro));
  for (const t of trophies) {
    const card = el('section', 'missable-card');
    const head = el('div', 'missable-head');
    head.append(gradeGem(t.grade));
    head.append(el('h3', 'missable-name', t.name));
    head.append(el('span', 'chip chip-missable', 'Missable'));
    card.append(head);
    card.append(el('p', 'missable-official', `“${t.description}”`));
    card.append(el('p', 'missable-guide', t.guide));
    const src = el('p', 'missable-sources', `Sources: ${(t.sources ?? []).join(' · ')}`);
    card.append(src);
    const btn = el('button', 'btn btn-small', 'Open in the checklist');
    btn.type = 'button';
    btn.addEventListener('click', () => handlers.onOpen(t.id));
    card.append(btn);
    container.append(card);
  }
}
