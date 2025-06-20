/*Импортируем функцию configureStore из Redux Toolkit
  Эта функция упрощает настройку Redux-хранилища и автоматически подключает полезные инструменты (например, Redux DevTools и middleware) */
import { configureStore } from '@reduxjs/toolkit';

/*Импортируем редьюсер пользователя из userSlice.js
  Это "кусочек" хранилища, отвечающий за данные пользователя (авторизация, тема, и т.д.) */
import userReducer from '../features/userSlice';

// Создаём Redux-хранилище
export const store = configureStore({
  /*Здесь мы указываем объект всех редьюсеров
    Каждый ключ будет соответствовать "ветке" состояния в общем store */
  reducer: {
    // Ветка "user" будет обрабатываться редьюсером userReducer
    user: userReducer,
  },
});
