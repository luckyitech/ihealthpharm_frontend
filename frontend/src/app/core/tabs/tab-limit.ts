/*
 * Limits how many tabs of the application one browser may have open at once.
 *
 * Every open tab keeps an entry in localStorage (shared by all tabs of this
 * site in this browser) and refreshes it on a timer. A new tab is admitted only
 * while fewer than MAX_OPEN_TABS live entries exist; otherwise it shows a short
 * notice instead of starting the application, and opens itself as soon as a
 * slot frees up.
 *
 * This runs before Angular starts, so a refused tab loads no screens and makes
 * no server calls.
 */

export const MAX_OPEN_TABS = 2;

const STORAGE_KEY = 'openTabs';
const HEARTBEAT_MS = 2000;
/*
 * A tab that closes normally removes its own entry. This only covers a tab that
 * crashed or was killed. Browsers slow the timers of hidden tabs to about once a
 * minute, so anything shorter would wrongly expire tabs left in the background.
 */
const STALE_AFTER_MS = 90 * 1000;
const RETRY_MS = 2000;

interface TabEntry { since: number; seen: number; }
type TabRegistry = { [tabId: string]: TabEntry };

const tabId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
let since = 0;

function readRegistry(): TabRegistry {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch (e) {
    return {};
  }
}

function writeRegistry(registry: TabRegistry): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
}

function liveEntries(registry: TabRegistry, now: number): TabRegistry {
  const live: TabRegistry = {};
  Object.keys(registry).forEach(id => {
    if (now - registry[id].seen < STALE_AFTER_MS) {
      live[id] = registry[id];
    }
  });
  return live;
}

function heartbeat(): void {
  const registry = liveEntries(readRegistry(), Date.now());
  registry[tabId] = { since, seen: Date.now() };
  writeRegistry(registry);
}

function release(): void {
  const registry = readRegistry();
  delete registry[tabId];
  writeRegistry(registry);
}

/**
 * Tries to take one of the open-tab slots for this tab.
 * When two tabs open at the same moment, the one registered first keeps the slot.
 * @returns {boolean} true when this tab may start the application
 */
export function claimTabSlot(): boolean {
  const now = Date.now();
  const registry = liveEntries(readRegistry(), now);
  if (Object.keys(registry).length >= MAX_OPEN_TABS) {
    return false;
  }
  since = now;
  registry[tabId] = { since, seen: now };
  writeRegistry(registry);

  const live = liveEntries(readRegistry(), Date.now());
  const admitted = Object.keys(live)
    .sort((a, b) => live[a].since - live[b].since || (a < b ? -1 : 1))
    .slice(0, MAX_OPEN_TABS)
    .indexOf(tabId) !== -1;
  if (!admitted) {
    release();
    return false;
  }

  setInterval(heartbeat, HEARTBEAT_MS);
  // Signing out clears localStorage in another tab; put this tab back at once.
  window.addEventListener('storage', event => {
    if (event.key === null || event.key === STORAGE_KEY) {
      if (!readRegistry()[tabId]) {
        heartbeat();
      }
    }
  });
  window.addEventListener('pagehide', release);
  return true;
}

/**
 * Replaces the page with a notice, and reloads once another tab has closed.
 */
export function showTabLimitNotice(): void {
  document.body.innerHTML = `
    <main style="font-family: Arial, sans-serif; max-width: 460px; margin: 15vh auto; padding: 24px;
      text-align: center; color: #333; border: 1px solid #ddd; border-radius: 8px; background: #fff;">
      <h1 style="font-size: 20px; margin: 0 0 12px;">Too many tabs open</h1>
      <p style="margin: 0 0 20px; line-height: 1.5;">
        IHealth Pharm is already open in ${MAX_OPEN_TABS} tabs in this browser.
        Close one of them and this tab will open by itself.
      </p>
      <button type="button" id="tab-limit-retry" style="padding: 8px 20px; border: 0; border-radius: 4px;
        background: #3a8a8c; color: #fff; font-size: 14px; cursor: pointer;">Try again</button>
    </main>`;
  document.getElementById('tab-limit-retry').addEventListener('click', () => location.reload());
  setInterval(() => {
    if (Object.keys(liveEntries(readRegistry(), Date.now())).length < MAX_OPEN_TABS) {
      location.reload();
    }
  }, RETRY_MS);
}
