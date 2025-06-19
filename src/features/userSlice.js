import { createSlice } from '@reduxjs/toolkit';
import { getTelegramUser, getTheme } from '../utils/telegram';
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const initialState = {
  value: {
    id: null,
    firstName: null,
    username: null,
    nickname: null,
    theme: 'auto',
    isLoading: true,
    error: null, // Для отображения ошибок
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
  },
});

export const { setUser, updateNickname, setTheme, setLoading, setError } =
  userSlice.actions;

export const selectUser = (state) => state.user.value;

// Автоматическая регистрация при первом входе с повторными попытками
export const autoRegisterUser = () => async (dispatch) => {
  dispatch(setLoading(true));
  const telegramUser = getTelegramUser();
  if (!telegramUser) {
    console.error(
      'Telegram user data not available:',
      window.Telegram?.WebApp.initDataUnsafe
    );
    dispatch(setError('Не удалось получить данные пользователя из Telegram'));
    return;
  }

  const userId = telegramUser.id.toString();
  const userRef = doc(db, 'users', userId);
  const maxRetries = 3;
  let attempt = 0;

  const tryRegister = async (retryCount) => {
    try {
      // Проверка статуса подключения
      const connected = await new Promise((resolve) => {
        onSnapshot(
          doc(db, '.info/connected'),
          (snapshot) => {
            resolve(snapshot.data()?.connected || false);
          },
          () => resolve(false)
        );
      });

      if (!connected && retryCount < maxRetries) {
        console.warn(
          `Offline mode detected, retrying (${retryCount + 1}/${maxRetries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Ждём 2 секунды перед повторной попыткой
        return tryRegister(retryCount + 1);
      } else if (!connected) {
        throw new Error(
          'Нет подключения к Firebase после максимального числа попыток'
        );
      }

      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log('New user detected, creating profile...');
        const registrationDate = new Date().toISOString();
        const theme = getTheme();
        const serialNumber =
          (await getDoc(doc(db, 'metadata', 'userCounter'))).data()?.count || 0;
        await setDoc(userRef, {
          telegramId: telegramUser.id,
          username: telegramUser.username || `user${telegramUser.id}`,
          nickname: telegramUser.username || `user${telegramUser.id}`,
          registrationDate,
          serialNumber: serialNumber + 1,
          theme: 'auto',
        });
        await setDoc(
          doc(db, 'metadata', 'userCounter'),
          { count: serialNumber + 1 },
          { merge: true }
        );

        dispatch(
          setUser({
            id: userId,
            firstName: telegramUser.first_name,
            username: telegramUser.username || `user${telegramUser.id}`,
            nickname: telegramUser.username || `user${telegramUser.id}`,
            theme: 'auto',
          })
        );
      } else {
        console.log('Existing user detected, loading data...');
        const data = userDoc.data();
        dispatch(
          setUser({
            id: userId,
            firstName: telegramUser.first_name,
            username: data.username,
            nickname: data.nickname,
            theme: data.theme || 'auto',
          })
        );
      }
    } catch (error) {
      console.error('Error registering user:', error.message);
      dispatch(setError(`Ошибка: ${error.message}`));
    }
  };

  await tryRegister(0);
};

export default userSlice.reducer;
