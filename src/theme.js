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
  const [theme, setTheme] = useState(themes.light); // Начальное значение по умолчанию

  useEffect(() => {
    if (user?.theme === 'auto' && window.Telegram?.WebApp) {
      setTheme(
        window.Telegram.WebApp.colorScheme === 'dark'
          ? themes.dark
          : themes.light
      );
    } else if (user) {
      setTheme(user?.theme === 'dark' ? themes.dark : themes.light);
    } else {
      // Гость: используем тему браузера
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setTheme(prefersDark ? themes.dark : themes.light);
    }
    // Применяем стили только после установки темы
    if (theme) {
      document.body.style.backgroundColor = theme.background;
      document.body.style.color = theme.textPrimary;
    }
  }, [user, theme]); // Добавили theme в зависимости

  const toggleTheme = (newTheme) => {
    const selectedTheme = newTheme === 'dark' ? themes.dark : themes.light;
    setTheme(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
