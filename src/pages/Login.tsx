import React, { useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Define the Telegram user data interface
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// Extend the Window interface to include onTelegramAuth
declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}


const Login = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const token = localStorage.getItem('accessToken');
  console.log('token', token);
  console.log('localStorage', localStorage);
  if (token) {
    navigate('/dashboard');
  }

  // Function to verify Telegram authentication data
  const verifyTelegramData = (data: TelegramUser): boolean => {
    try {
      const authDate = data.auth_date;
      const now = Math.floor(Date.now() / 1000);
      if (now - authDate > 86400) {
        console.error('Authentication data is too old');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error verifying Telegram data:', error);
      return false;
    }
  };

  useEffect(() => {
    // Проверяем наличие токена в localStorage

    // Define the callback function for Telegram authentication
    window.onTelegramAuth = (user: TelegramUser) => {
      if (verifyTelegramData(user)) {
        console.log('Authentication successful!');
        localStorage.setItem('telegramUser', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        console.error('Authentication failed');
        alert('Authentication failed. Please try again.');
      }
    };

    // Load the Telegram widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'ssussi_bot'); // Replace with your bot username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    // Add the script to the page
    const container = document.getElementById('telegram-login');
    if (container) {
      container.appendChild(script);
    }

    // Cleanup
    return () => {
      if (container) {
        container.removeChild(script);
      }
    };
  }, [navigate]);

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.md" py={20}>
        <VStack spacing={8} align="center">
          <Heading size="xl">Привет, это susi network</Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            Подключись через аккаунт Telegram
          </Text>
          <Box id="telegram-login" />
        </VStack>
        <Text fontSize="sm" color="gray.500" maxW="md" mx="auto">
          Этот тип авторизации безопасен и необходим только чтобы связать ваш аккаунт Telegram с сайтом.
          Почитать подробнее можно <RouterLink to="https://core.telegram.org/widgets/login" target="_blank" rel="noopener noreferrer">тут</RouterLink>
        </Text>
      </Container>
    </Box>
  );
};

export default Login;