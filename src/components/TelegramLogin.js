import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Установите корневой элемент для модального окна
Modal.setAppElement('#root');

const TelegramLogin = ({ onAuth, isOpen, onClose }) => {
  const [telegramScriptLoaded, setTelegramScriptLoaded] = useState(false);

  useEffect(() => {
    console.log('Attempting to load Telegram Widget script...');
    if (!telegramScriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js';
      script.async = true;
      script.onload = () => {
        console.log('Telegram Login Widget script loaded successfully');
        setTelegramScriptLoaded(true);
      };
      script.onerror = (error) => {
        console.error('Failed to load Telegram Login Widget script:', error);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [telegramScriptLoaded]);

  useEffect(() => {
    console.log(
      'Modal state changed, isOpen:',
      isOpen,
      'scriptLoaded:',
      telegramScriptLoaded
    );
    if (isOpen && telegramScriptLoaded && window.TelegramLoginWidget) {
      console.log('Initializing TelegramLoginWidget...');
      window.TelegramLoginWidget.load({
        data_onauth: (user) => {
          console.log('Telegram auth data received:', user);
          fetch('/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                alert(
                  `Logged in as ${user.first_name} ${user.last_name || ''} (${
                    user.id
                  }${user.username ? ', @' + user.username : ''})`
                );
                if (onAuth) onAuth(user);
                onClose();
              } else {
                alert('Authentication failed: ' + data.message);
              }
            })
            .catch((error) => console.error('Fetch error:', error));
        },
        data_telegram_login: '@EchoTipBot',
        data_size: 'large',
        data_request_access: 'write',
        data_auth_url: '/auth',
      });
    } else if (isOpen && !window.TelegramLoginWidget) {
      console.error('TelegramLoginWidget is not available');
    }
  }, [isOpen, telegramScriptLoaded, onAuth, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '90%',
        },
      }}
    >
      <h2 style={{ marginBottom: '15px' }}>Авторизация через Telegram</h2>
      <p>Нажмите кнопку ниже, чтобы войти через Telegram.</p>
      <div
        id="telegram-login-widget"
        data-telegram-login="@EchoTipBot"
        data-size="large"
        data-auth-url="/auth"
        data-request-access="write"
        style={{ marginTop: '15px', minHeight: '50px' }}
      ></div>
      <button
        onClick={onClose}
        style={{
          backgroundColor: '#ccc',
          color: '#000',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '15px',
        }}
      >
        Закрыть
      </button>
    </Modal>
  );
};

export default TelegramLogin;
