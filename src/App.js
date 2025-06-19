import './App.css';
import Streamer from './screens/Streamer';
import Donate from './screens/Donate';
import Profile from './screens/Profile';
import History from './screens/History';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import { ThemeProvider } from './theme';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { autoRegisterUser } from './features/userSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Инициализация Telegram Web App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      console.log(
        'Telegram Web App initialized:',
        window.Telegram.WebApp.initDataUnsafe
      );
    }
    // Регистрация пользователя
    dispatch(autoRegisterUser());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router>
        <div style={{ minHeight: '100vh' }}>
          <BottomNavigation />
          <Routes>
            <Route path="/donate" element={<Donate />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/streamer" element={<Streamer />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
