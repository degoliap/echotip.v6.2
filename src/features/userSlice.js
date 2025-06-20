import { createSlice } from '@reduxjs/toolkit';
import { getTelegramUser } from '../utils/telegram';

const loadData = () => {
  const data = localStorage.getItem('usersData');
  return data ? JSON.parse(data) : { users: [], metadata: { userCounter: 0 } };
};

const saveData = (data) => {
  localStorage.setItem('usersData', JSON.stringify(data));
};

const initialState = {
  value: {
    id: null,
    firstName: null,
    username: null,
    nickname: null,
    theme: 'auto',
    isLoading: true,
    error: null,
    isGuest: false, // Новый флаг для гостевого режима
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
        isLoading: false,
        error: null,
      };
    },
    updateNickname: (state, action) => {
      state.value.nickname = action.payload;
    },
    setTheme: (state, action) => {
      state.value.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.value.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.value.error = action.payload;
      state.value.isLoading = false;
    },
    setGuestMode: (state, action) => {
      state.value.isGuest = action.payload;
      state.value.isLoading = false;
    },
  },
});

export const {
  setUser,
  updateNickname,
  setTheme,
  setLoading,
  setError,
  setGuestMode,
} = userSlice.actions;

export const selectUser = (state) => state.user.value;

// Автоматическая регистрация или гостевой режим
export const autoRegisterUser = () => (dispatch) => {
  dispatch(setLoading(true));
  const telegramUser = getTelegramUser();
  if (telegramUser) {
    const data = loadData();
    const userId = telegramUser.id.toString();
    const existingUser = data.users.find((u) => u.id === userId);

    if (!existingUser) {
      console.log('New user detected, creating profile...');
      const registrationDate = new Date().toISOString();
      const newUser = {
        id: userId,
        firstName: telegramUser.first_name,
        username: telegramUser.username || `user${telegramUser.id}`,
        nickname: telegramUser.username || `user${telegramUser.id}`,
        registrationDate,
        serialNumber: data.metadata.userCounter + 1,
        theme: 'auto',
      };
      data.users.push(newUser);
      data.metadata.userCounter += 1;
      saveData(data);

      dispatch(setUser(newUser));
    } else {
      console.log('Existing user detected, loading data...');
      dispatch(
        setUser({
          ...existingUser,
          firstName: telegramUser.first_name,
          theme: existingUser.theme || 'auto',
        })
      );
    }
  } else {
    console.log('No Telegram data, entering guest mode...');
    dispatch(setGuestMode(true)); // Включаем гостевой режим
    // Можно задать дефолтные данные для гостя
    dispatch(
      setUser({
        id: `guest_${Date.now()}`, // Уникальный ID для гостя
        firstName: 'Гость',
        username: 'guest',
        nickname: 'Гость',
        theme: 'auto',
        isGuest: true,
      })
    );
  }
};

export const updateUserData = (userId, updates) => (dispatch, getState) => {
  const state = getState();
  const user = selectUser(state);
  if (user.id) {
    const data = loadData();
    const userIndex = data.users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      data.users[userIndex] = { ...data.users[userIndex], ...updates };
      saveData(data);
      dispatch(setUser({ ...user, ...updates }));
    }
  }
};

export const exportDataToFile = () => {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.json';
  a.click();
  URL.revokeObjectURL(url);
};

export default userSlice.reducer;
