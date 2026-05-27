const STORAGE_KEY = 'nexusai_state';

export function saveStorage(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadStorage() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearStorage() {
  window.localStorage.removeItem(STORAGE_KEY);
}
