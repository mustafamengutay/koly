import { Box, Flex } from '@chakra-ui/react';
import LoginForm from '../../components/LoginForm/LoginForm';
import AppLayout from '../../components/layouts/AppLayout';

export default function Login() {
  return (
    <AppLayout>
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
    </AppLayout>
  );
}
