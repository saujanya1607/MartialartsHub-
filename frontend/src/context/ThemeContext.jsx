import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'ancient-colosseum',
    name: 'Ancient Colosseum',
    subtitle: 'Mountain ruins & stone warriors',
    emoji: '🏛️',
    accentPreview: '#d4a017',
  },
  {
    id: 'frozen-sanctuary',
    name: 'Frozen Sanctuary',
    subtitle: 'Ice temples & glacial masters',
    emoji: '❄️',
    accentPreview: '#5bc8f5',
  },
  {
    id: 'astral-tree',
    name: 'Astral World Tree',
    subtitle: 'Bioluminescent forest dojo',
    emoji: '🌳',
    accentPreview: '#b87fff',
  },
  {
    id: 'sacred-peak',
    name: 'Sacred Peak Ring',
    subtitle: 'Floating sky arena',
    emoji: '⛰️',
    accentPreview: '#ffcf3d',
  },
  {
    id: 'cybernetic',
    name: 'Cybernetic Arena',
    subtitle: 'Futuristic tournament grounds',
    emoji: '⚡',
    accentPreview: '#00f0ff',
  },
  {
    id: 'gladiator-pit',
    name: 'Gladiator Pit',
    subtitle: 'Underground cinematic arena',
    emoji: '🔥',
    accentPreview: '#ff5e00',
  },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('mah-theme') || 'ancient-colosseum');
  const [colorMode, setColorModeState] = useState(() => localStorage.getItem('mah-mode') || 'dark');

  const applyTheme = (t, m) => {
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-mode', m);
    localStorage.setItem('mah-theme', t);
    localStorage.setItem('mah-mode', m);
  };

  useEffect(() => { applyTheme(theme, colorMode); }, [theme, colorMode]);

  const setTheme = (t) => { setThemeState(t); applyTheme(t, colorMode); };
  const setColorMode = (m) => { setColorModeState(m); applyTheme(theme, m); };
  const toggleMode = () => setColorMode(colorMode === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode, toggleMode, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
