import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNickname, updateUserData } from '../features/userSlice';
import { selectUser } from '../features/userSlice';
import { useTheme } from '../theme';
import TelegramLogin from '../components/TelegramLogin';

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { theme, toggleTheme } = useTheme();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [themeMode, setThemeMode] = useState(
    user?.theme === 'auto' ? 'auto' : 'manual'
  );
  const [manualTheme, setManualTheme] = useState(
    user?.theme === 'dark' ? 'dark' : 'light'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    if (user?.id && !user.isGuest) {
      const updates = { nickname };
      if (themeMode === 'manual') updates.theme = manualTheme;
      else updates.theme = 'auto';
      dispatch(updateUserData(user.id, updates));
      dispatch(updateNickname(nickname));
      if (themeMode === 'manual') toggleTheme(manualTheme);
      else toggleTheme('auto');
    }
  };

  const handleTelegramLogin = () => {
    setIsModalOpen(true);
  };

  const handleLoginClose = () => {
    setIsModalOpen(false);
  };

  const handleTelegramAuth = (user) => {
    dispatch({ type: 'user/setUser', payload: { ...user, isGuest: false } });
  };

  useEffect(() => {
    const data = localStorage.getItem('usersData');
    if (data) {
      const parsedData = JSON.parse(data);
      const savedUser = parsedData.users.find((u) => u.id === user?.id);
      if (savedUser && !user?.isGuest) {
        dispatch({ type: 'user/setUser', payload: savedUser });
      }
    }
  }, [dispatch, user?.id, user?.isGuest]);

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: theme.background,
        color: theme.textPrimary,
        minHeight: 'calc(100vh - 76px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      <h1
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}
      >
        Профиль
      </h1>
      {user?.isLoading ? (
        <p style={{ fontSize: '16px' }}>Загрузка данных...</p>
      ) : user?.error ? (
        <p style={{ fontSize: '16px', color: '#FF4444' }}>{user.error}</p>
      ) : user?.isGuest ? (
        <div>
          <p style={{ fontSize: '16px' }}>
            Режим гостя. Авторизуйтесь через Telegram для полного доступа.
          </p>
          <button
            onClick={handleTelegramLogin}
            style={{
              backgroundColor: '#0088cc',
              color: '#FFFFFF',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '15px',
            }}
          >
            Авторизоваться через Telegram
          </button>
          <div>
            <label
              style={{
                fontSize: '16px',
                marginBottom: '5px',
                display: 'block',
              }}
            >
              Никнейм:
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Гость"
              disabled
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                backgroundColor: theme.surface,
                color: theme.textPrimary,
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: '16px',
                marginBottom: '5px',
                display: 'block',
              }}
            >
              Тема:
            </label>
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value)}
              style={{
                padding: '8px',
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                marginBottom: '10px',
              }}
            >
              <option value="auto">Автоматически</option>
              <option value="manual">Ручной выбор</option>
            </select>
            {themeMode === 'manual' && (
              <select
                value={manualTheme}
                onChange={(e) => {
                  setManualTheme(e.target.value);
                  toggleTheme(e.target.value);
                }}
                style={{
                  padding: '8px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  backgroundColor: theme.surface,
                  color: theme.textPrimary,
                }}
              >
                <option value="light">Светлая</option>
                <option value="dark">Тёмная</option>
              </select>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled
            style={{
              backgroundColor: theme.accent,
              color: '#FFFFFF',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: 'fit-content',
              opacity: '0.6',
            }}
          >
            Сохранить
          </button>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <p>ID: {user?.id || 'Не определён'}</p>
            <p>Имя: {user?.firstName || 'Не определено'}</p>
            <p>Логин: {user?.username || 'Не определён'}</p>
          </div>
        </div>
      ) : (
        <>
          <div>
            <label
              style={{
                fontSize: '16px',
                marginBottom: '5px',
                display: 'block',
              }}
            >
              Никнейм:
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Введите никнейм"
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                backgroundColor: theme.surface,
                color: theme.textPrimary,
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: '16px',
                marginBottom: '5px',
                display: 'block',
              }}
            >
              Тема:
            </label>
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value)}
              style={{
                padding: '8px',
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                marginBottom: '10px',
              }}
            >
              <option value="auto">Автоматически</option>
              <option value="manual">Ручной выбор</option>
            </select>
            {themeMode === 'manual' && (
              <select
                value={manualTheme}
                onChange={(e) => {
                  setManualTheme(e.target.value);
                  toggleTheme(e.target.value);
                }}
                style={{
                  padding: '8px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  backgroundColor: theme.surface,
                  color: theme.textPrimary,
                }}
              >
                <option value="light">Светлая</option>
                <option value="dark">Тёмная</option>
              </select>
            )}
          </div>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: theme.accent,
              color: '#FFFFFF',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: 'fit-content',
            }}
          >
            Сохранить
          </button>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <p>ID: {user?.id || 'Не определён'}</p>
            <p>Имя: {user?.firstName || 'Не определено'}</p>
            <p>Логин: {user?.username || 'Не определён'}</p>
          </div>
        </>
      )}
      <TelegramLogin
        isOpen={isModalOpen}
        onClose={handleLoginClose}
        onAuth={handleTelegramAuth}
      />
    </div>
  );
}

export default Profile;
