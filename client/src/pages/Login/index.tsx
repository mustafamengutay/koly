import { Box, Flex } from '@chakra-ui/react';
import LoginForm from '../../components/LoginForm/LoginForm';

export default function Login() {
  return (
    <Box>
      <Flex
        height='100vh'
        as='main'
        justifyContent='center'
        alignItems='center'
      >
        <LoginForm />
      </Flex>
    </Box>
  );
}
