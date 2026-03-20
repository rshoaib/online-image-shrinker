import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContextObject';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    // v2: one-time migration to force light theme default
    const migrated = localStorage.getItem('theme_v2');
    if (!migrated) {
      localStorage.setItem('theme', 'light');
      localStorage.setItem('theme_v2', '1');
      setTheme('light');
    } else {
      setTheme(saved || 'light');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Update data-theme attribute on <html>
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


