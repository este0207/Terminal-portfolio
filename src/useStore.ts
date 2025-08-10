import { useState, useEffect } from 'react';
import { getState, subscribe } from './store';

export const useStore = () => {
  const [state, setState] = useState(getState());

  useEffect(() => {
    const unsubscribe = subscribe(() => setState(getState()));
    return () => unsubscribe();
  }, []);

  return state;
};
