type State = {
  username: string;
  theme: string; 
};

type Listener = () => void;

let state: State = {
  username: 'visitor',
  theme: 'ubuntu',
};

const listeners: Set<Listener> = new Set();

export const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
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
