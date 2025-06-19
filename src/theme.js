import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';

export const themes = {
  light: {
    background: '#F5F7FA', // Light Background
    surface: '#FFFFFF', // Light Surface
    textPrimary: '#1E1E1E', // Primary Text (Light)
    textSecondary: '#6B7280', // Secondary Text
    accent: '#005BAC', // Samurai Blue
    success: '#2CB67D', // Success (донаты)
    border: '#D1D5DB', // Border/Divider (light)
  },
  dark: {
    background: '#0D1117', // Dark Background
    surface: '#161B22', // Dark Surface
    textPrimary: '#E6EDF3', // Primary Text (Dark)
    textSecondary: '#6B7280', // Secondary Text
    accent: '#005BAC', // Samurai Blue
    success: '#2CB67D', // Success (донаты)
    border: '#2C313A', // Border/Divider (dark)
  },
};

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const user = useSelector(selectUser);
  const [theme, setTheme] = useState(() => {
    const isTelegram = window.Telegram?.WebApp;
    if (isTelegram && user?.theme === 'auto') {
      return window.Telegram.WebApp.colorScheme === 'dark' ? 'dark' : 'light';
    }
    return user?.theme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (user?.theme === 'auto' && window.Telegram?.WebApp) {
      setTheme(
        window.Telegram.WebApp.colorScheme === 'dark' ? 'dark' : 'light'
      );
    } else {
      setTheme(user?.theme === 'dark' ? 'dark' : 'light');
    }
    document.body.style.backgroundColor = themes[theme].background;
    document.body.style.color = themes[theme].textPrimary;
  }, [user?.theme, theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme); // Просто обновляем тему в состоянии
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
