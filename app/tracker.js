// Leonida Legend — tracker state: which trophies are earned, the spoiler
// shield setting, and export/import of the whole progress file. Everything
// lives in localStorage; nothing ever leaves the browser.

const EARNED_KEY = 'leonida-legend.earned.v1';
const SHIELD_KEY = 'leonida-legend.shield.v1';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function loadEarned() {
  const ids = readJson(EARNED_KEY, []);
  return new Set(Array.isArray(ids) ? ids.filter((n) => Number.isInteger(n)) : []);
}

export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadShield() {
  return readJson(SHIELD_KEY, true) !== false;
}

export function saveShield(on) {
  localStorage.setItem(SHIELD_KEY, JSON.stringify(Boolean(on)));
}

export function progressOf(trophies, earned) {
  const done = trophies.filter((t) => earned.has(t.id)).length;
  return {
    done,
    total: trophies.length,
    percent: trophies.length === 0 ? 0 : Math.round((done / trophies.length) * 100),
  };
}

export function progressByGrade(trophies, earned) {
  const out = {};
  for (const t of trophies) {
    out[t.grade] ??= { done: 0, total: 0 };
    out[t.grade].total += 1;
    if (earned.has(t.id)) out[t.grade].done += 1;
  }
  return out;
}

// The export file names trophies as well as numbering them, so a progress
// file stays readable (and re-importable) even outside this app.
export function exportFile(trophies, earned) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  return {
    app: 'leonida-legend',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b).map((id) => ({ id, name: byId.get(id)?.name ?? null })),
  };
}

export function parseImport(text, trophies) {
  const data = JSON.parse(text);
  const validIds = new Set(trophies.map((t) => t.id));
  const byName = new Map(trophies.map((t) => [t.name, t.id]));
  const found = new Set();
  const entries = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(entries)) throw new Error('No earned list in that file.');
  for (const entry of entries) {
    if (Number.isInteger(entry) && validIds.has(entry)) found.add(entry);
    if (entry && Number.isInteger(entry.id) && validIds.has(entry.id)) found.add(entry.id);
    if (entry && typeof entry.name === 'string' && byName.has(entry.name)) found.add(byName.get(entry.name));
    if (typeof entry === 'string' && byName.has(entry)) found.add(byName.get(entry));
  }
  return found;
}

export function downloadProgress(trophies, earned) {
  const blob = new Blob([JSON.stringify(exportFile(trophies, earned), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-legend-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
