import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  HStack,
  Avatar,
  Badge,
  Flex,
  Spacer,
  useToast,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  useColorMode,
  Tooltip,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { InfoIcon, ExternalLinkIcon, ChatIcon, QuestionIcon, MoonIcon, SunIcon, CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface BackendUser {
  ctrl: number;
  refresh_token: string;
  free_used: number;
  lang: string;
  refresh_token_expires: string;
  mail: string | null;
  joined: string | null;
  pay_status: number;
  pay_date: string;
  user_id: number;
  pay_type: string;
  pay_warn: number;
  sub_url: string;
  username: string;
  corporated: number;
  promo: number;
}

interface PaymentResponse {
  payment_link: string;
  payment_id: number;
  order_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMonths, setSelectedMonths] = useState('1');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const avatarBorderColor = useColorModeValue('white', 'gray.700');
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      // Get user data from localStorage
      const userData = localStorage.getItem('telegramUser');
      if (!userData) {
        navigate('/login');
        return;
      }

      try {
        const telegramUser = JSON.parse(userData);
        setUser(telegramUser);

        // Send auth data to backend
        const authResponse = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(telegramUser),
        });

        if (!authResponse.ok) {
          throw new Error('Authentication failed');
        }

        const { access_token, refresh_token } = await authResponse.json();

        // Store tokens
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);

        // Fetch user data from backend
        const userResponse = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const backendUserData = await userResponse.json();
        setBackendUser(backendUserData);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to authenticate or fetch user data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      }
    };

    initializeAuth();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('telegramUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleRenewal = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/create_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ tariff: parseInt(selectedMonths) }),
      });

      if (!response.ok) throw new Error('Failed to create payment');

      const data: PaymentResponse = await response.json();
      setPaymentUrl(data.payment_link);
      window.open(data.payment_link, '_blank', 'noopener,noreferrer');
      handleCloseModal();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать платеж',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setPaymentUrl(null);
    setSelectedMonths('1');
    onClose();
  };

  const shouldShowRenewalButton = () => {
    if (!backendUser) return false;
    if (backendUser.pay_status !== 1) return true;

    const endDate = new Date(backendUser.pay_date);
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

    return endDate <= twoWeeksFromNow;
  };

  if (!user || !backendUser) {
    return null;
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.sm" py={6} position="relative" zIndex={1}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="brand.500">
                susi network
              </Heading>
            </VStack>
            <HStack spacing={4}>
              <Tooltip label={colorMode === 'light' ? 'Темная тема' : 'Светлая тема'}>
                <IconButton
                  aria-label="Toggle color mode"
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  size="lg"
                  _hover={{ transform: 'rotate(15deg)' }}
                  transition="all 0.2s"
                />
              </Tooltip>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={handleLogout}
                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                transition="all 0.2s"
              >
                Выйти
              </Button>
            </HStack>
          </HStack>

          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="xl"
            overflow="hidden"
            transition="all 0.3s"
            // _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
          >
            <CardBody>
              <VStack align="start" spacing={4}>
                <HStack spacing={4}>
                  <Avatar
                    size="xl"
                    name={user.first_name}
                    src={user.photo_url}
                    border="4px solid"
                    borderColor={avatarBorderColor}
                    boxShadow="xl"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xl" fontWeight="bold">
                      {user.first_name} {user.last_name || ''}
                    </Text>
                    {user.username && (
                      <Text color="gray.500">@{user.username}</Text>
                    )}
                    <Text color="gray.500">ID: {user.id}</Text>
                  </VStack>
                </HStack>
                <Divider />
                <HStack>
                  <Text fontWeight="medium">Статус подписки:</Text>
                  <Badge
                    colorScheme={backendUser.pay_status === 1 ? "green" : "red"}
                    px={2}
                    py={1}
                    borderRadius="full"
                    boxShadow="sm"
                  >
                    {backendUser.pay_status === 1 ? (
                      <HStack spacing={1}>
                        <CheckCircleIcon />
                        <Text>Активна</Text>
                      </HStack>
                    ) : (
                      <HStack spacing={1}>
                        <CloseIcon />
                        <Text>Неактивна</Text>
                      </HStack>
                    )}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="medium">
                    {backendUser.pay_status === 1 ? 'Действует до:' : 'Закончилась:'}
                  </Text>
                  <Text color={backendUser.pay_status === 1 ? "green.500" : "red.500"}>
                    {backendUser.pay_date}
                  </Text>
                </HStack>
                {shouldShowRenewalButton() && (
                  <Button
                    colorScheme="green"
                    size="lg"
                    onClick={onOpen}
                    leftIcon={<CheckCircleIcon />}
                    width="100%"
                  >
                    Продлить подписку
                  </Button>
                )}
                <Button
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<ExternalLinkIcon />}
                  onClick={() => window.open(backendUser.sub_url, '_blank')}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                  transition="all 0.2s"
                  isDisabled={backendUser.pay_status !== 1}
                  width="100%"
                >
                  Установить автоматически
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="xl"
            overflow="hidden"
            transition="all 0.3s"
            // _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
          >
            <CardHeader>
              <Heading size="md">Помощь</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<ChatIcon />}
                  onClick={() => window.open('https://t.me/susi_network_support', '_blank')}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                  transition="all 0.2s"
                  width="100%"
                >
                  Написать в поддержку
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<InfoIcon />}
                  onClick={() => window.open('https://acs.susi.ltd/howto/', '_blank')}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                  transition="all 0.2s"
                  width="100%"
                >
                  Инструкции
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<QuestionIcon />}
                  onClick={() => window.open('https://acs.susi.ltd/faq', '_blank')}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                  transition="all 0.2s"
                  width="100%"
                >
                  Вопрос-Ответ
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>Продление подписки</Text>
            </VStack>
            <Text fontSize="sm" color="gray.500">
              Выберите период подписки
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={3} spacing={4}>
                <Card
                  cursor="pointer"
                  onClick={() => setSelectedMonths('1')}
                  bg={selectedMonths === '1' ? (colorMode === 'dark' ? 'blue.900' : 'blue.50') : 'transparent'}
                  borderColor={selectedMonths === '1' ? 'blue.500' : 'gray.200'}
                  borderWidth="1px"
                  _hover={{ borderColor: 'blue.500', bg: colorMode === 'dark' ? 'blue.900' : 'blue.50' }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <VStack spacing={2}>
                      <Text fontWeight="bold">1 месяц</Text>
                    </VStack>
                  </CardBody>
                </Card>
                <Card
                  cursor="pointer"
                  onClick={() => setSelectedMonths('3')}
                  bg={selectedMonths === '3' ? (colorMode === 'dark' ? 'blue.900' : 'blue.50') : 'transparent'}
                  borderColor={selectedMonths === '3' ? 'blue.500' : 'gray.200'}
                  borderWidth="1px"
                  _hover={{ borderColor: 'blue.500', bg: colorMode === 'dark' ? 'blue.900' : 'blue.50' }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <VStack spacing={2}>
                      <Text fontWeight="bold">3 месяца</Text>
                    </VStack>
                  </CardBody>
                </Card>
                <Card
                  cursor="pointer"
                  onClick={() => setSelectedMonths('5')}
                  bg={selectedMonths === '5' ? (colorMode === 'dark' ? 'blue.900' : 'blue.50') : 'transparent'}
                  borderColor={selectedMonths === '5' ? 'blue.500' : 'gray.200'}
                  borderWidth="1px"
                  _hover={{ borderColor: 'blue.500', bg: colorMode === 'dark' ? 'blue.900' : 'blue.50' }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <VStack spacing={2}>
                      <Text fontWeight="bold">5 месяцев</Text>
                      <Badge colorScheme="green">Выгодно</Badge>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              <VStack spacing={4}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  onClick={handleRenewal}
                  isLoading={isLoading}
                  loadingText="Создание платежа..."
                  leftIcon={<CheckCircleIcon />}
                >
                  Создать платеж
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;