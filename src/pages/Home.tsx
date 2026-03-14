import { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SpeedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="center">
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl" bgGradient="linear(to-r, brand.400, brand.600)" bgClip="text">
              susi network
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="xl">
              Безопасный и быстрый доступ к интернету
            </Text>
            <Button size="lg" colorScheme="brand" onClick={() => navigate('/login')}>
              Начать
            </Button>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} width="100%">
            <Box p={5} bg={cardBg} borderRadius="lg">
              <VStack spacing={3} align="center">
                <Icon as={ShieldIcon} boxSize={8} color="brand.500" />
                <Heading size="md">Безопасность</Heading>
                <Text textAlign="center" color="gray.600">
                  Защита данных с помощью современных технологий шифрования
                </Text>
              </VStack>
            </Box>

            <Box p={5} bg={cardBg} borderRadius="lg">
              <VStack spacing={3} align="center">
                <Icon as={GlobeIcon} boxSize={8} color="brand.500" />
                <Heading size="md">Доступ</Heading>
                <Text textAlign="center" color="gray.600">
                  Серверы по всему миру для стабильного соединения
                </Text>
              </VStack>
            </Box>

            <Box p={5} bg={cardBg} borderRadius="lg">
              <VStack spacing={3} align="center">
                <Icon as={SpeedIcon} boxSize={8} color="brand.500" />
                <Heading size="md">Скорость</Heading>
                <Text textAlign="center" color="gray.600">
                  Быстрое соединение для комфортного использования
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>

          <Box p={6} bg={cardBg} borderRadius="lg" width="100%">
            <VStack spacing={4} align="center">
              <Heading size="md">Почему susi network?</Heading>
              <Text color="gray.600" textAlign="center">
                Надежная защита вашей приватности и анонимности в интернете.
                Подходит для работы, учебы и развлечений.
              </Text>
              <Button colorScheme="brand" onClick={() => navigate('/login')}>
                Подключиться
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;