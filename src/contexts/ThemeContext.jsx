import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContextObject';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    // Always default to light — dark only if user explicitly toggled
    setTheme(saved || 'light');
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


