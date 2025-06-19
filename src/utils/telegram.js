export const getTelegramUser = () => {
  if (window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
};

export const getTheme = () => {
  if (window.Telegram?.WebApp) {
    return window.Telegram.WebApp.colorScheme === 'dark' ? 'dark' : 'light';
  }
  return 'light'; // Дефолт вне Telegram
};
