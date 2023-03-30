/* eslint-disable consistent-return */
import { useState, useEffect } from 'react';

function getIsOnline() {
  if (typeof window === 'undefined') {
    return null;
  }

  return navigator.onLine;
}

export const useOnline = () => {
  const [online, changeOnline] = useState(getIsOnline());

  function setOffline() {
    changeOnline(false);
  }

  function setOnline() {
    changeOnline(true);
  }

  // we only needs this to be set on mount
  // hence []
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', setOnline);
      window.addEventListener('offline', setOffline);

      return () => {
        window.removeEventListener('online', setOnline);
        window.removeEventListener('offline', setOffline);
      };
    }
    // console.warn('useOnline: window is undefined.');
  }, []);

  return online;
};

export default useOnline;
