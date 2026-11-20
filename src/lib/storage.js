export const KEYS = {
  USERS: 'misheu_iti_users',
  CURRENT_USER_ID: 'misheu_iti_current_user',
  SESSION_USER: 'misheu_iti_session_user',
};

function safeGet(storage, key, defaultValue = null) {
  try {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function safeSet(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
    return false;
  }
}

function safeRemove(storage, key) {
  try {
    storage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`Error removing ${key} from storage:`, err);
    return false;
  }
}

export function getUsers() {
  if (typeof window === 'undefined') return [];
  return safeGet(window.localStorage, KEYS.USERS, []);
}

export function saveUser(user) {
  if (typeof window === 'undefined') return false;
  
  if (user.remember) {
    const users = getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    safeSet(window.localStorage, KEYS.USERS, users);
    safeSet(window.localStorage, KEYS.CURRENT_USER_ID, user.id);
    safeRemove(window.sessionStorage, KEYS.SESSION_USER);
  } else {
    safeSet(window.sessionStorage, KEYS.SESSION_USER, user);
    safeRemove(window.localStorage, KEYS.CURRENT_USER_ID);
  }
  return true;
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;

  // Check sessionStorage first for guest/one-time sessions
  const sessionUser = safeGet(window.sessionStorage, KEYS.SESSION_USER, null);
  if (sessionUser) return sessionUser;

  // Check persistent remembered user
  const currentUserId = safeGet(window.localStorage, KEYS.CURRENT_USER_ID, null);
  if (currentUserId) {
    const users = getUsers();
    const found = users.find((u) => u.id === currentUserId);
    if (found) return found;
  }

  return null;
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  safeRemove(window.localStorage, KEYS.CURRENT_USER_ID);
  safeRemove(window.sessionStorage, KEYS.SESSION_USER);
}

export function updateUser(updatedUser) {
  if (typeof window === 'undefined') return false;

  if (updatedUser.remember) {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index >= 0) {
      users[index] = updatedUser;
      safeSet(window.localStorage, KEYS.USERS, users);
    }
  } else {
    safeSet(window.sessionStorage, KEYS.SESSION_USER, updatedUser);
  }
  return true;
}
