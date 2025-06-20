import React, { useEffect, useState } from 'react';
import donate from '../assets/donate.png';
import history from '../assets/history.png';
import profile from '../assets/profile.png';
import streamer from '../assets/streamer.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import { ROUTES } from '../constants/routes';

const navItems = [
  { path: ROUTES.DONATE, label: 'Донаты', icon: donate },
  { path: ROUTES.HISTORY, label: 'История', icon: history },
  { path: ROUTES.PROFILE, label: 'Профиль', icon: profile },
  { path: ROUTES.STREAMER, label: 'Стрим', icon: streamer },
];

function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState(location.pathname);
  const { theme } = useTheme(); // Получаем тему

  useEffect(() => {
    setCurrentScreen(location.pathname);
  }, [location.pathname]);

  // Проверка на undefined
  if (!theme) {
    return null; // Или загрузочный индикатор
  }

  return (
    <nav
      className="fixed bottom-2 left-4 right-4 rounded-lg flex justify-around items-center h-[76px] z-50"
      style={{
        backgroundColor: theme.surface || '#FFFFFF', // Фallback на случай undefined
        border: `1px solid ${theme.border || '#D1D5DB'}`,
      }}
      aria-label="Нижняя панель навигации"
    >
      {navItems.map(({ path, label, icon }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          style={{
            backgroundColor:
              currentScreen === path
                ? theme.accent || '#005BAC'
                : theme.background || '#F5F7FA',
            color: theme.textPrimary || '#1E1E1E',
            border: `1px solid ${theme.border || '#D1D5DB'}`,
          }}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors active:scale-95 ${
            currentScreen === path ? 'active-nav-button' : ''
          }`}
          aria-label={`Перейти к ${label}`}
          aria-current={currentScreen === path ? 'page' : undefined}
        >
          <img
            className="w-7 h-7 object-contain"
            src={icon}
            alt={`Иконка ${label}`}
          />
          <span className="text-xs text-center">{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNavigation;
