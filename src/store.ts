type State = {
  username: string;
  theme: string; // Will be used later
};

type Listener = () => void;

let state: State = {
  username: 'visitor',
  theme: 'dark',
};

const listeners: Set<Listener> = new Set();

export const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener); // Unsubscribe function
};

const notify = () => {
  listeners.forEach(listener => listener());
};

export const getState = () => state;

export const setUsername = (newUsername: string) => {
  state = { ...state, username: newUsername };
  notify();
};

export const setTheme = (newTheme: string) => {
  state = { ...state, theme: newTheme };
  notify();
};
