import './App.css';
import Streamer from './screens/Streamer';
import Donate from './screens/Donate';
import Profile from './screens/Profile';
import History from './screens/History';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import { ThemeProvider } from './theme';
import { useEffect } from 'react'; // Убрали useState, так как модал больше не нужен
import { useDispatch } from 'react-redux';
import { autoRegisterUser } from './features/userSlice';

function RedirectToDonate() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/donate');
  }, [navigate]);
  return null;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(autoRegisterUser());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router>
        <div style={{ minHeight: '100vh' }}>
          <BottomNavigation />
          <Routes>
            <Route path="/" element={<RedirectToDonate />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/history" element={<History />} />
            <Route path="/streamer" element={<Streamer />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
