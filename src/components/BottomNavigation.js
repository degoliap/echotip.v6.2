import React, { useEffect, useState } from 'react';
import donate from '../assets/donate.png';
import history from '../assets/history.png';
import profile from '../assets/profile.png';
import streamer from '../assets/streamer.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import { ROUTES } from '../constants/routes.js';

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
  const { theme } = useTheme();

  useEffect(() => {
    setCurrentScreen(location.pathname);
  }, [location.pathname]);

  return (
    <nav
      className="fixed bottom-2 left-4 right-4 rounded-lg flex justify-around items-center h-[76px] z-50"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
      aria-label="Нижняя панель навигации"
    >
      {navItems.map(({ path, label, icon }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          style={{
            backgroundColor:
              currentScreen === path ? theme.accent : theme.background,
            color: theme.textPrimary,
            border: `1px solid ${theme.border}`,
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
