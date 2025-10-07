'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const setDocumentTheme = (value: 'light' | 'dark') => {
      document.documentElement.setAttribute('data-theme', value);
      document.documentElement.style.colorScheme = value;
    };

    if (typeof window.matchMedia !== 'function') {
      setDocumentTheme('light');
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setDocumentTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setDocumentTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <>{children}</>;
}
