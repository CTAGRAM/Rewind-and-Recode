import { useCallback } from 'react';

export const useChromeStorage = () => {
  const getItem = useCallback(async (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined' && (window as any).chrome?.storage?.local) {
      const chrome = (window as any).chrome;
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result: { [k: string]: any }) => {
          resolve(result[key] || null);
        });
      });
    } else {
      // Fallback to localStorage for PWA
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    }
  }, []);

  const setItem = useCallback(async (key: string, value: any): Promise<void> => {
    if (typeof window !== 'undefined' && (window as any).chrome?.storage?.local) {
      const chrome = (window as any).chrome;
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    } else {
      // Fallback to localStorage for PWA
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    }
  }, []);

  return { getItem, setItem };
};
